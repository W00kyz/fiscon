import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils.ts"

type DataTableColumnHeaderProps<TData, TValue> = {
  readonly column: Column<TData, TValue>
  readonly title: string
  readonly className?: string
}

export const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const sorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      <span>{title}</span>
      {sorted === "desc" ? (
        <ArrowDown className="ml-1 h-3.5 w-3.5" />
      ) : sorted === "asc" ? (
        <ArrowUp className="ml-1 h-3.5 w-3.5" />
      ) : (
        <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/70" />
      )}
    </Button>
  )
}
