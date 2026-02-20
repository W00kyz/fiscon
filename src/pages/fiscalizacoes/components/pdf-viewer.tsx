import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { DOCUMENTO_LABELS } from "@/lib/constants.ts"
import type { FiscalizacaoDocumento } from "@/types/fiscalizacao.ts"

type PdfViewerProps = {
  readonly documentos: readonly FiscalizacaoDocumento[]
}

export const PdfViewer = ({ documentos }: PdfViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (documentos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Nenhum documento disponível</p>
      </div>
    )
  }

  const currentDoc = documentos[currentIndex]

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : documentos.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < documentos.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goToPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {currentIndex + 1} / {documentos.length}
          </span>
          <Button variant="ghost" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          {DOCUMENTO_LABELS[currentDoc.tipo] ?? currentDoc.tipo}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
          <FileText className="h-16 w-16 text-muted-foreground/30" />
          <div className="text-center">
            <p className="text-sm font-medium">{currentDoc.nomeArquivo}</p>
            <p className="text-xs text-muted-foreground">
              {DOCUMENTO_LABELS[currentDoc.tipo] ?? currentDoc.tipo}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Visualização de PDF disponível quando conectado ao backend real.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
