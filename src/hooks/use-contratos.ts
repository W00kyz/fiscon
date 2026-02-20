import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api/contratos.api.ts"
import type { ContratoFormData } from "@/schemas/contrato.schema.ts"

export const contratoKeys = {
  all: ["contratos"] as const,
  byEmpresa: (empresaId: string) => ["contratos", empresaId] as const,
  detail: (id: string) => ["contratos", "detail", id] as const,
}

export const useContratos = (empresaId?: string) =>
  useQuery({
    queryKey: empresaId ? contratoKeys.byEmpresa(empresaId) : contratoKeys.all,
    queryFn: () => api.fetchContratos(empresaId),
  })

export const useContrato = (id: string) =>
  useQuery({
    queryKey: contratoKeys.detail(id),
    queryFn: () => api.fetchContrato(id),
    enabled: !!id,
  })

export const useCreateContrato = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ContratoFormData) => api.createContrato(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contratoKeys.all })
    },
  })
}

export const useUpdateContrato = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { readonly id: string; readonly data: ContratoFormData }) =>
      api.updateContrato(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contratoKeys.all })
    },
  })
}

export const useDeleteContrato = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteContrato(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contratoKeys.all })
    },
  })
}
