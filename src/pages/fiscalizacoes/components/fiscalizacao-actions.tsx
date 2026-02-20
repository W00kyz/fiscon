import { Download, MoreHorizontal, Search, UserMinus, UserPlus, XCircle } from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
  useAssignFiscalizador,
  useUnassignFiscalizador,
  useUpdateFiscalizacaoStatus,
} from "@/hooks/use-fiscalizacoes.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import type { Fiscalizacao } from "@/types/fiscalizacao.ts"

type FiscalizacaoActionsProps = {
  readonly fiscalizacao: Fiscalizacao
}

export const FiscalizacaoActions = ({
  fiscalizacao,
}: FiscalizacaoActionsProps) => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const statusMutation = useUpdateFiscalizacaoStatus()
  const assignMutation = useAssignFiscalizador()
  const unassignMutation = useUnassignFiscalizador()

  const canCancel =
    fiscalizacao.status === "em_espera" ||
    fiscalizacao.status === "processando"

  const canAssign =
    fiscalizacao.status === "aguardando_analise" &&
    !fiscalizacao.fiscalizadorId

  const canUnassign =
    fiscalizacao.fiscalizadorId === user?.id

  const canAnalyze =
    fiscalizacao.status === "em_analise" &&
    fiscalizacao.fiscalizadorId === user?.id

  const canDownload = fiscalizacao.status === "finalizado"

  const handleCancel = () => {
    statusMutation.mutate(
      { id: fiscalizacao.id, status: "cancelado" },
      { onSuccess: () => toast.success("Fiscalização cancelada") },
    )
  }

  const handleAssign = () => {
    if (!user) return
    assignMutation.mutate(
      {
        id: fiscalizacao.id,
        fiscalizadorId: user.id,
        fiscalizadorNome: user.nome,
      },
      {
        onSuccess: () => {
          toast.success("Fiscalização assumida com sucesso")
          void navigate(`/fiscalizacoes/${fiscalizacao.id}/analise`)
        },
      },
    )
  }

  const handleUnassign = () => {
    unassignMutation.mutate(fiscalizacao.id, {
      onSuccess: () => toast.success("Fiscalização desatribuída com sucesso"),
    })
  }

  const handleAnalyze = () => {
    void navigate(`/fiscalizacoes/${fiscalizacao.id}/analise`)
  }

  const handleDownload = () => {
    toast.info("Download do relatório de conformidade (simulado)")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canCancel && (
          <DropdownMenuItem onClick={handleCancel}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar
          </DropdownMenuItem>
        )}
        {canAssign && (
          <DropdownMenuItem onClick={handleAssign}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assumir
          </DropdownMenuItem>
        )}
        {canUnassign && (
          <DropdownMenuItem onClick={handleUnassign}>
            <UserMinus className="mr-2 h-4 w-4" />
            Desatribuir
          </DropdownMenuItem>
        )}
        {canAnalyze && (
          <DropdownMenuItem onClick={handleAnalyze}>
            <Search className="mr-2 h-4 w-4" />
            Analisar
          </DropdownMenuItem>
        )}
        {canDownload && (
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Relatório
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => void navigate(`/fiscalizacoes/${fiscalizacao.id}`)}
        >
          <Search className="mr-2 h-4 w-4" />
          Detalhes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
