export type UserRole = "fiscal" | "administrador"

export type User = {
  readonly id: string
  readonly nome: string
  readonly email: string
  readonly role: UserRole
}

export type AuthState = {
  readonly user: User | null
  readonly isAuthenticated: boolean
}
