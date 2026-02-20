import { Building2, CheckCircle, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card.tsx"
import type { RelatorioConformidade } from "@/types/relatorio.ts"

type ConformidadeKpisProps = {
  readonly resumo: RelatorioConformidade["resumo"]
}

export const ConformidadeKpis = ({ resumo }: ConformidadeKpisProps) => {
  const kpis = [
    {
      label: "Empresas",
      value: resumo.totalEmpresas,
      icon: Building2,
      color: "text-primary",
    },
    {
      label: "Fiscalizações",
      value: resumo.totalFiscalizacoes,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Finalizados",
      value: resumo.finalizados,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ] as const

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </p>
              </div>
              <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-20`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
