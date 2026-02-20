import type { Usuario } from "@/types/usuario.ts"

export const initialUsuarios: readonly Usuario[] = [
  {
    id: "usr-1",
    nome: "Ana Silva",
    email: "admin@fiscon.com",
    role: "administrador",
    ativo: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "usr-2",
    nome: "Carlos Oliveira",
    email: "fiscal@fiscon.com",
    role: "fiscal",
    ativo: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "usr-3",
    nome: "Maria Santos",
    email: "maria@fiscon.com",
    role: "fiscal",
    ativo: true,
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "usr-4",
    nome: "João Pereira",
    email: "joao@fiscon.com",
    role: "fiscal",
    ativo: false,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
]
