import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { ProblemaComum } from "@/types/relatorio.ts"

type ProblemasComunsChartProps = {
  readonly problemas: readonly ProblemaComum[]
}

export const ProblemasComunsChart = ({
  problemas,
}: ProblemasComunsChartProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Problemas Comuns</CardTitle>
    </CardHeader>
    <CardContent>
      {problemas.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum problema identificado
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={[...problemas]} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="descricao"
              width={180}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value, _name, props) => [
                `${value} (${(props.payload as ProblemaComum).percentual}%)`,
                "Ocorrências",
              ]}
            />
            <Bar dataKey="quantidade" fill="#ef4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  </Card>
)
