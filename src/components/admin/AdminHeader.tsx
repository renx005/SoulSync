import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, UserCog, ShieldCheck, AlertTriangle, Settings, User, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type AdminNotification = {
  id: string;
  title: string;
  message: string;
  type: 'verification' | 'report' | 'user' | 'system';
  read: boolean;
  timestamp: Date;
  url?: string;
};

export function AdminHeader() {
  const { user, logout, pendingProfessionals } = useUser();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  useEffect(() => {
    const generatedNotifications: AdminNotification[] = [];
    
    pendingProfessionals.forEach(professional => {
      generatedNotifications.push({
        id: `prof_${professional.id}`,
        title: 'Professional Verification',
        message: `${professional.username} has requested professional verification as a ${professional.occupation}.`,
        type: 'verification',
        read: false,
        timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24),
        url: '/admin/verifications'
      });
    });
    
    const storedReports = localStorage.getItem('soulsync_reported_content') ? 
      JSON.parse(localStorage.getItem('soulsync_reported_content') || '[]') : [];
    
    storedReports.forEach((report: any, index: number) => {
      if (report.status === 'pending') {
        generatedNotifications.push({
          id: `report_${report.id || index}`,
          title: 'Content Report',
          message: `A ${report.contentType || 'post'} has been reported for review.`,
          type: 'report',
          read: false,
          timestamp: new Date(report.date || Date.now() - Math.random() * 1000 * 60 * 60 * 48),
          url: '/admin/reports'
        });
      }
    });
    
    const storedNotifications = localStorage.getItem('soulsync_admin_notifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        parsedNotifications.forEach((notification: any) => {
          generatedNotifications.push({
            ...notification,
            timestamp: new Date(notification.timestamp)
          });
        });
      } catch (error) {
        console.error('Failed to parse admin notifications:', error);
      }
    }
    
    generatedNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setNotifications(generatedNotifications);
  }, [pendingProfessionals]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? {...notification, read: true} : notification
      )
    );
    
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    );
    
    localStorage.setItem('soulsync_admin_notifications', 
      JSON.stringify(updatedNotifications.filter(n => !n.id.startsWith('prof_') && !n.id.startsWith('report_')))
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({...notification, read: true}))
    );
    
    const filteredNotifications = notifications.filter(n => !n.id.startsWith('prof_') && !n.id.startsWith('report_'));
    const updatedNotifications = filteredNotifications.map(notification => ({...notification, read: true}));
    
    localStorage.setItem('soulsync_admin_notifications', JSON.stringify(updatedNotifications));
  };
  
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-border/50 shadow-sm py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center md:hidden">
            <ShieldCheck className="h-6 w-6 text-black dark:text-white mr-2" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            <span className="hidden md:inline">SoulSync</span> Admin
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            onClick={() => setNotificationOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black">
                    <ShieldCheck className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Sheet open={notificationOpen} onOpenChange={setNotificationOpen}>
            <SheetContent className="w-full md:max-w-md">
              <SheetHeader>
                <SheetTitle className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead} 
                      className="text-xs"
                    >
                      Mark all as read
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                {notifications.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        to={notification.url || '#'}
                        className={cn(
                          "p-3 rounded-lg border flex gap-3 block cursor-pointer",
                          notification.read 
                            ? "bg-background border-border/50"
                            : "bg-muted/30 border-black/20 dark:border-white/20"
                        )}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (!notification.url) {
                            setNotificationOpen(false);
                          }
                        }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            notification.type === 'verification' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                            notification.type === 'report' && "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
                            notification.type === 'user' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
                            notification.type === 'system' && "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                          )}>
                            {notification.type === 'verification' && <ShieldCheck className="h-4 w-4" />}
                            {notification.type === 'report' && <AlertTriangle className="h-4 w-4" />}
                            {notification.type === 'user' && <User className="h-4 w-4" />}
                            {notification.type === 'system' && <Bell className="h-4 w-4" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
