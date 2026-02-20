import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { EmpresaDialog } from "./components/empresa-dialog.tsx"
import { ConfirmDialog } from "@/components/shared/confirm-dialog.tsx"
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header.tsx"
import { DataTable } from "@/components/shared/data-table.tsx"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  useEmpresas,
  useCreateEmpresa,
  useUpdateEmpresa,
  useDeleteEmpresa,
} from "@/hooks/use-empresas.ts"
import type { EmpresaFormData } from "@/schemas/empresa.schema.ts"
import type { Empresa } from "@/types/empresa.ts"

const makeColumns = (
  onEdit: (empresa: Empresa) => void,
  onDelete: (id: string) => void,
): readonly ColumnDef<Empresa>[] => [
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nome")}</span>
    ),
  },
  {
    accessorKey: "cnpj",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CNPJ" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("cnpj")}</Badge>
    ),
  },
  {
    accessorKey: "telefone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefone" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: "acoes",
    header: "Ações",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const empresa = row.original
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(empresa)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(empresa.id)
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )
    },
  },
]

const EmpresasPage = () => {
  const navigate = useNavigate()
  const { data: empresas = [], isLoading } = useEmpresas()
  const createMutation = useCreateEmpresa()
  const updateMutation = useUpdateEmpresa()
  const deleteMutation = useDeleteEmpresa()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreate = (data: EmpresaFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Empresa criada com sucesso")
        setDialogOpen(false)
      },
    })
  }

  const handleUpdate = (data: EmpresaFormData) => {
    if (!editingEmpresa) return
    updateMutation.mutate(
      { id: editingEmpresa.id, data },
      {
        onSuccess: () => {
          toast.success("Empresa atualizada com sucesso")
          setEditingEmpresa(null)
        },
      },
    )
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Empresa excluída com sucesso")
        setDeleteId(null)
      },
    })
  }

  const columns = makeColumns(
    (empresa) => setEditingEmpresa(empresa),
    (id) => setDeleteId(id),
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Empresas" description="Gerenciamento de empresas terceirizadas">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={empresas}
        onRowClick={(empresa) => void navigate(`/empresas/${empresa.id}`)}
        searchColumn="nome"
        searchPlaceholder="Buscar empresa..."
        emptyMessage="Nenhuma empresa cadastrada"
      />

      <EmpresaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      <EmpresaDialog
        open={!!editingEmpresa}
        onOpenChange={(open) => {
          if (!open) setEditingEmpresa(null)
        }}
        empresa={editingEmpresa}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title="Excluir empresa"
        description="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        confirmLabel="Excluir"
        destructive
      />
    </div>
  )
}

export default EmpresasPage
