import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { AnaliseHeader } from "./components/analise-header.tsx"
import { FuncionariosList } from "./components/funcionarios-list.tsx"
import { PdfViewer } from "./components/pdf-viewer.tsx"
import { useFiscalizacao, useUpdateFiscalizacaoStatus } from "@/hooks/use-fiscalizacoes.ts"
import { useAssignFiscalizador } from "@/hooks/use-fiscalizacoes.ts"
import { useFuncionarios, useUpdateFuncionarios } from "@/hooks/use-funcionarios.ts"
import {
  funcionariosFormSchema,
  type FuncionariosFormData,
} from "@/schemas/funcionario.schema.ts"
import { useAuthStore } from "@/stores/auth.store.ts"

const AnalisePage = () => {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: fiscalizacao, isLoading: loadingFisc } = useFiscalizacao(id)
  const { data: funcionarios = [], isLoading: loadingFunc } = useFuncionarios(id)
  const statusMutation = useUpdateFiscalizacaoStatus()
  const updateFuncMutation = useUpdateFuncionarios()
  const assignMutation = useAssignFiscalizador()

  const methods = useForm<FuncionariosFormData>({
    resolver: zodResolver(funcionariosFormSchema),
    defaultValues: { funcionarios: [] },
  })

  // Populate form when data loads
  useEffect(() => {
    if (funcionarios.length > 0) {
      methods.reset({ funcionarios: [...funcionarios] })
    }
  }, [funcionarios, methods])

  // Auto-assign fiscalizador if not already assigned
  useEffect(() => {
    if (
      fiscalizacao &&
      !fiscalizacao.fiscalizadorId &&
      user &&
      fiscalizacao.status === "aguardando_analise"
    ) {
      assignMutation.mutate({
        id: fiscalizacao.id,
        fiscalizadorId: user.id,
        fiscalizadorNome: user.nome,
      })
    }
  }, [fiscalizacao, user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFinalize = () => {
    const formData = methods.getValues()

    // Save funcionarios first, then update status
    updateFuncMutation.mutate(
      { fiscalizacaoId: id, funcionarios: formData.funcionarios },
      {
        onSuccess: () => {
          statusMutation.mutate(
            { id, status: "finalizado" },
            {
              onSuccess: () => {
                toast.success("Fiscalização finalizada com sucesso")
                void navigate("/fiscalizacoes")
              },
            },
          )
        },
      },
    )
  }

  if (loadingFisc || loadingFunc) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!fiscalizacao) {
    return <p className="text-muted-foreground">Fiscalização não encontrada</p>
  }

  if (fiscalizacao.status !== "em_analise") {
    return (
      <p className="text-muted-foreground">
        Esta fiscalização não está disponível para análise.
      </p>
    )
  }

  const isLoading =
    statusMutation.isPending || updateFuncMutation.isPending

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] flex-col">
      <AnaliseHeader
        mesAno={fiscalizacao.mesAno}
        empresaNome={fiscalizacao.empresaNome}
        contratoNumero={fiscalizacao.contratoNumero}
        onFinalizar={handleFinalize}
        isLoading={isLoading}
      />

      <FormProvider {...methods}>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 overflow-hidden border-r">
            <FuncionariosList />
          </div>
          <div className="w-1/2 overflow-hidden">
            <PdfViewer documentos={fiscalizacao.documentos} />
          </div>
        </div>
      </FormProvider>
    </div>
  )
}

export default AnalisePage
