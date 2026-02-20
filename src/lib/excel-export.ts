import * as XLSX from "xlsx"

export const exportToExcel = (
  data: readonly Record<string, unknown>[],
  filename: string,
  sheetName = "Dados",
): void => {
  const worksheet = XLSX.utils.json_to_sheet([...data])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
