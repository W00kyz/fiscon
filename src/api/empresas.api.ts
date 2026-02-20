import { randomDelay } from "./client.ts"
import { getEmpresas, setEmpresas } from "./mock-data/store.ts"
import type { EmpresaFormData } from "@/schemas/empresa.schema.ts"
import type { Empresa } from "@/types/empresa.ts"

export const fetchEmpresas = async (): Promise<readonly Empresa[]> => {
  await randomDelay()
  return getEmpresas()
}

export const fetchEmpresa = async (id: string): Promise<Empresa> => {
  await randomDelay()
  const empresa = getEmpresas().find((e) => e.id === id)
  if (!empresa) throw new Error("Empresa não encontrada")
  return empresa
}

export const createEmpresa = async (data: EmpresaFormData): Promise<Empresa> => {
  await randomDelay()
  const now = new Date().toISOString()
  const newEmpresa: Empresa = {
    id: `emp-${crypto.randomUUID().slice(0, 8)}`,
    ...data,
    createdAt: now,
    updatedAt: now,
  }
  setEmpresas([...getEmpresas(), newEmpresa])
  return newEmpresa
}

export const updateEmpresa = async (
  id: string,
  data: EmpresaFormData,
): Promise<Empresa> => {
  await randomDelay()
  const now = new Date().toISOString()
  const updated = getEmpresas().map((e) =>
    e.id === id ? { ...e, ...data, updatedAt: now } : e,
  )
  setEmpresas(updated)
  const empresa = updated.find((e) => e.id === id)
  if (!empresa) throw new Error("Empresa não encontrada")
  return empresa
}

export const deleteEmpresa = async (id: string): Promise<void> => {
  await randomDelay()
  setEmpresas(getEmpresas().filter((e) => e.id !== id))
}
