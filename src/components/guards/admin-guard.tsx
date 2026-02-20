import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/stores/auth.store.ts"

export const AdminGuard = () => {
  const user = useAuthStore((s) => s.user)

  if (!user || user.role !== "administrador") {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
