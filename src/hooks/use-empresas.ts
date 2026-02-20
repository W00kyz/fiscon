import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api/empresas.api.ts"
import type { EmpresaFormData } from "@/schemas/empresa.schema.ts"

export const empresaKeys = {
  all: ["empresas"] as const,
  detail: (id: string) => ["empresas", id] as const,
}

export const useEmpresas = () =>
  useQuery({
    queryKey: empresaKeys.all,
    queryFn: api.fetchEmpresas,
  })

export const useEmpresa = (id: string) =>
  useQuery({
    queryKey: empresaKeys.detail(id),
    queryFn: () => api.fetchEmpresa(id),
    enabled: !!id,
  })

export const useCreateEmpresa = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EmpresaFormData) => api.createEmpresa(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: empresaKeys.all })
    },
  })
}

export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { readonly id: string; readonly data: EmpresaFormData }) =>
      api.updateEmpresa(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: empresaKeys.all })
    },
  })
}

export const useDeleteEmpresa = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteEmpresa(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: empresaKeys.all })
    },
  })
}
