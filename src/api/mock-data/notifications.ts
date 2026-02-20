import type { AppNotification } from "@/types/notification.ts"

export const initialNotifications: readonly AppNotification[] = [
  {
    id: "notif-1",
    title: "Fiscalização pronta para análise",
    message:
      "FISC-2025-0003 (Limpeza Total Ltda - Fev/2025) está pronta para análise.",
    type: "info",
    read: false,
    fiscalizacaoId: "fis-3",
    createdAt: "2025-03-05T14:00:00Z",
  },
  {
    id: "notif-2",
    title: "Fiscalização deferida",
    message:
      "FISC-2025-0001 (Limpeza Total Ltda - Jan/2025) foi deferida por Carlos Oliveira.",
    type: "success",
    read: true,
    fiscalizacaoId: "fis-1",
    createdAt: "2025-02-10T15:30:00Z",
  },
  {
    id: "notif-3",
    title: "Fiscalização indeferida",
    message:
      "FISC-2025-0002 (Segurança Patrimonial S.A. - Jan/2025) foi indeferida por Maria Santos.",
    type: "warning",
    read: true,
    fiscalizacaoId: "fis-2",
    createdAt: "2025-02-12T11:00:00Z",
  },
]
