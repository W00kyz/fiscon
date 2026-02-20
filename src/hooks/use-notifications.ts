import { useQuery } from "@tanstack/react-query"
import { fetchNotifications } from "@/api/notifications.api.ts"
import { useNotificationStore } from "@/stores/notification.store.ts"

export const useNotificationPolling = () => {
  const { setNotifications } = useNotificationStore()

  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const data = await fetchNotifications()
      setNotifications(data)
      return data
    },
    refetchInterval: 60_000,
  })
}
