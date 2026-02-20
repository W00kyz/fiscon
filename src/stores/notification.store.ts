import { create } from "zustand"
import type { AppNotification } from "@/types/notification.ts"

type NotificationStore = {
  readonly notifications: readonly AppNotification[]
  readonly unreadCount: number
  readonly setNotifications: (n: readonly AppNotification[]) => void
  readonly markAsRead: (id: string) => void
  readonly markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    )
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
    })
  },
  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }))
    set({ notifications: updated, unreadCount: 0 })
  },
}))
