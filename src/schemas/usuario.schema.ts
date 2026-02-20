import { z } from "zod"

export const usuarioFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email inválido"),
  role: z.enum(["fiscal", "administrador"]),
  ativo: z.boolean(),
})

export type UsuarioFormData = z.infer<typeof usuarioFormSchema>
