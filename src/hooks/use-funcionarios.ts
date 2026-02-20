import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api/funcionarios.api.ts"
import type { Funcionario } from "@/types/funcionario.ts"

export const funcionarioKeys = {
  byFiscalizacao: (fiscalizacaoId: string) =>
    ["funcionarios", fiscalizacaoId] as const,
}

export const useFuncionarios = (fiscalizacaoId: string) =>
  useQuery({
    queryKey: funcionarioKeys.byFiscalizacao(fiscalizacaoId),
    queryFn: () => api.fetchFuncionarios(fiscalizacaoId),
    enabled: !!fiscalizacaoId,
  })

export const useUpdateFuncionarios = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      fiscalizacaoId,
      funcionarios,
    }: {
      readonly fiscalizacaoId: string
      readonly funcionarios: readonly Funcionario[]
    }) => api.updateFuncionarios(fiscalizacaoId, funcionarios),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: funcionarioKeys.byFiscalizacao(variables.fiscalizacaoId),
      })
    },
  })
}
