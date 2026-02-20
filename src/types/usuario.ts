import type { UserRole } from "./auth.ts"

export type Usuario = {
  readonly id: string
  readonly nome: string
  readonly email: string
  readonly role: UserRole
  readonly ativo: boolean
  readonly createdAt: string
  readonly updatedAt: string
}
