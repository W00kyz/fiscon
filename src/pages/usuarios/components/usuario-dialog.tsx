import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import {
  usuarioFormSchema,
  type UsuarioFormData,
} from "@/schemas/usuario.schema.ts"
import type { Usuario } from "@/types/usuario.ts"

type UsuarioDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly usuario?: Usuario | null
  readonly onSubmit: (data: UsuarioFormData) => void
  readonly isLoading?: boolean
}

export const UsuarioDialog = ({
  open,
  onOpenChange,
  usuario,
  onSubmit,
  isLoading,
}: UsuarioDialogProps) => {
  const [displayedUsuario, setDisplayedUsuario] = useState(usuario)
  if (open && usuario && usuario !== displayedUsuario) {
    setDisplayedUsuario(usuario)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioFormSchema),
    values: displayedUsuario
      ? {
          nome: displayedUsuario.nome,
          email: displayedUsuario.email,
          role: displayedUsuario.role,
          ativo: displayedUsuario.ativo,
        }
      : { nome: "", email: "", role: "fiscal", ativo: true },
  })

  const ativo = watch("ativo")

  const handleFormSubmit = (data: UsuarioFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {displayedUsuario ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register("nome")} />
            {errors.nome && (
              <p className="text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Perfil</Label>
            <Select
              value={watch("role")}
              onValueChange={(val) =>
                setValue("role", val as "fiscal" | "administrador")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiscal">Fiscal</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="ativo"
              checked={ativo}
              onCheckedChange={(checked) =>
                setValue("ativo", checked === true)
              }
            />
            <Label htmlFor="ativo">Usuário ativo</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
