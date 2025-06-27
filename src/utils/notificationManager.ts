
import { type Notification } from "@/types/community";
import { format } from "date-fns";

export function scheduleNotification(title: string, message: string, timestamp: Date) {
  // Schedule a notification for the given time
  const scheduledTime = timestamp.getTime() - Date.now();
  if (scheduledTime > 0) {
    setTimeout(() => {
      // Create and dispatch notification
      const notification = new globalThis.Notification(title, {
        body: message,
        icon: "/icons/heart-icon.svg"
      });
    }, scheduledTime);
  }
}

export function createNotification(type: Notification["type"], content: string): Notification {
  return {
    id: Date.now().toString(),
    type,
    content,
    date: new Date(),
    read: false,
    userId: "current-user", // This should be replaced with actual user ID
    relatedId: Date.now().toString(),
  };
}

// Function to get notifications from localStorage
export function getStoredNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem('soulsync_notifications');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    return [];
  }
}

// Function to store notifications in localStorage
export function storeNotifications(notifications: Notification[]) {
  try {
    localStorage.setItem('soulsync_notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error("Error storing notifications:", error);
  }
}
