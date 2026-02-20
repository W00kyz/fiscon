import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { useCreateContrato } from "@/hooks/use-contratos.ts"
import { useEmpresas } from "@/hooks/use-empresas.ts"
import {
  contratoFormSchema,
  type ContratoFormData,
} from "@/schemas/contrato.schema.ts"

type NovoContratoQuickDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export const NovoContratoQuickDialog = ({
  open,
  onOpenChange,
}: NovoContratoQuickDialogProps) => {
  const { data: empresas = [] } = useEmpresas()
  const createMutation = useCreateContrato()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContratoFormData>({
    resolver: zodResolver(contratoFormSchema),
    defaultValues: {
      empresaId: "",
      numero: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
      valor: 0,
      ativo: true,
    },
  })

  const ativo = watch("ativo")
  const empresaId = watch("empresaId")

  const handleFormSubmit = (data: ContratoFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Contrato criado com sucesso")
        reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Contrato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Empresa</Label>
            <Select
              value={empresaId}
              onValueChange={(val) => setValue("empresaId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.empresaId && (
              <p className="text-xs text-destructive">
                {errors.empresaId.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="q-numero">Número</Label>
              <Input
                id="q-numero"
                placeholder="CT-2025/001"
                {...register("numero")}
              />
              {errors.numero && (
                <p className="text-xs text-destructive">
                  {errors.numero.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-valor">Valor (R$)</Label>
              <Input
                id="q-valor"
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
            <Label htmlFor="q-descricao">Descrição</Label>
            <Input id="q-descricao" {...register("descricao")} />
            {errors.descricao && (
              <p className="text-xs text-destructive">
                {errors.descricao.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="q-dataInicio">Data Início</Label>
              <Input
                id="q-dataInicio"
                type="date"
                {...register("dataInicio")}
              />
              {errors.dataInicio && (
                <p className="text-xs text-destructive">
                  {errors.dataInicio.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-dataFim">Data Fim</Label>
              <Input id="q-dataFim" type="date" {...register("dataFim")} />
              {errors.dataFim && (
                <p className="text-xs text-destructive">
                  {errors.dataFim.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="q-ativo"
              checked={ativo}
              onCheckedChange={(checked) =>
                setValue("ativo", checked === true)
              }
            />
            <Label htmlFor="q-ativo">Contrato ativo</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
