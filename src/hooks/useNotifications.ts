
import { useState, useEffect } from 'react';
import { Notification } from '@/types/community';
import { getStoredNotifications, storeNotifications, createNotification } from '@/utils/notificationManager';
import { useToast } from '@/hooks/use-toast';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = getStoredNotifications();
    if (storedNotifications && Array.isArray(storedNotifications)) {
      setNotifications(storedNotifications);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    storeNotifications(notifications);
  }, [notifications]);

  // Handle mood reminders
  useEffect(() => {
    const now = new Date();
    const reminderTime = new Date(now);
    reminderTime.setHours(10, 0, 0, 0); // Set reminder for 10 AM

    if (now.getHours() === 10 && notifications.every(n => 
      n.type !== "system" || new Date(n.date).getDate() !== now.getDate())) {
      const notification = createNotification(
        "system", // Using 'system' type which is valid in NotificationType
        "How are you feeling today? Don't forget to track your mood!"
      );
      
      setNotifications(prev => [notification, ...prev]);
      toast({
        title: "Mood Check-in Reminder",
        description: "Take a moment to reflect on your mood today.",
      });
    }
  }, []);

  const addNotification = (type: Notification["type"], content: string) => {
    const notification = createNotification(type, content);
    setNotifications(prev => [notification, ...prev]);
    return notification;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    clearNotifications,
  };
}
