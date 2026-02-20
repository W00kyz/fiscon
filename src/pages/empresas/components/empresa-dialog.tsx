import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  empresaFormSchema,
  type EmpresaFormData,
} from "@/schemas/empresa.schema.ts"
import type { Empresa } from "@/types/empresa.ts"

type EmpresaDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly empresa?: Empresa | null
  readonly onSubmit: (data: EmpresaFormData) => void
  readonly isLoading?: boolean
}

export const EmpresaDialog = ({
  open,
  onOpenChange,
  empresa,
  onSubmit,
  isLoading,
}: EmpresaDialogProps) => {
  const [displayedEmpresa, setDisplayedEmpresa] = useState(empresa)
  if (open && empresa && empresa !== displayedEmpresa) {
    setDisplayedEmpresa(empresa)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaFormSchema),
    values: displayedEmpresa
      ? {
          nome: displayedEmpresa.nome,
          cnpj: displayedEmpresa.cnpj,
          endereco: displayedEmpresa.endereco,
          telefone: displayedEmpresa.telefone,
          email: displayedEmpresa.email,
        }
      : undefined,
  })

  const handleFormSubmit = (data: EmpresaFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {displayedEmpresa ? "Editar Empresa" : "Nova Empresa"}
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
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              placeholder="XX.XXX.XXX/XXXX-XX"
              {...register("cnpj")}
            />
            {errors.cnpj && (
              <p className="text-xs text-destructive">{errors.cnpj.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" {...register("endereco")} />
            {errors.endereco && (
              <p className="text-xs text-destructive">
                {errors.endereco.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" {...register("telefone")} />
              {errors.telefone && (
                <p className="text-xs text-destructive">
                  {errors.telefone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
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
