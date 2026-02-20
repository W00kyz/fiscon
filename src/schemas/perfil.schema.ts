import { z } from "zod"

export const passwordChangeSchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual obrigatória"),
    novaSenha: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirmação obrigatória"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "Senhas não conferem",
    path: ["confirmarSenha"],
  })

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>
