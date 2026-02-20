import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { UsuarioDialog } from "./components/usuario-dialog.tsx"
import { ConfirmDialog } from "@/components/shared/confirm-dialog.tsx"
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header.tsx"
import { DataTable } from "@/components/shared/data-table.tsx"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  useUsuarios,
  useCreateUsuario,
  useUpdateUsuario,
  useDeleteUsuario,
} from "@/hooks/use-usuarios.ts"
import type { UsuarioFormData } from "@/schemas/usuario.schema.ts"
import type { Usuario } from "@/types/usuario.ts"

const makeColumns = (
  onEdit: (usuario: Usuario) => void,
  onDelete: (id: string) => void,
): readonly ColumnDef<Usuario>[] => [
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Perfil" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("role") === "administrador" ? "default" : "secondary"
        }
      >
        {row.getValue("role") === "administrador" ? "Admin" : "Fiscal"}
      </Badge>
    ),
    filterFn: (row, _id, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true
      return row.getValue("role") === filterValue
    },
  },
  {
    accessorKey: "ativo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue("ativo") ? "default" : "outline"}>
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
      const usuario = row.original
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(usuario)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(usuario.id)
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )
    },
  },
]

const UsuariosPage = () => {
  const { data: usuarios = [], isLoading } = useUsuarios()
  const createMutation = useCreateUsuario()
  const updateMutation = useUpdateUsuario()
  const deleteMutation = useDeleteUsuario()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreate = (data: UsuarioFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Usuário criado com sucesso")
        setDialogOpen(false)
      },
    })
  }

  const handleUpdate = (data: UsuarioFormData) => {
    if (!editingUsuario) return
    updateMutation.mutate(
      { id: editingUsuario.id, data },
      {
        onSuccess: () => {
          toast.success("Usuário atualizado com sucesso")
          setEditingUsuario(null)
        },
      },
    )
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Usuário excluído com sucesso")
        setDeleteId(null)
      },
    })
  }

  const columns = makeColumns(
    (usuario) => setEditingUsuario(usuario),
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
      <PageHeader title="Usuários" description="Gerenciamento de usuários do sistema">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={usuarios}
        onRowClick={(usuario) => setEditingUsuario(usuario)}
        searchColumn="nome"
        searchPlaceholder="Buscar usuário..."
        emptyMessage="Nenhum usuário cadastrado"
      />

      <UsuarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      <UsuarioDialog
        open={!!editingUsuario}
        onOpenChange={(open) => {
          if (!open) setEditingUsuario(null)
        }}
        usuario={editingUsuario}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title="Excluir usuário"
        description="Tem certeza que deseja excluir este usuário?"
        onConfirm={handleDelete}
        confirmLabel="Excluir"
        destructive
      />
    </div>
  )
}

export default UsuariosPage
