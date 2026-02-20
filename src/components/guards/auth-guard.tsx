import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/stores/auth.store.ts"

export const AuthGuard = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
