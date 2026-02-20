import { Badge } from "@/components/ui/badge.tsx"
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants.ts"
import type { FiscalizacaoStatus } from "@/types/fiscalizacao.ts"

type FiscalizacaoStatusBadgeProps = {
  readonly status: FiscalizacaoStatus
}

export const FiscalizacaoStatusBadge = ({
  status,
}: FiscalizacaoStatusBadgeProps) => (
  <Badge variant="outline" className={STATUS_COLORS[status]}>
    {STATUS_LABELS[status]}
  </Badge>
)
