import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header.tsx"
import { DataTable } from "@/components/shared/data-table.tsx"
import type { EmpresaConformidade } from "@/types/relatorio.ts"

type EmpresasConformidadeTableProps = {
  readonly empresas: readonly EmpresaConformidade[]
}

const columns: readonly ColumnDef<EmpresaConformidade>[] = [
  {
    accessorKey: "empresaNome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Empresa" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("empresaNome")}</span>
    ),
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
  },
  {
    accessorKey: "finalizados",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Finalizados" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-green-600">
        {row.getValue("finalizados")}
      </span>
    ),
  },
  {
    accessorKey: "emAndamento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Em Andamento" />
    ),
    cell: ({ row }) => (
      <span className="text-amber-600">
        {row.getValue("emAndamento")}
      </span>
    ),
  },
]

export const EmpresasConformidadeTable = ({
  empresas,
}: EmpresasConformidadeTableProps) => (
  <DataTable
    columns={columns}
    data={empresas}
    searchColumn="empresaNome"
    searchPlaceholder="Buscar empresa..."
    emptyMessage="Nenhuma empresa encontrada"
  />
)
