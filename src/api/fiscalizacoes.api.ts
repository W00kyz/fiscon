import { randomDelay } from "./client.ts"
import {
  getFiscalizacoes,
  setFiscalizacoes,
  getEmpresas,
  getContratos,
  getNotifications,
  setNotifications,
  getFuncionarios,
  setFuncionarios,
} from "./mock-data/store.ts"
import type { FiscalizacaoFormData } from "@/schemas/fiscalizacao.schema.ts"
import type { Fiscalizacao, FiscalizacaoStatus } from "@/types/fiscalizacao.ts"

export const fetchFiscalizacoes = async (): Promise<
  readonly Fiscalizacao[]
> => {
  await randomDelay()
  return [...getFiscalizacoes()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export const fetchFiscalizacao = async (id: string): Promise<Fiscalizacao> => {
  await randomDelay()
  const fisc = getFiscalizacoes().find((f) => f.id === id)
  if (!fisc) throw new Error("Fiscalização não encontrada")
  return fisc
}

const generateProtocolo = (): string => {
  const year = new Date().getFullYear()
  const count = getFiscalizacoes().length + 1
  return `FISC-${year}-${String(count).padStart(4, "0")}`
}

const generateMockFuncionarios = (fiscalizacaoId: string) => {
  const names = [
    "Ana Beatriz Silva",
    "Pedro Henrique Santos",
    "Luciana Ferreira",
    "Marcos Antônio Ribeiro",
    "Juliana Costa Oliveira",
  ]
  const cargos = [
    "Auxiliar de Limpeza",
    "Vigilante",
    "Copeiro(a)",
    "Encarregado",
    "Auxiliar Administrativo",
  ]
  const riscos = ["baixo", "medio", "alto"] as const

  return names.map((nome, idx) => ({
    id: `func-${crypto.randomUUID().slice(0, 8)}`,
    fiscalizacaoId,
    nome,
    cargo: cargos[idx % cargos.length],
    salario: 1800 + idx * 300,
    recebeuVT: Math.random() > 0.2,
    recebeuFGTS: Math.random() > 0.15,
    recebeuINSS: Math.random() > 0.1,
    recebeuCestaBasica: Math.random() > 0.2,
    substituto: idx === 4,
    horasTrabalhadas: 160 + Math.floor(Math.random() * 20),
    riscoInconformidade: riscos[Math.floor(Math.random() * riscos.length)],
  }))
}

const simulateProcessing = (fiscId: string): void => {
  // Simulate em_espera -> processando after 3s
  setTimeout(() => {
    const current = getFiscalizacoes()
    const fisc = current.find((f) => f.id === fiscId)
    if (fisc && fisc.status === "em_espera") {
      setFiscalizacoes(
        current.map((f) =>
          f.id === fiscId
            ? { ...f, status: "processando" as FiscalizacaoStatus, updatedAt: new Date().toISOString() }
            : f,
        ),
      )

      // Simulate processando -> aguardando_analise after 5 more seconds
      setTimeout(() => {
        const curr2 = getFiscalizacoes()
        const fisc2 = curr2.find((f) => f.id === fiscId)
        if (fisc2 && fisc2.status === "processando") {
          setFiscalizacoes(
            curr2.map((f) =>
              f.id === fiscId
                ? { ...f, status: "aguardando_analise" as FiscalizacaoStatus, updatedAt: new Date().toISOString() }
                : f,
            ),
          )

          // Generate mock funcionarios
          const mockFuncs = generateMockFuncionarios(fiscId)
          setFuncionarios([...getFuncionarios(), ...mockFuncs])

          // Add notification
          setNotifications([
            ...getNotifications(),
            {
              id: `notif-${crypto.randomUUID().slice(0, 8)}`,
              title: "Fiscalização pronta para análise",
              message: `${fisc2.protocolo} (${fisc2.empresaNome} - ${fisc2.mesAno}) está pronta para análise.`,
              type: "info",
              read: false,
              fiscalizacaoId: fiscId,
              createdAt: new Date().toISOString(),
            },
          ])
        }
      }, 5000)
    }
  }, 3000)
}

export const createFiscalizacao = async (
  data: FiscalizacaoFormData,
  _files: readonly File[],
): Promise<Fiscalizacao> => {
  await randomDelay()
  const empresa = getEmpresas().find((e) => e.id === data.empresaId)
  const contrato = getContratos().find((c) => c.id === data.contratoId)
  if (!empresa || !contrato) throw new Error("Empresa ou contrato inválido")

  const now = new Date().toISOString()
  const newFisc: Fiscalizacao = {
    id: `fis-${crypto.randomUUID().slice(0, 8)}`,
    protocolo: generateProtocolo(),
    mesAno: data.mesAno,
    empresaId: data.empresaId,
    contratoId: data.contratoId,
    empresaNome: empresa.nome,
    contratoNumero: contrato.numero,
    status: "em_espera",
    documentos: _files.map((file) => {
      const tipos = [
        "cartao_ponto_fixos",
        "cartao_ponto_substitutos",
        "contracheque_fixos",
        "contracheque_substitutos",
        "cesta_basica_fixos",
        "cesta_basica_substitutos",
        "relacao_trabalhadores_fixos",
        "relacao_trabalhadores_substitutos",
      ] as const
      const detected = tipos.find((t) =>
        file.name.toLowerCase().includes(t.replace(/_/g, " ")),
      )
      return {
        id: `doc-${crypto.randomUUID().slice(0, 8)}`,
        tipo: detected ?? tipos[0],
        nomeArquivo: file.name,
        tamanho: file.size,
        uploadedAt: now,
      }
    }),
    fiscalizadorId: null,
    fiscalizadorNome: null,
    createdAt: now,
    updatedAt: now,
    relatorioUrl: null,
  }

  setFiscalizacoes([...getFiscalizacoes(), newFisc])
  simulateProcessing(newFisc.id)
  return newFisc
}

export const updateFiscalizacaoStatus = async (
  id: string,
  status: FiscalizacaoStatus,
): Promise<Fiscalizacao> => {
  await randomDelay()
  const now = new Date().toISOString()
  const shouldGenerateReport = status === "finalizado"

  const updated = getFiscalizacoes().map((f) =>
    f.id === id
      ? {
          ...f,
          status,
          updatedAt: now,
          relatorioUrl: shouldGenerateReport
            ? `/relatorios/${id}-conformidade.pdf`
            : f.relatorioUrl,
        }
      : f,
  )
  setFiscalizacoes(updated)
  const fisc = updated.find((f) => f.id === id)
  if (!fisc) throw new Error("Fiscalização não encontrada")
  return fisc
}

export const assignFiscalizador = async (
  id: string,
  fiscalizadorId: string,
  fiscalizadorNome: string,
): Promise<Fiscalizacao> => {
  await randomDelay()
  const now = new Date().toISOString()
  const updated = getFiscalizacoes().map((f) =>
    f.id === id
      ? {
          ...f,
          fiscalizadorId,
          fiscalizadorNome,
          updatedAt: now,
          status:
            f.status === "aguardando_analise"
              ? ("em_analise" as FiscalizacaoStatus)
              : f.status,
        }
      : f,
  )
  setFiscalizacoes(updated)
  const fisc = updated.find((f) => f.id === id)
  if (!fisc) throw new Error("Fiscalização não encontrada")
  return fisc
}

export const unassignFiscalizador = async (
  id: string,
): Promise<Fiscalizacao> => {
  await randomDelay()
  const now = new Date().toISOString()
  const updated = getFiscalizacoes().map((f) =>
    f.id === id
      ? {
          ...f,
          fiscalizadorId: null,
          fiscalizadorNome: null,
          updatedAt: now,
          status:
            f.status === "em_analise"
              ? ("aguardando_analise" as FiscalizacaoStatus)
              : f.status,
        }
      : f,
  )
  setFiscalizacoes(updated)
  const fisc = updated.find((f) => f.id === id)
  if (!fisc) throw new Error("Fiscalização não encontrada")
  return fisc
}

