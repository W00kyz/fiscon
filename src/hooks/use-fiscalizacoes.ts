import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api/fiscalizacoes.api.ts"
import type { FiscalizacaoFormData } from "@/schemas/fiscalizacao.schema.ts"
import type { FiscalizacaoStatus } from "@/types/fiscalizacao.ts"

export const fiscalizacaoKeys = {
  all: ["fiscalizacoes"] as const,
  detail: (id: string) => ["fiscalizacoes", id] as const,
}

export const useFiscalizacoes = () =>
  useQuery({
    queryKey: fiscalizacaoKeys.all,
    queryFn: api.fetchFiscalizacoes,
    refetchInterval: 10_000,
  })

export const useFiscalizacao = (id: string) =>
  useQuery({
    queryKey: fiscalizacaoKeys.detail(id),
    queryFn: () => api.fetchFiscalizacao(id),
    enabled: !!id,
  })

export const useCreateFiscalizacao = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      readonly data: FiscalizacaoFormData
      readonly files: readonly File[]
    }) => api.createFiscalizacao(data, files),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fiscalizacaoKeys.all })
    },
  })
}

export const useCreateFiscalizacaoBatch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      batches: readonly {
        readonly data: FiscalizacaoFormData
        readonly files: readonly File[]
      }[],
    ) =>
      batches.reduce<Promise<readonly Awaited<ReturnType<typeof api.createFiscalizacao>>[]>>(
        async (accPromise, batch) => {
          const acc = await accPromise
          const result = await api.createFiscalizacao(batch.data, batch.files)
          return [...acc, result]
        },
        Promise.resolve([]),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fiscalizacaoKeys.all })
    },
  })
}

export const useUpdateFiscalizacaoStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      readonly id: string
      readonly status: FiscalizacaoStatus
    }) => api.updateFiscalizacaoStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fiscalizacaoKeys.all })
    },
  })
}

export const useAssignFiscalizador = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      fiscalizadorId,
      fiscalizadorNome,
    }: {
      readonly id: string
      readonly fiscalizadorId: string
      readonly fiscalizadorNome: string
    }) => api.assignFiscalizador(id, fiscalizadorId, fiscalizadorNome),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fiscalizacaoKeys.all })
    },
  })
}

export const useUnassignFiscalizador = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.unassignFiscalizador(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fiscalizacaoKeys.all })
    },
  })
}

