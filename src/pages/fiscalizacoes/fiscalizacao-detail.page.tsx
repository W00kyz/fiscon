import { useParams } from "react-router"
import { FiscalizacaoStatusBadge } from "./components/fiscalizacao-status-badge.tsx"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { useFiscalizacao } from "@/hooks/use-fiscalizacoes.ts"
import { useFuncionarios } from "@/hooks/use-funcionarios.ts"
import { DOCUMENTO_LABELS, RISCO_COLORS, RISCO_LABELS } from "@/lib/constants.ts"
import { formatCurrency, formatDateTime, formatFileSize, formatMesAno } from "@/lib/format.ts"

const FiscalizacaoDetailPage = () => {
  const { id = "" } = useParams()
  const { data: fiscalizacao, isLoading } = useFiscalizacao(id)
  const { data: funcionarios = [] } = useFuncionarios(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!fiscalizacao) {
    return <p className="text-muted-foreground">Fiscalização não encontrada</p>
  }

  return (
    <div>
      <PageHeader
        title={fiscalizacao.protocolo}
        description={`${fiscalizacao.empresaNome} — ${formatMesAno(fiscalizacao.mesAno)}`}
      >
        <FiscalizacaoStatusBadge status={fiscalizacao.status} />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{fiscalizacao.empresaNome}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{fiscalizacao.contratoNumero}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Fiscalizador</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {fiscalizacao.fiscalizadorNome ?? "Não atribuído"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Criado em</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{formatDateTime(fiscalizacao.createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Documentos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {fiscalizacao.documentos.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-md border px-4 py-3">
              <div>
                <p className="text-sm font-medium">
                  {DOCUMENTO_LABELS[doc.tipo] ?? doc.tipo}
                </p>
                <p className="text-xs text-muted-foreground">{doc.nomeArquivo}</p>
              </div>
              <Badge variant="outline">{formatFileSize(doc.tamanho)}</Badge>
            </div>
          ))}
        </div>
      </div>

      {funcionarios.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">Funcionários</h2>
          <div className="space-y-2">
            {funcionarios.map((func) => (
              <div
                key={func.id}
                className="flex items-center justify-between rounded-md border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{func.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {func.cargo} — {formatCurrency(func.salario)} — {func.horasTrabalhadas}h
                  </p>
                </div>
                <Badge variant="outline" className={RISCO_COLORS[func.riscoInconformidade]}>
                  {RISCO_LABELS[func.riscoInconformidade]}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FiscalizacaoDetailPage
