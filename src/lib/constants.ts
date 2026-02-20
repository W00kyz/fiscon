import type { FiscalizacaoStatus } from "@/types/fiscalizacao.ts"
import type { RiscoInconformidade } from "@/types/funcionario.ts"

export const STATUS_LABELS: Record<FiscalizacaoStatus, string> = {
  em_espera: "Em Espera",
  processando: "Processando",
  aguardando_analise: "Ag. Análise",
  em_analise: "Em Análise",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
}

export const STATUS_ORDER: Record<FiscalizacaoStatus, number> = {
  cancelado: 0,
  finalizado: 1,
  em_espera: 2,
  processando: 3,
  aguardando_analise: 4,
  em_analise: 5,
}

export const STATUS_COLORS: Record<FiscalizacaoStatus, string> = {
  em_espera: "bg-amber-100 text-amber-800",
  processando: "bg-blue-100 text-blue-800",
  aguardando_analise: "bg-purple-100 text-purple-800",
  em_analise: "bg-indigo-100 text-indigo-800",
  finalizado: "bg-green-100 text-green-800",
  cancelado: "bg-gray-100 text-gray-800",
}

export const RISCO_LABELS: Record<RiscoInconformidade, string> = {
  alto: "Risco Alto",
  medio: "Risco Médio",
  baixo: "Risco Baixo",
}

export const RISCO_COLORS: Record<RiscoInconformidade, string> = {
  alto: "bg-red-100 text-red-800",
  medio: "bg-amber-100 text-amber-800",
  baixo: "bg-green-100 text-green-800",
}

export const DOCUMENTO_LABELS: Record<string, string> = {
  cartao_ponto_fixos: "Cartão de Ponto (Fixos)",
  cartao_ponto_substitutos: "Cartão de Ponto (Substitutos)",
  contracheque_fixos: "Contracheque - Extrato Mensal (Fixos)",
  contracheque_substitutos: "Contracheque - Extrato Mensal (Substitutos)",
  cesta_basica_fixos: "Recibos de Cesta Básica (Fixos)",
  cesta_basica_substitutos: "Recibos de Cesta Básica (Substitutos)",
  relacao_trabalhadores_fixos: "Relação de Trabalhadores (Fixos)",
  relacao_trabalhadores_substitutos: "Relação de Trabalhadores (Substitutos)",
}
