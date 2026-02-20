import { z } from "zod"

export const funcionarioSchema = z.object({
  id: z.string(),
  fiscalizacaoId: z.string(),
  nome: z.string().min(2, "Nome obrigatório"),
  cargo: z.string().min(1, "Cargo obrigatório"),
  salario: z.number().nonnegative("Salário inválido"),
  recebeuVT: z.boolean(),
  recebeuFGTS: z.boolean(),
  recebeuINSS: z.boolean(),
  recebeuCestaBasica: z.boolean(),
  substituto: z.boolean(),
  horasTrabalhadas: z.number().nonnegative("Horas inválidas"),
  riscoInconformidade: z.enum(["alto", "medio", "baixo"]),
})

export const funcionariosFormSchema = z.object({
  funcionarios: z.array(funcionarioSchema),
})

export type FuncionariosFormData = z.infer<typeof funcionariosFormSchema>
