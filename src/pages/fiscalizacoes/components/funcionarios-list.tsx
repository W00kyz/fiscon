import { useFieldArray, useFormContext } from "react-hook-form"
import { Badge } from "@/components/ui/badge.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { RISCO_COLORS, RISCO_LABELS } from "@/lib/constants.ts"
import { cn } from "@/lib/utils.ts"
import type { FuncionariosFormData } from "@/schemas/funcionario.schema.ts"
import type { RiscoInconformidade } from "@/types/funcionario.ts"

export const FuncionariosList = () => {
  const { register, control, setValue, watch, formState: { dirtyFields } } =
    useFormContext<FuncionariosFormData>()
  const { fields } = useFieldArray({ control, name: "funcionarios" })

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <h3 className="text-sm font-semibold">
          Funcionários ({fields.length})
        </h3>
        {fields.map((field, index) => {
          const risco = watch(
            `funcionarios.${index}.riscoInconformidade`,
          ) as RiscoInconformidade
          const dirty = dirtyFields.funcionarios?.[index] ?? {}
          const isDirty = (field: string) => !!dirty[field as keyof typeof dirty]

          return (
            <div
              key={field.id}
              className="space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <Badge
                  variant="outline"
                  className={RISCO_COLORS[risco]}
                >
                  {RISCO_LABELS[risco]}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Nome</Label>
                  <Input
                    className={cn("h-8 text-sm", isDirty("nome") && "border-amber-400")}
                    {...register(`funcionarios.${index}.nome`)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cargo</Label>
                  <Input
                    className={cn("h-8 text-sm", isDirty("cargo") && "border-amber-400")}
                    {...register(`funcionarios.${index}.cargo`)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Salário (R$)</Label>
                  <Input
                    className={cn("h-8 text-sm", isDirty("salario") && "border-amber-400")}
                    type="number"
                    step="0.01"
                    {...register(`funcionarios.${index}.salario`)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Horas Trabalhadas</Label>
                  <Input
                    className={cn("h-8 text-sm", isDirty("horasTrabalhadas") && "border-amber-400")}
                    type="number"
                    {...register(`funcionarios.${index}.horasTrabalhadas`)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {(
                  [
                    ["recebeuVT", "VT"],
                    ["recebeuFGTS", "FGTS"],
                    ["recebeuINSS", "INSS"],
                    ["recebeuCestaBasica", "Cesta Básica"],
                    ["substituto", "Substituto"],
                  ] as const
                ).map(([fieldName, label]) => (
                  <div
                    key={fieldName}
                    className="flex items-center gap-1.5"
                  >
                    <Checkbox
                      id={`func-${index}-${fieldName}`}
                      checked={
                        watch(`funcionarios.${index}.${fieldName}`) as boolean
                      }
                      onCheckedChange={(checked) =>
                        setValue(
                          `funcionarios.${index}.${fieldName}`,
                          checked === true,
                          { shouldDirty: true },
                        )
                      }
                    />
                    <Label
                      htmlFor={`func-${index}-${fieldName}`}
                      className={cn("text-xs", isDirty(fieldName) && "font-medium text-amber-600")}
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
