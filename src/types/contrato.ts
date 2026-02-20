export type Contrato = {
  readonly id: string
  readonly empresaId: string
  readonly numero: string
  readonly descricao: string
  readonly dataInicio: string
  readonly dataFim: string
  readonly valor: number
  readonly ativo: boolean
  readonly createdAt: string
  readonly updatedAt: string
}
