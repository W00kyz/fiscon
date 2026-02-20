import { Building2, Download, FileText, Plus, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { useAuthStore } from "@/stores/auth.store.ts"

type QuickActionsProps = {
  readonly onNovaFiscalizacao: () => void
  readonly onDownloadRelatorio: () => void
  readonly onCadastrarEmpresa: () => void
  readonly onCadastrarContrato: () => void
  readonly onCadastrarUsuario: () => void
}

export const QuickActions = ({
  onNovaFiscalizacao,
  onDownloadRelatorio,
  onCadastrarEmpresa,
  onCadastrarContrato,
  onCadastrarUsuario,
}: QuickActionsProps) => {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === "administrador"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="justify-start"
          onClick={onNovaFiscalizacao}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Fiscalização
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={onDownloadRelatorio}
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Relatório Mensal
        </Button>
        {isAdmin && (
          <>
            <Button
              variant="outline"
              className="justify-start"
              onClick={onCadastrarEmpresa}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Cadastrar Empresa
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={onCadastrarContrato}
            >
              <FileText className="mr-2 h-4 w-4" />
              Cadastrar Contrato
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={onCadastrarUsuario}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Cadastrar Usuário
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
