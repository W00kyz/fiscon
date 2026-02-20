import { z } from "zod"

const getCurrentYearMonth = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export const mesAnoSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Formato inválido (AAAA-MM)")
  .refine(
    (val) => {
      const month = Number(val.split("-")[1])
      return month >= 1 && month <= 12
    },
    { message: "Mês deve ser entre 01 e 12" },
  )
  .refine(
    (val) => {
      const year = Number(val.split("-")[0])
      return year >= 2020
    },
    { message: "Ano deve ser a partir de 2020" },
  )
  .refine((val) => val <= getCurrentYearMonth(), {
    message: "Data não pode ser futura",
  })

export const fiscalizacaoFormSchema = z.object({
  empresaId: z.string().min(1, "Empresa obrigatória"),
  contratoId: z.string().min(1, "Contrato obrigatório"),
  mesAno: mesAnoSchema,
})

export type FiscalizacaoFormData = z.infer<typeof fiscalizacaoFormSchema>
