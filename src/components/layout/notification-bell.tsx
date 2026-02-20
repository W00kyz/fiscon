import { Bell } from "lucide-react"
import { useNavigate } from "react-router"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { useNotificationPolling } from "@/hooks/use-notifications.ts"
import { formatDateTime } from "@/lib/format.ts"
import { useNotificationStore } from "@/stores/notification.store.ts"

export const NotificationBell = () => {
  useNotificationPolling()
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationStore()
  const navigate = useNavigate()

  const handleClick = (
    fiscalizacaoId: string | null,
    notifId: string,
  ) => {
    markAsRead(notifId)
    if (fiscalizacaoId) {
      void navigate(`/fiscalizacoes/${fiscalizacaoId}`)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
        >
          {unreadCount}
        </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h4 className="text-sm font-semibold">Notificações</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação
            </p>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                type="button"
                className={`w-full cursor-pointer border-b px-4 py-3 text-left transition-colors hover:bg-muted ${
                  !notif.read ? "bg-red-50/50" : ""
                }`}
                onClick={() => handleClick(notif.fiscalizacaoId, notif.id)}
              >
                <p className="text-sm font-medium">{notif.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {notif.message}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(notif.createdAt)}
                </p>
              </button>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
