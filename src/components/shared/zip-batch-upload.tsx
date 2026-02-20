import {
  AlertCircle,
  Archive,
  CheckCircle,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { DOCUMENTO_LABELS } from "@/lib/constants.ts"
import { formatFileSize } from "@/lib/format.ts"
import { extractZipBatches, type ZipBatch } from "@/lib/zip-extract.ts"

type ZipBatchUploadProps = {
  readonly batches: readonly ZipBatch[]
  readonly onBatchesChange: (batches: readonly ZipBatch[]) => void
}

const formatMesAno = (mesAno: string): string => {
  const [year, month] = mesAno.split("-")
  return `${month}/${year}`
}

export const ZipBatchUpload = ({
  batches,
  onBatchesChange,
}: ZipBatchUploadProps) => {
  const [inputKey, setInputKey] = useState(0)
  const [isExtracting, setIsExtracting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zipName, setZipName] = useState<string | null>(null)

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsExtracting(true)
    setError(null)

    try {
      const extracted = await extractZipBatches(file)
      if (extracted.length === 0) {
        setError(
          "Nenhum PDF encontrado. O zip deve seguir o formato: ano/mês/*.pdf (ex: 2025/01/documento.pdf)",
        )
        onBatchesChange([])
      } else {
        onBatchesChange(extracted)
        setZipName(file.name)
      }
    } catch {
      setError("Erro ao processar o arquivo .zip")
      onBatchesChange([])
    } finally {
      setIsExtracting(false)
      setInputKey((k) => k + 1)
    }
  }

  const handleRemove = () => {
    onBatchesChange([])
    setZipName(null)
    setError(null)
  }

  const totalFiles = batches.reduce(
    (sum, batch) => sum + batch.files.length,
    0,
  )
  const untypedFiles = batches.reduce(
    (sum, batch) => sum + batch.files.filter((f) => !f.tipo).length,
    0,
  )

  return (
    <div className="space-y-3">
      <Label>Arquivo ZIP (lote)</Label>

      {batches.length === 0 ? (
        <>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="zip-upload"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50"
            >
              {isExtracting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isExtracting
                ? "Extraindo..."
                : "Selecionar arquivo .zip"}
            </Label>
            <Input
              key={inputKey}
              id="zip-upload"
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleFileChange}
              disabled={isExtracting}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Formato esperado: ano/mês/*.pdf (ex: 2025/01/cartao_ponto_fixos.pdf)
          </p>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <Archive className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{zipName}</span>
              <span className="text-muted-foreground">
                — {batches.length}{" "}
                {batches.length === 1 ? "mês" : "meses"},{" "}
                {totalFiles} PDFs
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {untypedFiles > 0 && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {untypedFiles} arquivo(s) sem tipo detectado — serão
              ignorados ou devem ser renomeados
            </div>
          )}

          <div className="max-h-60 space-y-2 overflow-y-auto">
            {batches.map((batch) => (
              <div
                key={batch.mesAno}
                className="rounded-md border px-3 py-2"
              >
                <p className="mb-1 text-sm font-medium">
                  {formatMesAno(batch.mesAno)}
                </p>
                <div className="space-y-1">
                  {batch.files.map((item, idx) => (
                    <div
                      key={`${batch.mesAno}-${idx}`}
                      className="flex items-center gap-2 text-xs"
                    >
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="flex-1 truncate">
                        {item.file.name}
                      </span>
                      <span className="text-muted-foreground">
                        {formatFileSize(item.file.size)}
                      </span>
                      {item.tipo ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          {DOCUMENTO_LABELS[item.tipo]}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                          <AlertCircle className="h-3 w-3" />
                          Sem tipo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
