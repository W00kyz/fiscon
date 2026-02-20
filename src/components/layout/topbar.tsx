import { LogOut, Menu, User } from "lucide-react"
import { useNavigate } from "react-router"
import { NotificationBell } from "@/components/layout/notification-bell.tsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { useAuthStore } from "@/stores/auth.store.ts"
import { useSidebarStore } from "@/stores/sidebar.store.ts"

export const Topbar = () => {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const toggle = useSidebarStore((s) => s.toggle)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    void navigate("/login")
  }

  const initials = user
    ? user.nome
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <Button variant="ghost" size="icon" onClick={toggle}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.nome}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void navigate("/perfil")}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
