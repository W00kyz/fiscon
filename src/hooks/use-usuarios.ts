import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api/usuarios.api.ts"
import type { UsuarioFormData } from "@/schemas/usuario.schema.ts"

export const usuarioKeys = {
  all: ["usuarios"] as const,
  detail: (id: string) => ["usuarios", id] as const,
}

export const useUsuarios = () =>
  useQuery({
    queryKey: usuarioKeys.all,
    queryFn: api.fetchUsuarios,
  })

export const useCreateUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UsuarioFormData) => api.createUsuario(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usuarioKeys.all })
    },
  })
}

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { readonly id: string; readonly data: UsuarioFormData }) =>
      api.updateUsuario(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usuarioKeys.all })
    },
  })
}

export const useDeleteUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteUsuario(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usuarioKeys.all })
    },
  })
}
