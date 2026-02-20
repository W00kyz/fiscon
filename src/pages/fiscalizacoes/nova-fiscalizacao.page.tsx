import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import { useContratos } from "@/hooks/use-contratos.ts"
import { useEmpresas } from "@/hooks/use-empresas.ts"
import { useCreateFiscalizacao } from "@/hooks/use-fiscalizacoes.ts"
import { DOCUMENTO_LABELS } from "@/lib/constants.ts"
import { formatFileSize } from "@/lib/format.ts"
import {
  fiscalizacaoFormSchema,
  type FiscalizacaoFormData,
} from "@/schemas/fiscalizacao.schema.ts"

const getCurrentYearMonth = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

const NovaFiscalizacaoPage = () => {
  const navigate = useNavigate()
  const { data: empresas = [] } = useEmpresas()
  const createMutation = useCreateFiscalizacao()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FiscalizacaoFormData>({
    resolver: zodResolver(fiscalizacaoFormSchema),
    defaultValues: { empresaId: "", contratoId: "", mesAno: "" },
  })

  const empresaId = watch("empresaId")
  const { data: contratos = [] } = useContratos(empresaId || undefined)

  const [files, setFiles] = useState<readonly File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (selected) {
      setFiles([...files, ...Array.from(selected)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onSubmit = (data: FiscalizacaoFormData) => {
    if (files.length === 0) {
      toast.error("Envie pelo menos um arquivo PDF")
      return
    }

    createMutation.mutate(
      { data, files },
      {
        onSuccess: (fisc) => {
          toast.success(`Fiscalização ${fisc.protocolo} criada com sucesso`)
          void navigate("/fiscalizacoes")
        },
      },
    )
  }

  const docTypes = Object.entries(DOCUMENTO_LABELS)

  return (
    <div>
      <PageHeader
        title="Nova Fiscalização"
        description="Cadastre uma nova fiscalização"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Select
                  value={empresaId}
                  onValueChange={(val) => {
                    setValue("empresaId", val)
                    setValue("contratoId", "")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.empresaId && (
                  <p className="text-xs text-destructive">
                    {errors.empresaId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Contrato</Label>
                <Select
                  value={watch("contratoId")}
                  onValueChange={(val) => setValue("contratoId", val)}
                  disabled={!empresaId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contratos.map((ctr) => (
                      <SelectItem key={ctr.id} value={ctr.id}>
                        {ctr.numero} — {ctr.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.contratoId && (
                  <p className="text-xs text-destructive">
                    {errors.contratoId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mesAno">Mês/Ano</Label>
                <Input
                  id="mesAno"
                  type="month"
                  min="2020-01"
                  max={getCurrentYearMonth()}
                  {...register("mesAno")}
                />
                {errors.mesAno && (
                  <p className="text-xs text-destructive">
                    {errors.mesAno.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Documentos PDF</Label>
              <p className="text-xs text-muted-foreground">
                Envie os seguintes documentos:{" "}
                {docTypes.map(([, label]) => label).join(", ")}
              </p>

              <div className="flex items-center gap-2">
                <Label
                  htmlFor="pdf-upload"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar arquivos PDF
                </Label>
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void navigate("/fiscalizacoes")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Criando..." : "Criar Fiscalização"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NovaFiscalizacaoPage
