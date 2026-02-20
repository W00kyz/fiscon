import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"
import { X } from "lucide-react"
import { useState } from "react"
import { DataTablePagination } from "@/components/shared/data-table-pagination.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"

type DataTableProps<TData, TValue> = {
  readonly columns: readonly ColumnDef<TData, TValue>[]
  readonly data: readonly TData[]
  readonly onRowClick?: (row: TData) => void
  readonly initialSorting?: SortingState
  readonly initialColumnFilters?: ColumnFiltersState
  readonly pageSize?: number
  readonly searchPlaceholder?: string
  readonly searchColumn?: string
  readonly emptyMessage?: string
  readonly onClearFilters?: () => void
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  onRowClick,
  initialSorting = [],
  initialColumnFilters = [],
  pageSize = 10,
  searchPlaceholder = "Buscar...",
  searchColumn,
  emptyMessage = "Nenhum resultado encontrado",
  onClearFilters,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)
  const [globalFilter, setGlobalFilter] = useState("")

  const hasActiveFilters =
    globalFilter !== "" || columnFilters.length > 0

  const handleClearFilters = () => {
    setGlobalFilter("")
    setColumnFilters([])
    onClearFilters?.()
  }

  const table = useReactTable({
    data: data as TData[],
    columns: columns as ColumnDef<TData, TValue>[],
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder={searchPlaceholder}
          value={
            searchColumn
              ? ((table
                  .getColumn(searchColumn)
                  ?.getFilterValue() as string) ?? "")
              : globalFilter
          }
          onChange={(e) =>
            searchColumn
              ? table
                  .getColumn(searchColumn)
                  ?.setFilterValue(e.target.value)
              : setGlobalFilter(e.target.value)
          }
          className="max-w-sm"
        />
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
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(row.original)}
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
