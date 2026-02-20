import { z } from "zod"

export const contratoFormSchema = z.object({
  empresaId: z.string().min(1, "Empresa obrigatória"),
  numero: z.string().min(1, "Número do contrato obrigatório"),
  descricao: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  dataInicio: z.string().min(1, "Data de início obrigatória"),
  dataFim: z.string().min(1, "Data de fim obrigatória"),
  valor: z.number().positive("Valor deve ser positivo"),
  ativo: z.boolean(),
})

export type ContratoFormData = z.infer<typeof contratoFormSchema>
