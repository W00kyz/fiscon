import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"
import { X } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { FiscalizacaoActions } from "./fiscalizacao-actions.tsx"
import { FiscalizacaoStatusBadge } from "./fiscalizacao-status-badge.tsx"
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header.tsx"
import { DataTablePagination } from "@/components/shared/data-table-pagination.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import { useAssignFiscalizador } from "@/hooks/use-fiscalizacoes.ts"
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/constants.ts"
import { formatMesAno } from "@/lib/format.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import type { Fiscalizacao, FiscalizacaoStatus } from "@/types/fiscalizacao.ts"

type FiscalizacoesTableProps = {
  readonly fiscalizacoes: readonly Fiscalizacao[]
}

const STATUS_FILTER_OPTIONS: readonly {
  readonly value: string
  readonly label: string
}[] = [
  { value: "all", label: "Todos" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
]

const DEFAULT_STATUS_FILTER = "em_espera,processando,aguardando_analise,em_analise"

export const FiscalizacoesTable = ({
  fiscalizacoes,
}: FiscalizacoesTableProps) => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const assignMutation = useAssignFiscalizador()

  const [sorting, setSorting] = useState<SortingState>([
    { id: "mesAno", desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "status", value: DEFAULT_STATUS_FILTER },
  ])
  const [globalFilter, setGlobalFilter] = useState("")

  const sortedData = useMemo(
    () =>
      [...fiscalizacoes].sort((a, b) => {
        const aOrder = STATUS_ORDER[a.status] ?? 0
        const bOrder = STATUS_ORDER[b.status] ?? 0
        if (aOrder !== bOrder) return bOrder - aOrder

        const columnCmp = sorting.reduce<number>((result, sort) => {
          if (result !== 0) return result
          const aVal = String(
            a[sort.id as keyof Fiscalizacao] ?? "",
          )
          const bVal = String(
            b[sort.id as keyof Fiscalizacao] ?? "",
          )
          const cmp = aVal.localeCompare(bVal)
          return sort.desc ? -cmp : cmp
        }, 0)
        if (columnCmp !== 0) return columnCmp

        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        )
      }),
    [fiscalizacoes, sorting],
  )

  const handleSelfAssign = (fiscId: string) => {
    if (!user) return
    assignMutation.mutate(
      {
        id: fiscId,
        fiscalizadorId: user.id,
        fiscalizadorNome: user.nome,
      },
      {
        onSuccess: () => {
          toast.success("Fiscalização assumida com sucesso")
          void navigate(`/fiscalizacoes/${fiscId}/analise`)
        },
      },
    )
  }

  const columns: readonly ColumnDef<Fiscalizacao>[] = [
    {
      accessorKey: "protocolo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Protocolo" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("protocolo")}</span>
      ),
    },
    {
      accessorKey: "mesAno",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mês/Ano" />
      ),
      cell: ({ row }) => formatMesAno(row.getValue("mesAno")),
    },
    {
      accessorKey: "empresaNome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Empresa" />
      ),
    },
    {
      accessorKey: "contratoNumero",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contrato" />
      ),
    },
    {
      accessorKey: "fiscalizadorNome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fiscalizador" />
      ),
      cell: ({ row }) => {
        const fisc = row.original
        if (fisc.fiscalizadorNome) return fisc.fiscalizadorNome
        if (fisc.status === "aguardando_analise") {
          return (
            <button
              type="button"
              className="text-sm text-muted-foreground underline decoration-dashed hover:text-primary"
              onClick={(e) => {
                e.stopPropagation()
                handleSelfAssign(fisc.id)
              }}
            >
              Assumir
            </button>
          )
        }
        return <span className="text-muted-foreground">—</span>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <FiscalizacaoStatusBadge status={row.getValue("status")} />
      ),
      filterFn: (row, _id, filterValue: string) => {
        if (!filterValue || filterValue === "all") return true
        const statuses =
          filterValue.split(",") as readonly FiscalizacaoStatus[]
        return statuses.includes(row.getValue("status"))
      },
    },
    {
      id: "acoes",
      header: "Ações",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <FiscalizacaoActions fiscalizacao={row.original} />
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: sortedData as Fiscalizacao[],
    columns: columns as ColumnDef<Fiscalizacao>[],
    manualSorting: true,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  const currentStatusFilter =
    (table.getColumn("status")?.getFilterValue() as string) ??
    DEFAULT_STATUS_FILTER

  const hasActiveFilters =
    globalFilter !== "" || currentStatusFilter !== DEFAULT_STATUS_FILTER

  const handleClearFilters = () => {
    setGlobalFilter("")
    setColumnFilters([{ id: "status", value: DEFAULT_STATUS_FILTER }])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar fiscalização..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={currentStatusFilter}
          onValueChange={(val) =>
            table.getColumn("status")?.setFilterValue(val)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DEFAULT_STATUS_FILTER}>
              Em andamento
            </SelectItem>
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Limpar filtros
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma fiscalização encontrada
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original.id}
                  className="cursor-pointer"
                  onClick={() =>
                    void navigate(
                      `/fiscalizacoes/${row.original.id}`,
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
