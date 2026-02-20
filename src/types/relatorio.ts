export type EmpresaConformidade = {
  readonly empresaId: string
  readonly empresaNome: string
  readonly total: number
  readonly finalizados: number
  readonly emAndamento: number
}

export type TendenciaMensal = {
  readonly mesAno: string
  readonly total: number
  readonly finalizados: number
}

export type ProblemaComum = {
  readonly descricao: string
  readonly quantidade: number
  readonly percentual: number
}

export type RelatorioConformidade = {
  readonly resumo: {
    readonly totalEmpresas: number
    readonly totalFiscalizacoes: number
    readonly finalizados: number
  }
  readonly empresas: readonly EmpresaConformidade[]
  readonly tendenciaMensal: readonly TendenciaMensal[]
  readonly problemasComuns: readonly ProblemaComum[]
}
