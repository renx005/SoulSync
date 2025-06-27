import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, CornerDownLeft, Trash2, Flag, Clock, Eye, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ReportDialog } from "@/components/community/ReportDialog";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  role: "user" | "admin";
}

interface Comment {
  id: string;
  author: User;
  content: string;
  date: string;
}

interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  date: string;
  views: number;
  likes: number;
  comments: Comment[];
}

const mockPost: Post = {
  id: "1",
  author: {
    id: "101",
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    image: "https://source.unsplash.com/50x50/?face",
    role: "user",
  },
  title: "The beauty of React Hooks",
  content:
    "React Hooks are a great addition to the React library. They allow you to use state and other React features without writing a class. This makes your code easier to read and test.",
  date: new Date().toISOString(),
  views: 1234,
  likes: 123,
  comments: [
    {
      id: "1",
      author: {
        id: "102",
        name: "Jane Smith",
        username: "janesmith",
        email: "jane.smith@example.com",
        image: "https://source.unsplash.com/50x50/?face",
        role: "user",
      },
      content: "I totally agree! Hooks have made my life so much easier.",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      author: {
        id: "103",
        name: "Mike Johnson",
        username: "mikejohnson",
        email: "mike.johnson@example.com",
        image: "https://source.unsplash.com/50x50/?face",
        role: "user",
      },
      content: "I'm still getting used to them, but I can see the benefits.",
      date: new Date().toISOString(),
    },
  ],
};

export default function PostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCommentDeleteDialogOpen, setIsCommentDeleteDialogOpen] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportItemId, setReportItemId] = useState("");
  const [reportItemType, setReportItemType] = useState<"post" | "comment">("post");

  useEffect(() => {
    // Simulate loading data from an API
    setTimeout(() => {
      if (postId === "1") {
        setPost(mockPost);
      } else {
        setError("Post not found");
      }
      setLoading(false);
    }, 500);
  }, [postId]);

  const handleReport = (id: string, type: "post" | "comment") => {
    setReportItemId(id);
    setReportItemType(type);
    setReportDialogOpen(true);
  };

  const handleAddReply = () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to reply.",
      });
      return;
    }

    if (!reply.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply.",
      });
      return;
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
      },
      content: reply,
      date: new Date().toISOString(),
    };

    setPost((prevPost) => {
      if (!prevPost) return prevPost;
      return { ...prevPost, comments: [...prevPost.comments, newComment] };
    });

    setReply("");
    toast({
      title: "Reply added",
      description: "Your reply has been added.",
    });
  };

  const handleDeletePost = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePost = () => {
    toast({
      title: "Post deleted",
      description: "The post has been deleted.",
    });
    navigate("/community");
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDeleteId(commentId);
    setIsCommentDeleteDialogOpen(true);
  };

  const confirmDeleteComment = () => {
    if (!commentToDeleteId) return;

    setPost((prevPost) => {
      if (!prevPost) return prevPost;
      return {
        ...prevPost,
        comments: prevPost.comments.filter((c) => c.id !== commentToDeleteId),
      };
    });

    toast({
      title: "Comment deleted",
      description: "The comment has been deleted.",
    });
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 space-y-8">
      {post && (
        <>
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate("/community")}>
              <CornerDownLeft className="h-5 w-5 mr-2" />
              Back to Community
            </Button>

            {user && post.author.id === user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-secondary rounded-full h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDeletePost}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.image} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
                <Badge className="bg-secondary border-none text-xs">{post.author.role}</Badge>
              </div>

              <Separator orientation="vertical" />

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                </span>
              </div>

              <Separator orientation="vertical" />

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>

              {user && post.author.id !== user.id && (
                <button 
                  className="flex items-center gap-1.5 hover:text-destructive"
                  onClick={() => handleReport(post.id, "post")}
                >
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              )}
            </div>
          </div>

          <Card className="border border-border/50">
            <CardHeader>
              <h2 className="text-xl font-semibold">Post Content</h2>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> 
              Replies ({post.comments.length})
            </h3>

            {user && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Write your reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <Button onClick={handleAddReply}>Add Reply</Button>
              </div>
            )}

            {post.comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No replies yet. Be the first to reply!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <Card key={comment.id} className="border border-border/50">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.image} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5 font-medium">
                            <p className="text-sm">{comment.author.name}</p>
                            <p className="text-xs text-muted-foreground">{comment.author.username}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                          </span>
                          
                          {user && (user.id === comment.author.id || user.role === "admin") && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="hover:bg-muted rounded-full h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Comment
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          
                          {user && comment.author.id !== user.id && (
                            <button 
                              className="p-1.5 hover:bg-muted rounded-full"
                              onClick={() => handleReport(comment.id, "comment")}
                            >
                              <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your post from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeletePost}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={isCommentDeleteDialogOpen} onOpenChange={setIsCommentDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the comment from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsCommentDeleteDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteComment}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <ReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            contentId={reportItemId}
            contentType={reportItemType}
          />
        </>
      )}
    </div>
  );
}
