export type AppNotification = {
  readonly id: string
  readonly title: string
  readonly message: string
  readonly type: "info" | "warning" | "success"
  readonly read: boolean
  readonly fiscalizacaoId: string | null
  readonly createdAt: string
}
