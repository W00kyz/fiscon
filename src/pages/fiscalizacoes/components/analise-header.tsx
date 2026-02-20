import { useState } from "react"
import { ConfirmDialog } from "@/components/shared/confirm-dialog.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { formatMesAno } from "@/lib/format.ts"

type AnaliseHeaderProps = {
  readonly mesAno: string
  readonly empresaNome: string
  readonly contratoNumero: string
  readonly onFinalizar: () => void
  readonly isLoading: boolean
}

export const AnaliseHeader = ({
  mesAno,
  empresaNome,
  contratoNumero,
  onFinalizar,
  isLoading,
}: AnaliseHeaderProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex items-center justify-between border-b bg-background px-6 py-3">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-sm">
          {formatMesAno(mesAno)}
        </Badge>
        <div>
          <p className="text-sm font-semibold">{empresaNome}</p>
          <p className="text-xs text-muted-foreground">{contratoNumero}</p>
        </div>
      </div>

      <Button disabled={isLoading} onClick={() => setConfirmOpen(true)}>
        {isLoading ? "Finalizando..." : "Finalizar"}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Finalizar fiscalização"
        description="Tem certeza que deseja finalizar esta fiscalização? Esta ação não pode ser desfeita."
        onConfirm={() => {
          setConfirmOpen(false)
          onFinalizar()
        }}
        confirmLabel="Finalizar"
      />
    </div>
  )
}
