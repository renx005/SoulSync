
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle2, MessageSquare, Heart, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "reply" | "like" | "report" | "verification" | "system" | "user";
  content: string;
  date: string;
  read: boolean;
}

interface ProfessionalNotificationPanelProps {
  onClose?: () => void;
}

// Helper to get the right icon based on type
const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "reply":
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case "like":
      return <Heart className="h-5 w-5 text-red-500" />;
    case "report":
      return <ShieldAlert className="h-5 w-5 text-orange-500" />;
    case "verification":
      return <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-500" />;
    case "system":
      return <Bell className="h-5 w-5 text-yellow-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

export default function ProfessionalNotificationPanel({ onClose }: ProfessionalNotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load notifications from professional-specific localStorage
  useEffect(() => {
    try {
      const notifStr = localStorage.getItem("soulsync_professional_notifications");
      if (notifStr) {
        setNotifications(JSON.parse(notifStr));
      } else {
        setNotifications([]);
      }
    } catch (e) {
      setError("Failed to load notifications.");
    }
  }, []);

  const markAsRead = (id: string) => {
    try {
      setNotifications((prev) => {
        const updated = prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        );
        localStorage.setItem("soulsync_professional_notifications", JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      setError("Failed to update notification.");
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-40 py-6 text-muted-foreground">
        <Bell className="h-10 w-10 mb-2 opacity-20" />
        <div>No notifications</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-80 max-h-[350px] bg-accent rounded-md p-4">
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "p-3 rounded-lg cursor-pointer transition-colors",
              notification.read ? "bg-accent/50" : "bg-primary/10"
            )}
            onClick={() => {
              markAsRead(notification.id);
              if (onClose) onClose();
            }}
          >
            <div className="flex gap-3">
              <div className="mt-1">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1">
                <div className={cn("text-sm", !notification.read && "font-semibold")}>
                  {notification.content}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                </div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-mindscape-primary self-start mt-2" />
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
