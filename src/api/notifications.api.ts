import { randomDelay } from "./client.ts"
import { getNotifications, setNotifications } from "./mock-data/store.ts"
import type { AppNotification } from "@/types/notification.ts"

export const fetchNotifications = async (): Promise<
  readonly AppNotification[]
> => {
  await randomDelay()
  return getNotifications()
}

export const markNotificationAsRead = async (
  id: string,
): Promise<void> => {
  await randomDelay()
  setNotifications(
    getNotifications().map((n) =>
      n.id === id ? { ...n, read: true } : n,
    ),
  )
}

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await randomDelay()
  setNotifications(getNotifications().map((n) => ({ ...n, read: true })))
}
