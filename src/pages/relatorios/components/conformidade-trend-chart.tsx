import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { formatMesAno } from "@/lib/format.ts"
import type { TendenciaMensal } from "@/types/relatorio.ts"

type ConformidadeTrendChartProps = {
  readonly tendencia: readonly TendenciaMensal[]
}

export const ConformidadeTrendChart = ({
  tendencia,
}: ConformidadeTrendChartProps) => {
  const chartData = tendencia.map((t) => ({
    ...t,
    mesAnoLabel: formatMesAno(t.mesAno),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tendência de Fiscalizações</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum dado disponível
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="mesAnoLabel"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    total: "Total",
                    finalizados: "Finalizados",
                  }
                  return [value, labels[String(name)] ?? name]
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                name="total"
              />
              <Line
                type="monotone"
                dataKey="finalizados"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 4 }}
                name="finalizados"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
