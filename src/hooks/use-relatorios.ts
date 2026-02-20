import { useQuery } from "@tanstack/react-query"
import { fetchRelatorio } from "@/api/relatorios.api.ts"
import type { RelatorioFilterData } from "@/schemas/relatorio.schema.ts"

export const relatorioKeys = {
  filtered: (filters: RelatorioFilterData) =>
    ["relatorios", filters] as const,
}

export const useRelatorio = (filters: RelatorioFilterData) =>
  useQuery({
    queryKey: relatorioKeys.filtered(filters),
    queryFn: () => fetchRelatorio(filters),
  })
