import { z } from "zod"
import { mesAnoSchema } from "@/schemas/fiscalizacao.schema.ts"

export const relatorioFilterSchema = z.object({
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  empresaId: z.string().optional(),
  contratoId: z.string().optional(),
})

export type RelatorioFilterData = z.infer<typeof relatorioFilterSchema>

export const relatorioConformidadeFilterSchema = z
  .object({
    empresaId: z.string().optional(),
    mesAnoInicio: mesAnoSchema.optional(),
    mesAnoFim: mesAnoSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.mesAnoInicio && data.mesAnoFim) {
        return data.mesAnoInicio <= data.mesAnoFim
      }
      return true
    },
    { message: "Período início deve ser anterior ao fim", path: ["mesAnoFim"] },
  )

export type RelatorioConformidadeFilterData = z.infer<
  typeof relatorioConformidadeFilterSchema
>
