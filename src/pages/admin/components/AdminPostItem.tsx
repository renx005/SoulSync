import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { ForumPost } from "@/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  MessageSquare, 
  Heart, 
  Trash, 
  Eye, 
  User,
  CheckCircle,
  Shield,
  BadgeCheck
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AdminPostItemProps {
  post: ForumPost;
  onDelete: () => void;
}

export function AdminPostItem({ post, onDelete }: AdminPostItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const getFormattedDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex p-4 hover:bg-accent/20">
      <Avatar className="h-9 w-9 mt-0.5 mr-3">
        <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
        <AvatarFallback>
          {post.isAnonymous ? <User className="h-4 w-4" /> : post.author.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link 
            to={`/admin/community/post/${post.id}`} 
            className="text-base font-medium hover:underline mr-auto"
          >
            {post.title}
            {post.isHidden && (
              <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 text-[10px] py-0 h-4">
                Hidden
              </Badge>
            )}
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link to={`/admin/community/post/${post.id}`} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-1 text-sm items-center text-muted-foreground mt-1">
          <span className="flex items-center">
            {post.isAnonymous ? 'Anonymous' : post.author}
            {post.authorRole === 'professional' && (
              <span className="ml-1.5 inline-flex items-center">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-600 stroke-white" />
              </span>
            )}
            {post.authorRole === 'admin' && (
              <span className="ml-1.5 inline-flex items-center">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
              </span>
            )}
          </span>
          <span>•</span>
          <span>{getFormattedDate(post.date)}</span>
          {post.isEdited && (
            <>
              <span>•</span>
              <span>Edited</span>
            </>
          )}
        </div>
        
        <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {post.content}
        </div>
        
        {post.images && post.images.length > 0 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {post.images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`Post image ${i + 1}`} 
                className="h-16 w-16 object-cover rounded-md border" 
              />
            ))}
          </div>
        )}
        
        <div className="flex mt-3 text-muted-foreground text-xs">
          <div className="flex items-center gap-1 mr-4">
            <Heart className="h-3.5 w-3.5" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.replies}</span>
          </div>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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
