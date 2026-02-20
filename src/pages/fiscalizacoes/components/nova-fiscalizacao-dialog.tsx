import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { MonthYearInput } from "@/components/shared/month-year-input.tsx"
import {
  PdfUploadWithType,
  type FileWithType,
} from "@/components/shared/pdf-upload-with-type.tsx"
import { ZipBatchUpload } from "@/components/shared/zip-batch-upload.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx"
import { useContratos } from "@/hooks/use-contratos.ts"
import { useEmpresas } from "@/hooks/use-empresas.ts"
import {
  useCreateFiscalizacao,
  useCreateFiscalizacaoBatch,
} from "@/hooks/use-fiscalizacoes.ts"
import type { ZipBatch } from "@/lib/zip-extract.ts"
import {
  fiscalizacaoFormSchema,
  type FiscalizacaoFormData,
} from "@/schemas/fiscalizacao.schema.ts"

type NovaFiscalizacaoDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export const NovaFiscalizacaoDialog = ({
  open,
  onOpenChange,
}: NovaFiscalizacaoDialogProps) => {
  const { data: empresas = [] } = useEmpresas()
  const createMutation = useCreateFiscalizacao()
  const batchMutation = useCreateFiscalizacaoBatch()

  const [tab, setTab] = useState<string>("individual")

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FiscalizacaoFormData>({
    resolver: zodResolver(fiscalizacaoFormSchema),
    defaultValues: { empresaId: "", contratoId: "", mesAno: "" },
  })

  const empresaId = watch("empresaId")
  const contratoId = watch("contratoId")
  const { data: contratos = [] } = useContratos(empresaId || undefined)

  const [files, setFiles] = useState<readonly FileWithType[]>([])
  const [batches, setBatches] = useState<readonly ZipBatch[]>([])

  const onSubmitIndividual = (data: FiscalizacaoFormData) => {
    if (files.length === 0) {
      toast.error("Envie pelo menos um arquivo PDF")
      return
    }

    const untyped = files.some((f) => !f.tipo)
    if (untyped) {
      toast.error("Selecione o tipo de cada documento")
      return
    }

    createMutation.mutate(
      { data, files: files.map((f) => f.file) },
      {
        onSuccess: (fisc) => {
          toast.success(
            `Fiscalização ${fisc.protocolo} criada com sucesso`,
          )
          reset()
          setFiles([])
          onOpenChange(false)
        },
      },
    )
  }

  const handleSubmitBatch = () => {
    if (!empresaId || !contratoId) {
      toast.error("Selecione empresa e contrato")
      return
    }

    if (batches.length === 0) {
      toast.error("Envie um arquivo .zip com PDFs")
      return
    }

    const untypedBatches = batches.filter((b) =>
      b.files.some((f) => !f.tipo),
    )
    if (untypedBatches.length > 0) {
      toast.error(
        "Alguns arquivos não tiveram o tipo detectado. Renomeie-os seguindo o padrão de nomes.",
      )
      return
    }

    const batchPayload = batches.map((batch) => ({
      data: {
        empresaId,
        contratoId,
        mesAno: batch.mesAno,
      },
      files: batch.files.map((f) => f.file),
    }))

    batchMutation.mutate(batchPayload, {
      onSuccess: (results) => {
        toast.success(
          `${results.length} fiscalização(ões) criada(s) com sucesso`,
        )
        reset()
        setBatches([])
        setFiles([])
        onOpenChange(false)
      },
    })
  }

  const isPending = createMutation.isPending || batchMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Fiscalização</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select
                value={empresaId}
                onValueChange={(val) => {
                  setValue("empresaId", val)
                  setValue("contratoId", "")
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
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
                value={contratoId}
                onValueChange={(val) => setValue("contratoId", val)}
                disabled={!empresaId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o contrato" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
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
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="lote">Envio em Lote</TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <form
                onSubmit={handleSubmit(onSubmitIndividual)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>Mês/Ano</Label>
                  <Controller
                    name="mesAno"
                    control={control}
                    render={({ field }) => (
                      <MonthYearInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.mesAno && (
                    <p className="text-xs text-destructive">
                      {errors.mesAno.message}
                    </p>
                  )}
                </div>

                <PdfUploadWithType
                  files={files}
                  onFilesChange={setFiles}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {createMutation.isPending
                      ? "Criando..."
                      : "Criar Fiscalização"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="lote">
              <div className="space-y-6">
                <ZipBatchUpload
                  batches={batches}
                  onBatchesChange={setBatches}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={handleSubmitBatch}
                  >
                    {batchMutation.isPending
                      ? `Criando ${batches.length} fiscalizações...`
                      : `Criar ${batches.length} Fiscalização(ões)`}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
