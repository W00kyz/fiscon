import { randomDelay } from "./client.ts"
import { getUsuarios } from "./mock-data/store.ts"
import type { LoginFormData } from "@/schemas/login.schema.ts"
import type { User } from "@/types/auth.ts"

const mockPasswords: Record<string, string> = {
  "admin@fiscon.com": "admin",
  "fiscal@fiscon.com": "fiscal",
  "maria@fiscon.com": "fiscal",
  "joao@fiscon.com": "fiscal",
}

export const login = async (data: LoginFormData): Promise<User> => {
  await randomDelay()

  const password = mockPasswords[data.email]
  if (!password || password !== data.senha) {
    throw new Error("Email ou senha inválidos")
  }

  const usuario = getUsuarios().find((u) => u.email === data.email)
  if (!usuario || !usuario.ativo) {
    throw new Error("Usuário inativo ou não encontrado")
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
  }
}
