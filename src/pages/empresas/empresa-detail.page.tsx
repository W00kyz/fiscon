import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"
import { ContratoDialog } from "../contratos/components/contrato-dialog.tsx"
import { ConfirmDialog } from "@/components/shared/confirm-dialog.tsx"
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header.tsx"
import { DataTable } from "@/components/shared/data-table.tsx"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import {
  useContratos,
  useCreateContrato,
  useUpdateContrato,
  useDeleteContrato,
} from "@/hooks/use-contratos.ts"
import { useEmpresa } from "@/hooks/use-empresas.ts"
import { formatCurrency, formatDate } from "@/lib/format.ts"
import type { ContratoFormData } from "@/schemas/contrato.schema.ts"
import type { Contrato } from "@/types/contrato.ts"

const makeColumns = (
  onEdit: (contrato: Contrato) => void,
  onDelete: (id: string) => void,
): readonly ColumnDef<Contrato>[] => [
  {
    accessorKey: "numero",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("numero")}</span>
    ),
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
  },
  {
    accessorKey: "dataInicio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Início" />
    ),
    cell: ({ row }) => formatDate(row.getValue("dataInicio")),
  },
  {
    accessorKey: "dataFim",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fim" />
    ),
    cell: ({ row }) => formatDate(row.getValue("dataFim")),
  },
  {
    accessorKey: "valor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => formatCurrency(row.getValue("valor")),
  },
  {
    accessorKey: "ativo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue("ativo") ? "default" : "secondary"}>
        {row.getValue("ativo") ? "Ativo" : "Inativo"}
      </Badge>
    ),
    filterFn: (row, _id, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true
      const ativo = row.getValue("ativo") as boolean
      return filterValue === "ativo" ? ativo : !ativo
    },
  },
  {
    id: "acoes",
    header: "Ações",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const contrato = row.original
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(contrato)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(contrato.id)
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )
    },
  },
]

const EmpresaDetailPage = () => {
  const { id = "" } = useParams()
  const { data: empresa, isLoading: loadingEmpresa } = useEmpresa(id)
  const { data: contratos = [], isLoading: loadingContratos } = useContratos(id)
  const createMutation = useCreateContrato()
  const updateMutation = useUpdateContrato()
  const deleteMutation = useDeleteContrato()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContrato, setEditingContrato] = useState<Contrato | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreate = (data: ContratoFormData) => {
    createMutation.mutate(
      { ...data, empresaId: id },
      {
        onSuccess: () => {
          toast.success("Contrato criado com sucesso")
          setDialogOpen(false)
        },
      },
    )
  }

  const handleUpdate = (data: ContratoFormData) => {
    if (!editingContrato) return
    updateMutation.mutate(
      { id: editingContrato.id, data: { ...data, empresaId: id } },
      {
        onSuccess: () => {
          toast.success("Contrato atualizado com sucesso")
          setEditingContrato(null)
        },
      },
    )
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Contrato excluído com sucesso")
        setDeleteId(null)
      },
    })
  }

  const columns = makeColumns(
    (contrato) => setEditingContrato(contrato),
    (cId) => setDeleteId(cId),
  )

  if (loadingEmpresa || loadingContratos) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!empresa) {
    return <p className="text-muted-foreground">Empresa não encontrada</p>
  }

  return (
    <div>
      <PageHeader title={empresa.nome} description={empresa.cnpj} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{empresa.endereco}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Telefone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{empresa.telefone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{empresa.email}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contratos</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={contratos}
        searchColumn="numero"
        searchPlaceholder="Buscar contrato..."
        emptyMessage="Nenhum contrato cadastrado"
        onRowClick={(contrato) => setEditingContrato(contrato)}
      />

      <ContratoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        empresaId={id}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      <ContratoDialog
        open={!!editingContrato}
        onOpenChange={(open) => {
          if (!open) setEditingContrato(null)
        }}
        empresaId={id}
        contrato={editingContrato}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title="Excluir contrato"
        description="Tem certeza que deseja excluir este contrato?"
        onConfirm={handleDelete}
        confirmLabel="Excluir"
        destructive
      />
    </div>
  )
}

export default EmpresaDetailPage
