import {
  Building2,
  ClipboardCheck,
  FileBarChart,
  LayoutDashboard,
  Users,
} from "lucide-react"
import { Link, useLocation } from "react-router"
import { cn } from "@/lib/utils.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import { useSidebarStore } from "@/stores/sidebar.store.ts"
import type { UserRole } from "@/types/auth.ts"

type NavItem = {
  readonly label: string
  readonly icon: React.ElementType
  readonly path: string
  readonly roles: readonly UserRole[]
}

const navItems: readonly NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    roles: ["fiscal", "administrador"],
  },
  {
    label: "Fiscalizações",
    icon: ClipboardCheck,
    path: "/fiscalizacoes",
    roles: ["fiscal", "administrador"],
  },
  {
    label: "Relatórios",
    icon: FileBarChart,
    path: "/relatorios",
    roles: ["fiscal", "administrador"],
  },
  {
    label: "Empresas",
    icon: Building2,
    path: "/empresas",
    roles: ["administrador"],
  },
  {
    label: "Usuários",
    icon: Users,
    path: "/usuarios",
    roles: ["administrador"],
  },
]

export const Sidebar = () => {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const { collapsed } = useSidebarStore()

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  )

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path)

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link to="/" className="text-lg font-bold text-sidebar-primary">
          {collapsed ? "F" : "FISCON"}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.path)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              collapsed && "justify-center px-2",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {!collapsed && user && (
        <div className="border-t border-sidebar-border p-4">
          <p className="text-sm font-medium text-sidebar-foreground">
            {user.nome}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {user.role}
          </p>
        </div>
      )}
    </aside>
  )
}
