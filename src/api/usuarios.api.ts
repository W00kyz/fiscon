import { randomDelay } from "./client.ts"
import { getUsuarios, setUsuarios } from "./mock-data/store.ts"
import type { UsuarioFormData } from "@/schemas/usuario.schema.ts"
import type { Usuario } from "@/types/usuario.ts"

export const fetchUsuarios = async (): Promise<readonly Usuario[]> => {
  await randomDelay()
  return getUsuarios()
}

export const fetchUsuario = async (id: string): Promise<Usuario> => {
  await randomDelay()
  const usuario = getUsuarios().find((u) => u.id === id)
  if (!usuario) throw new Error("Usuário não encontrado")
  return usuario
}

export const createUsuario = async (
  data: UsuarioFormData,
): Promise<Usuario> => {
  await randomDelay()
  const now = new Date().toISOString()
  const newUsuario: Usuario = {
    id: `usr-${crypto.randomUUID().slice(0, 8)}`,
    ...data,
    createdAt: now,
    updatedAt: now,
  }
  setUsuarios([...getUsuarios(), newUsuario])
  return newUsuario
}

export const updateUsuario = async (
  id: string,
  data: UsuarioFormData,
): Promise<Usuario> => {
  await randomDelay()
  const now = new Date().toISOString()
  const updated = getUsuarios().map((u) =>
    u.id === id ? { ...u, ...data, updatedAt: now } : u,
  )
  setUsuarios(updated)
  const usuario = updated.find((u) => u.id === id)
  if (!usuario) throw new Error("Usuário não encontrado")
  return usuario
}

export const deleteUsuario = async (id: string): Promise<void> => {
  await randomDelay()
  setUsuarios(getUsuarios().filter((u) => u.id !== id))
}
