import { Outlet } from "react-router"
import { Sidebar } from "@/components/layout/sidebar.tsx"
import { Topbar } from "@/components/layout/topbar.tsx"
import { Breadcrumbs } from "@/components/shared/breadcrumbs.tsx"

const AuthenticatedLayout = () => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar />
      <main className="flex-1 overflow-auto p-6">
        <Breadcrumbs />
        <Outlet />
      </main>
    </div>
  </div>
)

export default AuthenticatedLayout
