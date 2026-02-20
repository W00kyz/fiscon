export type RiscoInconformidade = "alto" | "medio" | "baixo"

export type Funcionario = {
  readonly id: string
  readonly fiscalizacaoId: string
  readonly nome: string
  readonly cargo: string
  readonly salario: number
  readonly recebeuVT: boolean
  readonly recebeuFGTS: boolean
  readonly recebeuINSS: boolean
  readonly recebeuCestaBasica: boolean
  readonly substituto: boolean
  readonly horasTrabalhadas: number
  readonly riscoInconformidade: RiscoInconformidade
}
