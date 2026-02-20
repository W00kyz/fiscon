import { Fragment } from "react"
import { Link, useLocation } from "react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx"
import { useEmpresa } from "@/hooks/use-empresas.ts"
import { useFiscalizacao } from "@/hooks/use-fiscalizacoes.ts"

const ROUTE_LABELS: Record<string, string> = {
  fiscalizacoes: "Fiscalizações",
  relatorios: "Relatórios",
  empresas: "Empresas",
  usuarios: "Usuários",
  perfil: "Perfil",
  analise: "Análise",
}

type BreadcrumbEntry = {
  readonly label: string
  readonly path: string
  readonly isLast: boolean
}

const DynamicLabel = ({
  segment,
  parentSegment,
}: {
  readonly segment: string
  readonly parentSegment: string
}) => {
  const isFiscalizacao = parentSegment === "fiscalizacoes"
  const isEmpresa = parentSegment === "empresas"

  const { data: fiscalizacao } = useFiscalizacao(
    isFiscalizacao ? segment : "",
  )
  const { data: empresa } = useEmpresa(isEmpresa ? segment : "")

  if (isFiscalizacao && fiscalizacao) return <>{fiscalizacao.protocolo}</>
  if (isEmpresa && empresa) return <>{empresa.nome}</>
  return <>{segment}</>
}

export const Breadcrumbs = () => {
  const location = useLocation()
  const segments = location.pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const entries: readonly BreadcrumbEntry[] = segments.map(
    (segment, index) => ({
      label: segment,
      path: `/${segments.slice(0, index + 1).join("/")}`,
      isLast: index === segments.length - 1,
    }),
  )

  const isDynamic = (segment: string) => !ROUTE_LABELS[segment]

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {entries.map((entry, index) => {
          const parentSegment = index > 0 ? segments[index - 1] : ""
          const label = ROUTE_LABELS[entry.label]
          const dynamic = isDynamic(entry.label)

          return (
            <Fragment key={entry.path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {entry.isLast ? (
                  <BreadcrumbPage>
                    {dynamic ? (
                      <DynamicLabel
                        segment={entry.label}
                        parentSegment={parentSegment}
                      />
                    ) : (
                      label
                    )}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={entry.path}>
                      {dynamic ? (
                        <DynamicLabel
                          segment={entry.label}
                          parentSegment={parentSegment}
                        />
                      ) : (
                        label
                      )}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
