import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Trash, Flag, User, Shield, CheckCircle, BadgeCheck } from "lucide-react";
import { ForumReply } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

interface AdminReplyItemProps {
  reply: ForumReply;
  onDelete: () => void;
}

export function AdminReplyItem({ reply, onDelete }: AdminReplyItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  
  const getFormattedDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleReportReply = () => {
    // Create a new report
    const newReport = {
      id: crypto.randomUUID(),
      contentId: reply.id,
      contentType: 'reply',
      reportedBy: user?.id || 'admin-1',
      reportedByName: user?.username || 'Admin',
      targetUserId: reply.authorId,
      reason: 'Flagged by admin for review',
      date: new Date(),
      status: 'pending',
      content: reply.content,
      postId: reply.postId
    };
    
    // Get existing reports
    const savedReports = localStorage.getItem('soulsync_reported_content');
    let reports = [];
    
    if (savedReports) {
      reports = JSON.parse(savedReports);
    }
    
    // Add new report
    reports.push(newReport);
    
    // Save back to localStorage
    localStorage.setItem('soulsync_reported_content', JSON.stringify(reports));
    
    // Create notification for the author
    createNotification(reply.authorId, 'report', 'Your reply has been reported and is under review.');
    
    toast({
      title: "Reply reported",
      description: "This reply has been flagged for review.",
    });
  };

  const createNotification = (userId: string, type: 'report' | 'system', content: string) => {
    // Get existing notifications
    const savedNotifications = localStorage.getItem('soulsync_notifications');
    let notifications = [];
    
    if (savedNotifications) {
      notifications = JSON.parse(savedNotifications);
    }
    
    // Add new notification
    const newNotification = {
      id: crypto.randomUUID(),
      userId: userId,
      type: type,
      content: content,
      relatedId: reply.id,
      date: new Date(),
      read: false,
      url: `/community/post/${reply.postId}`
    };
    
    notifications.push(newNotification);
    
    // Save back to localStorage
    localStorage.setItem('soulsync_notifications', JSON.stringify(notifications));
  };

  // Function to get user role icon
  const getUserRoleIcon = () => {
    if (reply.authorRole === 'professional') {
      return <CheckCircle className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />;
    } else if (reply.authorRole === 'admin') {
      return <Shield className="w-3.5 h-3.5 text-purple-600" />;
    }
    return null;
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-start">
          <Avatar className="h-8 w-8">
            <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} />
            <AvatarFallback>
              {reply.isAnonymous ? <User className="h-4 w-4" /> : reply.author.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {reply.isAnonymous ? 'Anonymous' : reply.author}
              </span>
              {reply.authorRole === 'professional' && (
                <span className="flex items-center">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-600 stroke-white" />
                </span>
              )}
              {reply.authorRole === 'admin' && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 text-[10px] py-0 h-4">
                  Admin
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {getFormattedDate(reply.date)}
              </span>
              {reply.isEdited && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>
            <div className="mt-1 text-sm whitespace-pre-wrap">
              {reply.content}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleReportReply}>
              <Flag className="h-4 w-4 mr-2" />
              Report Reply
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)} 
              className="text-destructive focus:text-destructive"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Reply
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reply? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
