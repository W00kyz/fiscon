export const formatCNPJ = (cnpj: string): string => cnpj

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)

export const formatMesAno = (mesAno: string): string => {
  const [year, month] = mesAno.split("-")
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ]
  return `${meses[Number(month) - 1]}/${year}`
}

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("pt-BR")

export const formatDateTime = (date: string): string =>
  new Date(date).toLocaleString("pt-BR")

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
