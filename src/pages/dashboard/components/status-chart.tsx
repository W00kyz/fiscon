import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { STATUS_LABELS } from "@/lib/constants.ts"
import type { Fiscalizacao, FiscalizacaoStatus } from "@/types/fiscalizacao.ts"

type StatusChartProps = {
  readonly fiscalizacoes: readonly Fiscalizacao[]
}

const COLORS: Record<FiscalizacaoStatus, string> = {
  em_espera: "#f59e0b",
  processando: "#3b82f6",
  aguardando_analise: "#a855f7",
  em_analise: "#6366f1",
  finalizado: "#22c55e",
  cancelado: "#6b7280",
}

export const StatusChart = ({ fiscalizacoes }: StatusChartProps) => {
  const statusCounts = (Object.keys(STATUS_LABELS) as readonly FiscalizacaoStatus[]).map(
    (status) => ({
      name: STATUS_LABELS[status],
      value: fiscalizacoes.filter((f) => f.status === status).length,
      color: COLORS[status],
    }),
  )

  const chartData = statusCounts.filter((item) => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma fiscalização registrada
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
