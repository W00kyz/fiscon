import type { DocumentoTipo } from "@/types/fiscalizacao.ts"

type DetectionRule = {
  readonly patterns: readonly RegExp[]
  readonly tipo: DocumentoTipo
}

const DETECTION_RULES: readonly DetectionRule[] = [
  {
    patterns: [/cart[aã]o.*ponto.*fix/i, /ponto.*fix/i],
    tipo: "cartao_ponto_fixos",
  },
  {
    patterns: [/cart[aã]o.*ponto.*sub/i, /ponto.*sub/i],
    tipo: "cartao_ponto_substitutos",
  },
  {
    patterns: [/contracheque.*fix/i, /extrato.*mensal.*fix/i],
    tipo: "contracheque_fixos",
  },
  {
    patterns: [/contracheque.*sub/i, /extrato.*mensal.*sub/i],
    tipo: "contracheque_substitutos",
  },
  {
    patterns: [/cesta.*b[aá]sica.*fix/i, /recibo.*cesta.*fix/i],
    tipo: "cesta_basica_fixos",
  },
  {
    patterns: [/cesta.*b[aá]sica.*sub/i, /recibo.*cesta.*sub/i],
    tipo: "cesta_basica_substitutos",
  },
  {
    patterns: [/rela[cç][aã]o.*trabalh.*fix/i, /trabalhadores.*fix/i],
    tipo: "relacao_trabalhadores_fixos",
  },
  {
    patterns: [/rela[cç][aã]o.*trabalh.*sub/i, /trabalhadores.*sub/i],
    tipo: "relacao_trabalhadores_substitutos",
  },
]

export const detectDocumentType = (filename: string): DocumentoTipo | null => {
  const matched = DETECTION_RULES.find((rule) =>
    rule.patterns.some((pattern) => pattern.test(filename)),
  )
  return matched?.tipo ?? null
}
