
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Search, MoreVertical, UserX, UserCog, Mail, User, UserCheck, ShieldCheck, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole, useUser } from "@/contexts/UserContext";

export default function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const { verifyProfessional, rejectProfessional, registeredUsers } = useUser();

  useEffect(() => {
    if (registeredUsers && registeredUsers.length > 0) {
      const processedUsers = registeredUsers.map((user: any) => ({
        ...user,
        lastActive: user.lastActive instanceof Date ? user.lastActive : new Date(user.lastActive || Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7),
        joinDate: user.joinDate instanceof Date ? user.joinDate : new Date(user.joinDate || Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30)
      }));
      
      processedUsers.sort((a: any, b: any) => a.username.localeCompare(b.username));
      
      setUsers(processedUsers);
    }
  }, [registeredUsers]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspendUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newStatus = !user.isSuspended;
    
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isSuspended: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    const usersObj = updatedUsers.reduce((acc: any, user: any) => {
      acc[user.email] = user;
      return acc;
    }, {});
    
    localStorage.setItem('soulsync_users_mock_db', JSON.stringify(usersObj));
    
    toast({
      title: newStatus ? "User suspended" : "User unsuspended",
      description: `${user?.username || 'User'} has been ${newStatus ? 'suspended' : 'unsuspended'}.`
    });
  };

  const handleManageRoles = (userId: string) => {
    const user = users.find(u => u.id === userId);
    
    if (user?.role === 'professional' && !user?.isVerified) {
      verifyProfessional(userId);
      toast({
        title: "Professional Verified",
        description: `${user?.username} has been verified as a professional.`
      });
      
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { ...u, isVerified: true };
        }
        return u;
      });
      setUsers(updatedUsers);
      
      const notification = {
        id: crypto.randomUUID(),
        title: 'Professional Verification',
        content: 'Your professional status has been verified.',
        type: 'verification',
        read: false,
        date: new Date(),
        userId: userId
      };
      
      const savedNotifications = localStorage.getItem(`soulsync_notifications_${userId}`);
      let notifications = [];
      
      if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
      }
      
      notifications.push(notification);
      localStorage.setItem(`soulsync_notifications_${userId}`, JSON.stringify(notifications));
    } else {
      toast({
        title: "Manage roles",
        description: `Role management for ${user?.username || 'User'}`
      });
    }
  };

  const handleContactUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    
    toast({
      title: "Contact user",
      description: `Mail composition for ${user?.username || 'User'} would open here.`
    });
    
    const notification = {
      id: crypto.randomUUID(),
      title: 'New Admin Message',
      content: 'You have received a new message from the admin team.',
      type: 'user',
      read: false,
      date: new Date(),
      userId: userId
    };
    
    const savedNotifications = localStorage.getItem(`soulsync_notifications_${userId}`);
    let notifications = [];
    
    if (savedNotifications) {
      notifications = JSON.parse(savedNotifications);
    }
    
    notifications.push(notification);
    localStorage.setItem(`soulsync_notifications_${userId}`, JSON.stringify(notifications));
  };

  const handleWarnUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    
    toast({
      title: "Warning sent",
      description: `A warning has been sent to ${user?.username || 'User'}.`
    });
    
    const notification = {
      id: crypto.randomUUID(),
      title: 'Warning',
      content: 'You have received a warning from the admin team.',
      type: 'system',
      read: false,
      date: new Date(),
      userId: userId
    };
    
    const savedNotifications = localStorage.getItem(`soulsync_notifications_${userId}`);
    let notifications = [];
    
    if (savedNotifications) {
      notifications = JSON.parse(savedNotifications);
    }
    
    notifications.push(notification);
    localStorage.setItem(`soulsync_notifications_${userId}`, JSON.stringify(notifications));
  };

  const getUserRoleIcon = (role: string, isVerified: boolean) => {
    if (role === 'admin') {
      return <ShieldCheck className="h-4 w-4" />;
    } else if (role === 'professional') {
      return <UserCircle className="h-4 w-4" />;
    } else {
      return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground py-0 my-[4px]">View and manage user accounts.</p>
      </div>
      
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." className="pl-9" value={searchTerm} onChange={handleSearch} />
      </div>
      
      <Card className="max-w-full overflow-hidden">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>All Users ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)] w-full">
            <div className="divide-y w-full">
              {filteredUsers.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No users found matching your search criteria.
                </div>
              ) : filteredUsers.map(user => (
                <div key={user.id} className="p-4 hover:bg-muted/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center max-w-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted">
                      {getUserRoleIcon(user.role, user.isVerified)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user.username}
                          {user.role === 'professional' && (
                            <Badge 
                              variant="outline" 
                              className={`${user.isVerified ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'} dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 text-xs`}
                            >
                              {user.isVerified ? 'Professional' : 'Pending Verification'}
                            </Badge>
                          )}
                          {user.role === 'admin' && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 text-xs">
                              Admin
                            </Badge>
                          )}
                          {user.isSuspended && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 text-xs">
                              Suspended
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-[250px] sm:max-w-full">{user.email}</div>
                        {user.occupation && (
                          <div className="text-xs text-muted-foreground mt-1">Occupation: {user.occupation}</div>
                        )}
                      </div>
                      
                      <div className="mt-1 sm:mt-0 text-xs text-muted-foreground">
                        <div>Joined: {formatDate(user.joinDate)}</div>
                        <div>Last active: {formatDate(user.lastActive)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleManageRoles(user.id)}>
                          <UserCog className="h-4 w-4 mr-2" />
                          {user.role === 'professional' && !user.isVerified 
                            ? 'Verify Professional' 
                            : 'Manage Roles'
                          }
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactUser(user.id)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Contact User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleSuspendUser(user.id)} 
                          className="text-destructive focus:text-destructive"
                          disabled={user.role === 'admin'}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          {user.isSuspended ? 'Unsuspend User' : 'Suspend User'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
