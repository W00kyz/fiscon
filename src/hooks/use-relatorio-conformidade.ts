import { useQuery } from "@tanstack/react-query"
import { fetchRelatorioConformidade } from "@/api/relatorios.api.ts"
import type { RelatorioConformidadeFilterData } from "@/schemas/relatorio.schema.ts"

export const relatorioConformidadeKeys = {
  filtered: (filters: RelatorioConformidadeFilterData) =>
    ["relatorio-conformidade", filters] as const,
}

export const useRelatorioConformidade = (
  filters: RelatorioConformidadeFilterData,
) =>
  useQuery({
    queryKey: relatorioConformidadeKeys.filtered(filters),
    queryFn: () => fetchRelatorioConformidade(filters),
  })
