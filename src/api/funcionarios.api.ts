import { randomDelay } from "./client.ts"
import { getFuncionarios, setFuncionarios } from "./mock-data/store.ts"
import type { Funcionario } from "@/types/funcionario.ts"

export const fetchFuncionarios = async (
  fiscalizacaoId: string,
): Promise<readonly Funcionario[]> => {
  await randomDelay()
  return getFuncionarios().filter((f) => f.fiscalizacaoId === fiscalizacaoId)
}

export const updateFuncionarios = async (
  fiscalizacaoId: string,
  updated: readonly Funcionario[],
): Promise<readonly Funcionario[]> => {
  await randomDelay()
  const others = getFuncionarios().filter(
    (f) => f.fiscalizacaoId !== fiscalizacaoId,
  )
  setFuncionarios([...others, ...updated])
  return updated
}
