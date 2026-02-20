import { useNavigate } from "react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { formatDateTime, formatMesAno } from "@/lib/format.ts"
import { FiscalizacaoStatusBadge } from "@/pages/fiscalizacoes/components/fiscalizacao-status-badge.tsx"
import type { Fiscalizacao } from "@/types/fiscalizacao.ts"

type RecentFiscalizacoesProps = {
  readonly fiscalizacoes: readonly Fiscalizacao[]
}

export const RecentFiscalizacoes = ({
  fiscalizacoes,
}: RecentFiscalizacoesProps) => {
  const navigate = useNavigate()

  const recent = [...fiscalizacoes]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Fiscalizações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma fiscalização registrada
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((fisc) => (
              <button
                key={fisc.id}
                type="button"
                className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors hover:bg-muted/50"
                onClick={() =>
                  void navigate(`/fiscalizacoes/${fisc.id}`)
                }
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{fisc.protocolo}</p>
                  <p className="text-xs text-muted-foreground">
                    {fisc.empresaNome} — {formatMesAno(fisc.mesAno)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FiscalizacaoStatusBadge status={fisc.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(fisc.updatedAt)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
