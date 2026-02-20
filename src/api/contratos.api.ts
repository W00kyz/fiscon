import { randomDelay } from "./client.ts"
import { getContratos, setContratos } from "./mock-data/store.ts"
import type { ContratoFormData } from "@/schemas/contrato.schema.ts"
import type { Contrato } from "@/types/contrato.ts"

export const fetchContratos = async (
  empresaId?: string,
): Promise<readonly Contrato[]> => {
  await randomDelay()
  const all = getContratos()
  return empresaId ? all.filter((c) => c.empresaId === empresaId) : all
}

export const fetchContrato = async (id: string): Promise<Contrato> => {
  await randomDelay()
  const contrato = getContratos().find((c) => c.id === id)
  if (!contrato) throw new Error("Contrato não encontrado")
  return contrato
}

export const createContrato = async (
  data: ContratoFormData,
): Promise<Contrato> => {
  await randomDelay()
  const now = new Date().toISOString()
  const newContrato: Contrato = {
    id: `ctr-${crypto.randomUUID().slice(0, 8)}`,
    ...data,
    createdAt: now,
    updatedAt: now,
  }
  setContratos([...getContratos(), newContrato])
  return newContrato
}

export const updateContrato = async (
  id: string,
  data: ContratoFormData,
): Promise<Contrato> => {
  await randomDelay()
  const now = new Date().toISOString()
  const updated = getContratos().map((c) =>
    c.id === id ? { ...c, ...data, updatedAt: now } : c,
  )
  setContratos(updated)
  const contrato = updated.find((c) => c.id === id)
  if (!contrato) throw new Error("Contrato não encontrado")
  return contrato
}

export const deleteContrato = async (id: string): Promise<void> => {
  await randomDelay()
  setContratos(getContratos().filter((c) => c.id !== id))
}
