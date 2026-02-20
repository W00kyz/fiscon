import { useState } from "react"
import { toast } from "sonner"
import { KpiCards } from "./components/kpi-cards.tsx"
import { NovoContratoQuickDialog } from "./components/novo-contrato-quick-dialog.tsx"
import { QuickActions } from "./components/quick-actions.tsx"
import { RecentFiscalizacoes } from "./components/recent-fiscalizacoes.tsx"
import { StatusChart } from "./components/status-chart.tsx"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { useCreateEmpresa } from "@/hooks/use-empresas.ts"
import { useFiscalizacoes } from "@/hooks/use-fiscalizacoes.ts"
import { useRelatorio } from "@/hooks/use-relatorios.ts"
import { useCreateUsuario } from "@/hooks/use-usuarios.ts"
import { STATUS_LABELS } from "@/lib/constants.ts"
import { exportToExcel } from "@/lib/excel-export.ts"
import { formatMesAno } from "@/lib/format.ts"
import { EmpresaDialog } from "@/pages/empresas/components/empresa-dialog.tsx"
import { NovaFiscalizacaoDialog } from "@/pages/fiscalizacoes/components/nova-fiscalizacao-dialog.tsx"
import { UsuarioDialog } from "@/pages/usuarios/components/usuario-dialog.tsx"
import type { EmpresaFormData } from "@/schemas/empresa.schema.ts"
import type { UsuarioFormData } from "@/schemas/usuario.schema.ts"

const getLastMonthFilter = () => {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  return {
    dataInicio: lastMonth.toISOString().slice(0, 10),
    dataFim: lastMonthEnd.toISOString().slice(0, 10),
  }
}

const DashboardPage = () => {
  const { data: fiscalizacoes = [] } = useFiscalizacoes()
  const { data: lastMonthReport } = useRelatorio(getLastMonthFilter())

  const createEmpresaMutation = useCreateEmpresa()
  const createUsuarioMutation = useCreateUsuario()

  const [fiscDialogOpen, setFiscDialogOpen] = useState(false)
  const [empresaDialogOpen, setEmpresaDialogOpen] = useState(false)
  const [contratoDialogOpen, setContratoDialogOpen] = useState(false)
  const [usuarioDialogOpen, setUsuarioDialogOpen] = useState(false)

  const handleDownloadRelatorio = () => {
    if (!lastMonthReport || lastMonthReport.fiscalizacoes.length === 0) {
      toast.info("Nenhuma fiscalização encontrada no último mês")
      return
    }

    const exportData = lastMonthReport.fiscalizacoes.map((f) => ({
      Protocolo: f.protocolo,
      "Mês/Ano": formatMesAno(f.mesAno),
      Empresa: f.empresaNome,
      Contrato: f.contratoNumero,
      Status: STATUS_LABELS[f.status],
      Fiscalizador: f.fiscalizadorNome ?? "—",
    }))

    exportToExcel(exportData, "relatorio-mensal")
    toast.success("Relatório mensal baixado com sucesso")
  }

  const handleCreateEmpresa = (data: EmpresaFormData) => {
    createEmpresaMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Empresa criada com sucesso")
        setEmpresaDialogOpen(false)
      },
    })
  }

  const handleCreateUsuario = (data: UsuarioFormData) => {
    createUsuarioMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Usuário criado com sucesso")
        setUsuarioDialogOpen(false)
      },
    })
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral das fiscalizações"
      />

      <KpiCards fiscalizacoes={fiscalizacoes} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StatusChart fiscalizacoes={fiscalizacoes} />
        <QuickActions
          onNovaFiscalizacao={() => setFiscDialogOpen(true)}
          onDownloadRelatorio={handleDownloadRelatorio}
          onCadastrarEmpresa={() => setEmpresaDialogOpen(true)}
          onCadastrarContrato={() => setContratoDialogOpen(true)}
          onCadastrarUsuario={() => setUsuarioDialogOpen(true)}
        />
      </div>

      <div className="mt-6">
        <RecentFiscalizacoes fiscalizacoes={fiscalizacoes} />
      </div>

      <NovaFiscalizacaoDialog
        open={fiscDialogOpen}
        onOpenChange={setFiscDialogOpen}
      />

      <EmpresaDialog
        open={empresaDialogOpen}
        onOpenChange={setEmpresaDialogOpen}
        onSubmit={handleCreateEmpresa}
        isLoading={createEmpresaMutation.isPending}
      />

      <NovoContratoQuickDialog
        open={contratoDialogOpen}
        onOpenChange={setContratoDialogOpen}
      />

      <UsuarioDialog
        open={usuarioDialogOpen}
        onOpenChange={setUsuarioDialogOpen}
        onSubmit={handleCreateUsuario}
        isLoading={createUsuarioMutation.isPending}
      />
    </div>
  )
}

export default DashboardPage
