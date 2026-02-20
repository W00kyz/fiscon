import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updatePassword } from "@/api/perfil.api.ts"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  passwordChangeSchema,
  type PasswordChangeData,
} from "@/schemas/perfil.schema.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import { usePreferencesStore } from "@/stores/preferences.store.ts"

const PerfilPage = () => {
  const user = useAuthStore((s) => s.user)
  const {
    emailNotifications,
    soundEnabled,
    twoFactorEnabled,
    setEmailNotifications,
    setSoundEnabled,
    setTwoFactorEnabled,
  } = usePreferencesStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { senhaAtual: "", novaSenha: "", confirmarSenha: "" },
  })

  const onPasswordSubmit = async (data: PasswordChangeData) => {
    await updatePassword(data.senhaAtual, data.novaSenha)
    toast.success("Senha alterada com sucesso")
    reset()
  }

  return (
    <div>
      <PageHeader title="Perfil" description="Configurações da sua conta" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Nome</Label>
              <p className="text-sm font-medium">{user?.nome}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Perfil</Label>
              <p className="text-sm font-medium capitalize">{user?.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="senhaAtual">Senha Atual</Label>
                <Input
                  id="senhaAtual"
                  type="password"
                  {...register("senhaAtual")}
                />
                {errors.senhaAtual && (
                  <p className="text-xs text-destructive">
                    {errors.senhaAtual.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <Input
                  id="novaSenha"
                  type="password"
                  {...register("novaSenha")}
                />
                {errors.novaSenha && (
                  <p className="text-xs text-destructive">
                    {errors.novaSenha.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  {...register("confirmarSenha")}
                />
                {errors.confirmarSenha && (
                  <p className="text-xs text-destructive">
                    {errors.confirmarSenha.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Alterando..." : "Alterar Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={(checked) =>
                  setEmailNotifications(checked === true)
                }
              />
              <Label htmlFor="email-notif" className="cursor-pointer">
                Receber notificações por email
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="sound-notif"
                checked={soundEnabled}
                onCheckedChange={(checked) =>
                  setSoundEnabled(checked === true)
                }
              />
              <Label htmlFor="sound-notif" className="cursor-pointer">
                Som de notificação
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="2fa"
                checked={twoFactorEnabled}
                onCheckedChange={(checked) =>
                  setTwoFactorEnabled(checked === true)
                }
              />
              <Label htmlFor="2fa" className="cursor-pointer">
                Autenticação de dois fatores (2FA)
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {twoFactorEnabled
                ? "2FA está ativado. Você receberá um código de verificação ao fazer login."
                : "Ative a autenticação de dois fatores para maior segurança da sua conta."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PerfilPage
