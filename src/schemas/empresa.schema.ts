import { z } from "zod"

export const empresaFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cnpj: z
    .string()
    .regex(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      "CNPJ inválido (formato: XX.XXX.XXX/XXXX-XX)",
    ),
  endereco: z.string().min(5, "Endereço obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
})

export type EmpresaFormData = z.infer<typeof empresaFormSchema>
