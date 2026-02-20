import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { login } from "@/api/auth.api.ts"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { loginSchema } from "@/schemas/login.schema.ts"
import type { LoginFormData } from "@/schemas/login.schema.ts"
import { useAuthStore } from "@/stores/auth.store.ts"

const LoginPage = () => {
  const navigate = useNavigate()
  const authLogin = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data)
      authLogin(user)
      toast.success(`Bem-vindo, ${user.nome}!`)
      void navigate("/")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer login")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">FISCON</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sistema de Fiscalização Administrativa
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••"
                {...register("senha")}
              />
              {errors.senha && (
                <p className="text-xs text-destructive">
                  {errors.senha.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border bg-muted/50 p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Credenciais de demonstração:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>Admin:</strong> admin@fiscon.com / admin
              </p>
              <p>
                <strong>Fiscal:</strong> fiscal@fiscon.com / fiscal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
