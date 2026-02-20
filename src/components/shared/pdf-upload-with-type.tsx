import { CheckCircle, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import { DOCUMENTO_LABELS } from "@/lib/constants.ts"
import { detectDocumentType } from "@/lib/document-type-detection.ts"
import { formatFileSize } from "@/lib/format.ts"
import type { DocumentoTipo } from "@/types/fiscalizacao.ts"

export type FileWithType = {
  readonly file: File
  readonly tipo: DocumentoTipo | null
}

type PdfUploadWithTypeProps = {
  readonly files: readonly FileWithType[]
  readonly onFilesChange: (files: readonly FileWithType[]) => void
}

const ALL_TIPOS = Object.keys(DOCUMENTO_LABELS) as readonly DocumentoTipo[]

export const PdfUploadWithType = ({ files, onFilesChange }: PdfUploadWithTypeProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected) return

    const newFiles: readonly FileWithType[] = Array.from(selected).map((file) => ({
      file,
      tipo: detectDocumentType(file.name),
    }))

    onFilesChange([...files, ...newFiles])
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const updateTipo = (index: number, tipo: DocumentoTipo) => {
    onFilesChange(files.map((f, i) => (i === index ? { ...f, tipo } : f)))
  }

  const assignedTipos = new Set(files.map((f) => f.tipo).filter(Boolean))

  return (
    <div className="space-y-3">
      <Label>Documentos PDF</Label>

      <div className="flex flex-wrap gap-2">
        {ALL_TIPOS.map((tipo) => (
          <span
            key={tipo}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
              assignedTipos.has(tipo)
                ? "bg-green-100 text-green-800"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {assignedTipos.has(tipo) && <CheckCircle className="h-3 w-3" />}
            {DOCUMENTO_LABELS[tipo]}
          </span>
        ))}
      </div>

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
          {files.map((item, idx) => (
            <div
              key={`${item.file.name}-${idx}`}
              className="flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                </p>
              </div>
              <Select
                value={item.tipo ?? ""}
                onValueChange={(val) => updateTipo(idx, val as DocumentoTipo)}
              >
                <SelectTrigger
                  className={`w-[250px] ${!item.tipo ? "border-amber-400" : ""}`}
                >
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_TIPOS.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {DOCUMENTO_LABELS[tipo]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
  )
}
