
import { ForumPost } from "@/types/community";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, Calendar, Edit, Trash2, Link2, Youtube, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CategoryIcon } from "@/components/community/CategoryIcon";

interface PostItemProps {
  post: ForumPost;
  onLike?: (postId: string) => void;
  onEdit?: (post: ForumPost) => void;
  onDelete?: (postId: string) => void;
  isLiked?: boolean;
}

export function PostItem({ post, onLike, onEdit, onDelete, isLiked = false }: PostItemProps) {
  const { user } = useUser();
  const { toast } = useToast();
  
  const isAuthor = user && user.id === post.authorId;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    if (onLike) {
      onLike(post.id);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onEdit && isAuthor) {
      onEdit(post);
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDelete && isAuthor) {
      onDelete(post.id);
    }
  };
  
  // Function to check if a link is from YouTube
  const isYouTubeLink = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  return (
    <Link 
      to={`/community/post/${post.id}`}
      className="block card-primary p-3 sm:p-4 hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <h3 className="font-medium text-sm sm:text-base line-clamp-2">
          {post.title}
          {post.isEdited && (
            <span className="text-xs text-muted-foreground ml-1">(edited)</span>
          )}
        </h3>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {isAuthor && (
            <>
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                aria-label="Edit post"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Delete post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[95%] sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this post? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(e);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'} transition-colors`}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
            <span>{post.likes}</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.replies}</span>
          </div>
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
        {post.content}
      </p>
      
      {post.images && post.images.length > 0 && (
        <div className="mt-2 flex gap-1 overflow-x-auto">
          {post.images.map((img, idx) => (
            <div key={idx} className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
              <img src={img} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
      
      {post.videoLinks && post.videoLinks.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {post.videoLinks.map((link, idx) => (
            <div key={idx} className="text-xs flex items-center">
              {isYouTubeLink(link) ? (
                <span className="flex items-center gap-1 text-red-500">
                  <Youtube className="h-3 w-3" />
                  <span>YouTube video</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-blue-500">
                  <Link2 className="h-3 w-3" />
                  <span>Link</span>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-1">
          {post.isAnonymous ? (
            <span className="text-xs text-muted-foreground">Anonymous</span>
          ) : (
            <div className="flex items-center gap-1">
              <span className={cn(
                "text-xs font-medium",
                post.authorRole === "professional" ? "text-blue-600" : "text-muted-foreground"
              )}>
                {post.author}
              </span>
              {post.authorRole === "professional" && (
                <BadgeCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-600 stroke-white" />
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
        </div>
      </div>
    </Link>
  );
}
