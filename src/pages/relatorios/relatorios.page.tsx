import { Download, X } from "lucide-react"
import { useState } from "react"
import { ConformidadeKpis } from "./components/conformidade-kpis.tsx"
import { ConformidadeTrendChart } from "./components/conformidade-trend-chart.tsx"
import { EmpresasConformidadeTable } from "./components/empresas-conformidade-table.tsx"
import { ProblemasComunsChart } from "./components/problemas-comuns-chart.tsx"
import { MonthYearRangePicker } from "@/components/shared/month-year-range-picker.tsx"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import { useEmpresas } from "@/hooks/use-empresas.ts"
import { useRelatorioConformidade } from "@/hooks/use-relatorio-conformidade.ts"
import { exportToExcel } from "@/lib/excel-export.ts"
import type { RelatorioConformidadeFilterData } from "@/schemas/relatorio.schema.ts"

const RelatoriosPage = () => {
  const [filters, setFilters] = useState<RelatorioConformidadeFilterData>({})
  const { data: empresas = [] } = useEmpresas()
  const { data: relatorio, isLoading } = useRelatorioConformidade(filters)

  const hasActiveFilters =
    !!filters.empresaId || !!filters.mesAnoInicio || !!filters.mesAnoFim

  const handleClearFilters = () => {
    setFilters({})
  }

  const handleExport = () => {
    if (!relatorio) return

    const exportData = relatorio.empresas.map((e) => ({
      Empresa: e.empresaNome,
      "Total Fiscalizações": e.total,
      Finalizados: e.finalizados,
      "Em Andamento": e.emAndamento,
    }))

    exportToExcel(exportData, "relatorio-conformidade")
  }

  return (
    <div>
      <PageHeader
        title="Relatórios de Conformidade"
        description="Métricas de conformidade por empresa"
      >
        {relatorio && relatorio.empresas.length > 0 && (
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        )}
      </PageHeader>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label>Empresa</Label>
              <Select
                value={filters.empresaId ?? "all"}
                onValueChange={(val) =>
                  setFilters({
                    ...filters,
                    empresaId: val === "all" ? undefined : val,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {empresas.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Período</Label>
              <MonthYearRangePicker
                value={{
                  mesAnoInicio: filters.mesAnoInicio,
                  mesAnoFim: filters.mesAnoFim,
                }}
                onChange={(range) =>
                  setFilters({
                    ...filters,
                    mesAnoInicio: range.mesAnoInicio,
                    mesAnoFim: range.mesAnoFim,
                  })
                }
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 px-2 lg:px-3"
              >
                Limpar filtros
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Carregando relatório...</p>
        </div>
      )}

      {relatorio && (
        <>
          <div className="mb-6">
            <ConformidadeKpis resumo={relatorio.resumo} />
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <ConformidadeTrendChart tendencia={relatorio.tendenciaMensal} />
            <ProblemasComunsChart problemas={relatorio.problemasComuns} />
          </div>

          <EmpresasConformidadeTable empresas={relatorio.empresas} />
        </>
      )}
    </div>
  )
}

export default RelatoriosPage
