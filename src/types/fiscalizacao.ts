export type FiscalizacaoStatus =
  | "em_espera"
  | "processando"
  | "aguardando_analise"
  | "em_analise"
  | "finalizado"
  | "cancelado"

export type DocumentoTipo =
  | "cartao_ponto_fixos"
  | "cartao_ponto_substitutos"
  | "contracheque_fixos"
  | "contracheque_substitutos"
  | "cesta_basica_fixos"
  | "cesta_basica_substitutos"
  | "relacao_trabalhadores_fixos"
  | "relacao_trabalhadores_substitutos"

export type FiscalizacaoDocumento = {
  readonly id: string
  readonly tipo: DocumentoTipo
  readonly nomeArquivo: string
  readonly tamanho: number
  readonly uploadedAt: string
}

export type Fiscalizacao = {
  readonly id: string
  readonly protocolo: string
  readonly mesAno: string
  readonly empresaId: string
  readonly contratoId: string
  readonly empresaNome: string
  readonly contratoNumero: string
  readonly status: FiscalizacaoStatus
  readonly documentos: readonly FiscalizacaoDocumento[]

  readonly fiscalizadorId: string | null
  readonly fiscalizadorNome: string | null
  readonly createdAt: string
  readonly updatedAt: string
  readonly relatorioUrl: string | null
}
