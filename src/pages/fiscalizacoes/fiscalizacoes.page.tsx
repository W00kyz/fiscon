import { Plus } from "lucide-react"
import { useState } from "react"
import { FiscalizacoesTable } from "./components/fiscalizacoes-table.tsx"
import { NovaFiscalizacaoDialog } from "./components/nova-fiscalizacao-dialog.tsx"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useFiscalizacoes } from "@/hooks/use-fiscalizacoes.ts"

const FiscalizacoesPage = () => {
  const { data: fiscalizacoes = [], isLoading } = useFiscalizacoes()
  const [dialogOpen, setDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Fiscalizações"
        description="Fila de processamento — arraste para reordenar"
      >
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Fiscalização
        </Button>
      </PageHeader>

      <FiscalizacoesTable fiscalizacoes={fiscalizacoes} />

      <NovaFiscalizacaoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

export default FiscalizacoesPage
