import { zodResolver } from "@hookform/resolvers/zod"
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
  contratoFormSchema,
  type ContratoFormData,
} from "@/schemas/contrato.schema.ts"
import type { Contrato } from "@/types/contrato.ts"

type ContratoDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly empresaId: string
  readonly contrato?: Contrato | null
  readonly onSubmit: (data: ContratoFormData) => void
  readonly isLoading?: boolean
}

export const ContratoDialog = ({
  open,
  onOpenChange,
  empresaId,
  contrato,
  onSubmit,
  isLoading,
}: ContratoDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContratoFormData>({
    resolver: zodResolver(contratoFormSchema),
    values: contrato
      ? {
          empresaId: contrato.empresaId,
          numero: contrato.numero,
          descricao: contrato.descricao,
          dataInicio: contrato.dataInicio,
          dataFim: contrato.dataFim,
          valor: contrato.valor,
          ativo: contrato.ativo,
        }
      : {
          empresaId,
          numero: "",
          descricao: "",
          dataInicio: "",
          dataFim: "",
          valor: 0,
          ativo: true,
        },
  })

  const ativo = watch("ativo")

  const handleFormSubmit = (data: ContratoFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {contrato ? "Editar Contrato" : "Novo Contrato"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input type="hidden" {...register("empresaId")} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" placeholder="CT-2025/001" {...register("numero")} />
              {errors.numero && (
                <p className="text-xs text-destructive">
                  {errors.numero.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                {...register("valor", { valueAsNumber: true })}
              />
              {errors.valor && (
                <p className="text-xs text-destructive">
                  {errors.valor.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" {...register("descricao")} />
            {errors.descricao && (
              <p className="text-xs text-destructive">
                {errors.descricao.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input id="dataInicio" type="date" {...register("dataInicio")} />
              {errors.dataInicio && (
                <p className="text-xs text-destructive">
                  {errors.dataInicio.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input id="dataFim" type="date" {...register("dataFim")} />
              {errors.dataFim && (
                <p className="text-xs text-destructive">
                  {errors.dataFim.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="ativo"
              checked={ativo}
              onCheckedChange={(checked) =>
                setValue("ativo", checked === true)
              }
            />
            <Label htmlFor="ativo">Contrato ativo</Label>
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
