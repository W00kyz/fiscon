import {
  CheckCircle,
  Clock,
  Loader2,
  Search,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { Fiscalizacao } from "@/types/fiscalizacao.ts"

type KpiCardsProps = {
  readonly fiscalizacoes: readonly Fiscalizacao[]
}

export const KpiCards = ({ fiscalizacoes }: KpiCardsProps) => {
  const emEspera = fiscalizacoes.filter(
    (f) => f.status === "em_espera",
  ).length
  const processando = fiscalizacoes.filter(
    (f) => f.status === "processando",
  ).length
  const aguardandoAnalise = fiscalizacoes.filter(
    (f) => f.status === "aguardando_analise",
  ).length
  const emAnalise = fiscalizacoes.filter(
    (f) => f.status === "em_analise",
  ).length
  const finalizados = fiscalizacoes.filter(
    (f) => f.status === "finalizado",
  ).length

  const cards = [
    {
      title: "Em Espera",
      value: emEspera,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Processando",
      value: processando,
      icon: Loader2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Ag. Análise",
      value: aguardandoAnalise,
      icon: Search,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Em Análise",
      value: emAnalise,
      icon: UserCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Finalizados",
      value: finalizados,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ] as const

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-md p-2 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
