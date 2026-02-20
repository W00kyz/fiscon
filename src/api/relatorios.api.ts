import { randomDelay } from "./client.ts"
import { getEmpresas, getFiscalizacoes, getFuncionarios } from "./mock-data/store.ts"
import type {
  RelatorioConformidadeFilterData,
  RelatorioFilterData,
} from "@/schemas/relatorio.schema.ts"
import type { Fiscalizacao } from "@/types/fiscalizacao.ts"
import type {
  EmpresaConformidade,
  ProblemaComum,
  RelatorioConformidade,
  TendenciaMensal,
} from "@/types/relatorio.ts"

export type RelatorioSummary = {
  readonly total: number
  readonly finalizados: number
  readonly emEspera: number
  readonly processando: number
  readonly aguardandoAnalise: number
  readonly emAnalise: number
  readonly cancelados: number
}

export const fetchRelatorio = async (
  filters: RelatorioFilterData,
): Promise<{
  readonly summary: RelatorioSummary
  readonly fiscalizacoes: readonly Fiscalizacao[]
}> => {
  await randomDelay()

  const all = getFiscalizacoes()
  const filtered = all.filter((f) => {
    if (filters.empresaId && f.empresaId !== filters.empresaId) return false
    if (filters.contratoId && f.contratoId !== filters.contratoId) return false
    if (filters.dataInicio && f.createdAt < filters.dataInicio) return false
    if (filters.dataFim && f.createdAt > filters.dataFim) return false
    return true
  })

  const total = filtered.length

  return {
    summary: {
      total,
      finalizados: filtered.filter((f) => f.status === "finalizado").length,
      emEspera: filtered.filter((f) => f.status === "em_espera").length,
      processando: filtered.filter((f) => f.status === "processando").length,
      aguardandoAnalise: filtered.filter(
        (f) => f.status === "aguardando_analise",
      ).length,
      emAnalise: filtered.filter((f) => f.status === "em_analise").length,
      cancelados: filtered.filter((f) => f.status === "cancelado").length,
    },
    fiscalizacoes: filtered,
  }
}

const computeFinalizados = (
  fiscs: readonly Fiscalizacao[],
): { readonly finalizados: number } => ({
  finalizados: fiscs.filter((f) => f.status === "finalizado").length,
})

const PROBLEMA_LABELS: Record<string, string> = {
  recebeuVT: "Vale-transporte não comprovado",
  recebeuFGTS: "FGTS irregular",
  recebeuINSS: "INSS em atraso",
  recebeuCestaBasica: "Cesta básica não comprovada",
}

export const fetchRelatorioConformidade = async (
  filters: RelatorioConformidadeFilterData,
): Promise<RelatorioConformidade> => {
  await randomDelay()

  const allFiscalizacoes = getFiscalizacoes()
  const allEmpresas = getEmpresas()
  const allFuncionarios = getFuncionarios()

  const filtered = allFiscalizacoes.filter((f) => {
    if (filters.empresaId && f.empresaId !== filters.empresaId) return false
    if (filters.mesAnoInicio && f.mesAno < filters.mesAnoInicio) return false
    if (filters.mesAnoFim && f.mesAno > filters.mesAnoFim) return false
    return true
  })

  const empresaIds = [...new Set(filtered.map((f) => f.empresaId))]

  const empresas: readonly EmpresaConformidade[] = empresaIds.map(
    (empresaId) => {
      const empresa = allEmpresas.find((e) => e.id === empresaId)
      const fiscsEmpresa = filtered.filter((f) => f.empresaId === empresaId)
      const { finalizados } = computeFinalizados(fiscsEmpresa)
      const emAndamento = fiscsEmpresa.filter(
        (f) =>
          f.status !== "finalizado" &&
          f.status !== "cancelado",
      ).length
      return {
        empresaId,
        empresaNome: empresa?.nome ?? "Desconhecida",
        total: fiscsEmpresa.length,
        finalizados,
        emAndamento,
      }
    },
  )

  const mesAnoSet = [...new Set(filtered.map((f) => f.mesAno))].sort()
  const tendenciaMensal: readonly TendenciaMensal[] = mesAnoSet.map(
    (mesAno: string) => {
      const fiscsMes = filtered.filter((f) => f.mesAno === mesAno)
      const { finalizados } = computeFinalizados(fiscsMes)
      return {
        mesAno,
        total: fiscsMes.length,
        finalizados,
      }
    },
  )

  const filteredFiscIds = new Set(filtered.map((f) => f.id))
  const relevantFuncionarios = allFuncionarios.filter((func) =>
    filteredFiscIds.has(func.fiscalizacaoId),
  )

  const problemCounts = (
    ["recebeuVT", "recebeuFGTS", "recebeuINSS", "recebeuCestaBasica"] as const
  ).map((field) => ({
    descricao: PROBLEMA_LABELS[field],
    quantidade: relevantFuncionarios.filter(
      (func) => !func[field],
    ).length,
  }))

  const totalFuncionarios = relevantFuncionarios.length
  const problemasComuns: readonly ProblemaComum[] = problemCounts
    .filter((p) => p.quantidade > 0)
    .map((p) => ({
      ...p,
      percentual:
        totalFuncionarios > 0
          ? Math.round((p.quantidade / totalFuncionarios) * 100)
          : 0,
    }))
    .sort((a: { readonly quantidade: number }, b: { readonly quantidade: number }) => b.quantidade - a.quantidade)

  const { finalizados: totalFinalizados } = computeFinalizados(filtered)

  return {
    resumo: {
      totalEmpresas: empresaIds.length,
      totalFiscalizacoes: filtered.length,
      finalizados: totalFinalizados,
    },
    empresas,
    tendenciaMensal,
    problemasComuns,
  }
}
