import JSZip from "jszip"
import type { FileWithType } from "@/components/shared/pdf-upload-with-type.tsx"
import { detectDocumentType } from "@/lib/document-type-detection.ts"

export type ZipBatch = {
  readonly mesAno: string
  readonly files: readonly FileWithType[]
}

const VALID_PATH_RE = /^(\d{4})\/(\d{2})\/(.+\.pdf)$/i

export const extractZipBatches = async (
  zipFile: File,
): Promise<readonly ZipBatch[]> => {
  const zip = await JSZip.loadAsync(zipFile)

  const entries = Object.keys(zip.files)
    .filter((path) => !zip.files[path].dir && VALID_PATH_RE.test(path))
    .map((path) => {
      const match = VALID_PATH_RE.exec(path)
      return {
        path,
        year: match?.[1] ?? "",
        month: match?.[2] ?? "",
        filename: match?.[3] ?? "",
        entry: zip.files[path],
      }
    })

  const grouped = entries.reduce<
    Record<string, readonly (typeof entries)[number][]>
  >((acc, entry) => {
    const key = `${entry.year}-${entry.month}`
    return { ...acc, [key]: [...(acc[key] ?? []), entry] }
  }, {})

  const batchPromises = Object.entries(grouped).map(
    async ([mesAno, groupEntries]) => {
      const filePromises = groupEntries.map(async (entry) => {
        const blob = await entry.entry.async("blob")
        const file = new File([blob], entry.filename, {
          type: "application/pdf",
        })
        return {
          file,
          tipo: detectDocumentType(entry.filename),
        } as const
      })

      const files = await Promise.all(filePromises)
      return { mesAno, files } as const
    },
  )

  const batches = await Promise.all(batchPromises)
  return [...batches].sort((a, b) => a.mesAno.localeCompare(b.mesAno))
}
