import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router"
import { AdminGuard } from "@/components/guards/admin-guard.tsx"
import { AuthGuard } from "@/components/guards/auth-guard.tsx"

const AuthenticatedLayout = lazy(
  () => import("@/components/layout/authenticated-layout.tsx"),
)
const LoginPage = lazy(() => import("@/pages/login/login.page.tsx"))
const DashboardPage = lazy(
  () => import("@/pages/dashboard/dashboard.page.tsx"),
)
const EmpresasPage = lazy(
  () => import("@/pages/empresas/empresas.page.tsx"),
)
const EmpresaDetailPage = lazy(
  () => import("@/pages/empresas/empresa-detail.page.tsx"),
)
const FiscalizacoesPage = lazy(
  () => import("@/pages/fiscalizacoes/fiscalizacoes.page.tsx"),
)
const FiscalizacaoDetailPage = lazy(
  () => import("@/pages/fiscalizacoes/fiscalizacao-detail.page.tsx"),
)
const AnalisePage = lazy(
  () => import("@/pages/fiscalizacoes/analise.page.tsx"),
)
const RelatoriosPage = lazy(
  () => import("@/pages/relatorios/relatorios.page.tsx"),
)
const UsuariosPage = lazy(
  () => import("@/pages/usuarios/usuarios.page.tsx"),
)
const PerfilPage = lazy(
  () => import("@/pages/perfil/perfil.page.tsx"),
)
const NotFoundPage = lazy(
  () => import("@/pages/not-found/not-found.page.tsx"),
)

const SuspenseWrapper = ({ children }: { readonly children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    }
  >
    {children}
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: (
          <SuspenseWrapper>
            <AuthenticatedLayout />
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "fiscalizacoes",
            element: (
              <SuspenseWrapper>
                <FiscalizacoesPage />
              </SuspenseWrapper>
            ),
          },
{
            path: "fiscalizacoes/:id",
            element: (
              <SuspenseWrapper>
                <FiscalizacaoDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "fiscalizacoes/:id/analise",
            element: (
              <SuspenseWrapper>
                <AnalisePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "perfil",
            element: (
              <SuspenseWrapper>
                <PerfilPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "relatorios",
            element: (
              <SuspenseWrapper>
                <RelatoriosPage />
              </SuspenseWrapper>
            ),
          },
          {
            element: <AdminGuard />,
            children: [
              {
                path: "empresas",
                element: (
                  <SuspenseWrapper>
                    <EmpresasPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "empresas/:id",
                element: (
                  <SuspenseWrapper>
                    <EmpresaDetailPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "usuarios",
                element: (
                  <SuspenseWrapper>
                    <UsuariosPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
          {
            path: "*",
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
])
