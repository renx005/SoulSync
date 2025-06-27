import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Send, Heart, Calendar, Flag, AlertTriangle, MessageSquare, Shield, CheckCircle2, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ForumPost, ForumReply } from "@/types/community";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ProfessionalPostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editReplyId, setEditReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [likedReplies, setLikedReplies] = useState<string[]>([]);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'post' | 'reply' } | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [itemToReport, setItemToReport] = useState<{ id: string, type: 'post' | 'reply' } | null>(null);
  
  useEffect(() => {
    if (!postId) return;
    
    const categories = ["anxiety", "depression", "mindfulness", "stress", "general"];
    let foundPost: ForumPost | null = null;
    let categoryId = "";
    
    for (const category of categories) {
      const savedPosts = localStorage.getItem(`soulsync_posts_${category}`);
      if (savedPosts) {
        const postsData = JSON.parse(savedPosts) as ForumPost[];
        const post = postsData.find(p => p.id === postId);
        if (post) {
          foundPost = { ...post, date: new Date(post.date) };
          categoryId = category;
          break;
        }
      }
    }
    
    if (foundPost) {
      setPost(foundPost);
      const savedReplies = localStorage.getItem(`soulsync_replies_${postId}`);
      if (savedReplies) {
        const repliesData = JSON.parse(savedReplies) as ForumReply[];
        setReplies(repliesData.map(reply => ({
          ...reply,
          date: new Date(reply.date)
        })));
      }
    } else {
      toast({
        title: "Post not found",
        description: "The post you're looking for doesn't exist or has been removed.",
        variant: "destructive"
      });
    }
  }, [postId, toast]);
  
  useEffect(() => {
    if (user) {
      const savedLikedPosts = localStorage.getItem(`soulsync_liked_posts_${user.id}`);
      const savedLikedReplies = localStorage.getItem(`soulsync_liked_replies_${user.id}`);
      
      if (savedLikedPosts) {
        setLikedPosts(JSON.parse(savedLikedPosts));
      }
      
      if (savedLikedReplies) {
        setLikedReplies(JSON.parse(savedLikedReplies));
      }
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      if (likedPosts.length > 0) {
        localStorage.setItem(`soulsync_liked_posts_${user.id}`, JSON.stringify(likedPosts));
      }
      
      if (likedReplies.length > 0) {
        localStorage.setItem(`soulsync_liked_replies_${user.id}`, JSON.stringify(likedReplies));
      }
    }
  }, [likedPosts, likedReplies, user]);
  
  const handleLikePost = () => {
    if (!user || !post) return;
    
    const isLiked = likedPosts.includes(post.id);
    
    if (isLiked) {
      setLikedPosts(prev => prev.filter(id => id !== post.id));
    } else {
      setLikedPosts(prev => [...prev, post.id]);
    }
    
    const updatedPost = {
      ...post,
      likes: isLiked ? Math.max(0, post.likes - 1) : post.likes + 1
    };
    
    setPost(updatedPost);
    
    const savedPosts = localStorage.getItem(`soulsync_posts_${post.categoryId}`);
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.map((p: ForumPost) => 
        p.id === post.id ? updatedPost : p
      );
      
      localStorage.setItem(`soulsync_posts_${post.categoryId}`, JSON.stringify(updatedPosts));
      
      toast({
        title: isLiked ? "Post unliked" : "Post liked",
        description: isLiked ? "You have removed your like" : "You have liked this post"
      });
    }
  };
  
  const handleLikeReply = (replyId: string) => {
    if (!user || !post) return;
    
    const isLiked = likedReplies.includes(replyId);
    
    if (isLiked) {
      setLikedReplies(prev => prev.filter(id => id !== replyId));
    } else {
      setLikedReplies(prev => [...prev, replyId]);
    }
    
    const updatedReplies = replies.map(reply => {
      if (reply.id === replyId) {
        return {
          ...reply,
          likes: isLiked ? Math.max(0, reply.likes - 1) : reply.likes + 1
        };
      }
      return reply;
    });
    
    setReplies(updatedReplies);
    
    localStorage.setItem(`soulsync_replies_${post.id}`, JSON.stringify(updatedReplies));
    
    toast({
      title: isLiked ? "Reply unliked" : "Reply liked",
      description: isLiked ? "You have removed your like" : "You have liked this reply"
    });
  };
  
  const handleSubmitReply = () => {
    if (!user || !post || !replyContent.trim()) return;
    
    setIsSubmitting(true);
    
    const newReply: ForumReply = {
      id: crypto.randomUUID(),
      postId: post.id,
      content: replyContent.trim(),
      author: isAnonymous ? "Anonymous" : user.username,
      authorId: isAnonymous ? "anonymous" : user.id,
      authorRole: isAnonymous ? undefined : user.role,
      date: new Date(),
      isAnonymous,
      likes: 0
    };
    
    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    
    localStorage.setItem(`soulsync_replies_${post.id}`, JSON.stringify(updatedReplies));
    
    const updatedPost = {
      ...post,
      replies: post.replies + 1
    };
    
    setPost(updatedPost);
    
    const savedPosts = localStorage.getItem(`soulsync_posts_${post.categoryId}`);
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.map((p: ForumPost) => 
        p.id === post.id ? updatedPost : p
      );
      
      localStorage.setItem(`soulsync_posts_${post.categoryId}`, JSON.stringify(updatedPosts));
    }
    
    setReplyContent("");
    setIsAnonymous(false);
    setIsSubmitting(false);
    
    toast({
      title: "Reply posted",
      description: "Your reply has been posted successfully"
    });
    
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };
  
  const handleEditReply = (reply: ForumReply) => {
    setEditReplyId(reply.id);
    setEditReplyContent(reply.content);
    
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 100);
  };
  
  const handleSaveEditedReply = () => {
    if (!editReplyId || !editReplyContent.trim() || !post) return;
    
    const updatedReplies = replies.map(reply => {
      if (reply.id === editReplyId) {
        return {
          ...reply,
          content: editReplyContent.trim(),
          isEdited: true,
          lastEditedDate: new Date()
        };
      }
      return reply;
    });
    
    setReplies(updatedReplies);
    
    localStorage.setItem(`soulsync_replies_${post.id}`, JSON.stringify(updatedReplies));
    
    setEditReplyId(null);
    setEditReplyContent("");
    
    toast({
      title: "Reply updated",
      description: "Your reply has been updated successfully"
    });
  };
  
  const openDeleteDialog = (id: string, type: 'post' | 'reply') => {
    setItemToDelete({ id, type });
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (!itemToDelete || !post) return;
    
    if (itemToDelete.type === 'post') {
      const savedPosts = localStorage.getItem(`soulsync_posts_${post.categoryId}`);
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const updatedPosts = posts.filter((p: ForumPost) => p.id !== post.id);
        
        localStorage.setItem(`soulsync_posts_${post.categoryId}`, JSON.stringify(updatedPosts));
        
        localStorage.removeItem(`soulsync_replies_${post.id}`);
        
        toast({
          title: "Post deleted",
          description: "The post has been deleted successfully"
        });
        
        navigate(`/professional/community/category/${post.categoryId}`);
      }
    } else {
      const updatedReplies = replies.filter(reply => reply.id !== itemToDelete.id);
      setReplies(updatedReplies);
      
      localStorage.setItem(`soulsync_replies_${post.id}`, JSON.stringify(updatedReplies));
      
      const updatedPost = {
        ...post,
        replies: Math.max(0, post.replies - 1)
      };
      
      setPost(updatedPost);
      
      const savedPosts = localStorage.getItem(`soulsync_posts_${post.categoryId}`);
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const updatedPosts = posts.map((p: ForumPost) => 
          p.id === post.id ? updatedPost : p
        );
        
        localStorage.setItem(`soulsync_posts_${post.categoryId}`, JSON.stringify(updatedPosts));
      }
      
      toast({
        title: "Reply deleted",
        description: "The reply has been deleted successfully"
      });
    }
    
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  const openReportDialog = (id: string, type: 'post' | 'reply') => {
    setItemToReport({ id, type });
    setIsReportDialogOpen(true);
  };
  
  const handleReport = () => {
    if (!itemToReport) return;
    
    toast({
      title: "Report submitted",
      description: `Thank you for reporting this ${itemToReport.type}. Our moderators will review it.`
    });
    
    setIsReportDialogOpen(false);
    setItemToReport(null);
  };
  
  const handleHideContent = (id: string, type: 'post' | 'reply') => {
    if (!post) return;
    
    if (type === 'post') {
      const updatedPost = {
        ...post,
        isHidden: true,
        moderatedBy: user?.id,
        moderationDate: new Date()
      };
      
      setPost(updatedPost);
      
      const savedPosts = localStorage.getItem(`soulsync_posts_${post.categoryId}`);
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const updatedPosts = posts.map((p: ForumPost) => 
          p.id === post.id ? updatedPost : p
        );
        
        localStorage.setItem(`soulsync_posts_${post.categoryId}`, JSON.stringify(updatedPosts));
      }
    } else {
      const updatedReplies = replies.map(reply => {
        if (reply.id === id) {
          return {
            ...reply,
            isHidden: true,
            moderatedBy: user?.id,
            moderationDate: new Date()
          };
        }
        return reply;
      });
      
      setReplies(updatedReplies);
      
      localStorage.setItem(`soulsync_replies_${post.id}`, JSON.stringify(updatedReplies));
    }
    
    toast({
      title: "Content hidden",
      description: `The ${type} has been hidden from regular users`
    });
  };
  
  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const isPostLiked = likedPosts.includes(post.id);
  
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="flex items-center text-muted-foreground hover:text-foreground"
        onClick={() => navigate(`/professional/community/category/${post.categoryId}`)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span className="text-sm">Back to {post.categoryName}</span>
      </Button>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base sm:text-lg">
              {post.title}
              {post.isEdited && (
                <span className="text-xs text-muted-foreground ml-1">(edited)</span>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {user?.role === "professional" && post.authorId !== user.id && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-muted-foreground hover:text-primary"
                  onClick={() => handleHideContent(post.id, 'post')}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-xs">Hide</span>
                </Button>
              )}
              
              {post.authorId === user?.id && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-8"
                  onClick={() => openDeleteDialog(post.id, 'post')}
                >
                  <span className="text-xs">Delete</span>
                </Button>
              )}
              
              <Button 
                variant={isPostLiked ? "default" : "outline"}
                size="sm" 
                className={cn(
                  "h-8",
                  isPostLiked && "bg-red-500 hover:bg-red-600"
                )}
                onClick={handleLikePost}
              >
                <Heart className={cn(
                  "h-4 w-4 mr-1",
                  isPostLiked && "fill-white"
                )} />
                <span className="text-xs">{post.likes}</span>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {post.isAnonymous ? (
                <span className="text-xs text-muted-foreground">Anonymous</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "text-xs font-medium",
                    post.authorRole === "professional" && "text-blue-600"
                  )}>
                    {post.author}
                  </span>
                  {post.authorRole === "professional" && (
                    <BadgeCheck className="h-4 w-4 text-blue-600 fill-blue-600 stroke-white" />
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(post.date, { addSuffix: true })}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 py-3 whitespace-pre-wrap">
          <div className="text-sm">
            {post.content}
          </div>
          
          {post.images && post.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.images.map((img, idx) => (
                <div key={idx} className="relative rounded-md overflow-hidden">
                  <img 
                    src={img} 
                    alt="Post attachment" 
                    className="max-h-[200px] w-auto object-contain bg-accent/40 rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
          
          {post.videoLinks && post.videoLinks.length > 0 && (
            <div className="mt-3 space-y-2">
              {post.videoLinks.map((link, idx) => (
                <div key={idx} className="text-sm text-blue-600 hover:underline break-all">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <div className="px-4">
          <Separator />
        </div>
        
        <CardHeader className="py-2 px-4">
          <div className="flex items-center gap-1 text-sm">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>{replies.length} Replies</span>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 pb-4 pt-0">
          <ScrollArea className="max-h-[400px] px-1">
            {replies.length > 0 ? (
              <div className="space-y-4">
                {replies.map(reply => (
                  <div key={reply.id} className="border rounded-md p-3 bg-accent/20">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1">
                        {reply.isAnonymous ? (
                          <span className="text-xs text-muted-foreground">Anonymous</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              "text-xs font-medium",
                              reply.authorRole === "professional" && "text-blue-600"
                            )}>
                              {reply.author}
                            </span>
                            {reply.authorRole === "professional" && (
                              <BadgeCheck className="h-4 w-4 text-blue-600 fill-blue-600 stroke-white" />
                            )}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          • {formatDistanceToNow(new Date(reply.date), { addSuffix: true })}
                        </span>
                        {reply.isEdited && (
                          <span className="text-xs text-muted-foreground">(edited)</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {user?.role === "professional" && reply.authorId !== user.id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                            onClick={() => handleHideContent(reply.id, 'reply')}
                          >
                            <Shield className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        
                        {reply.authorId === user?.id && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                              onClick={() => handleEditReply(reply)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              </svg>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => openDeleteDialog(reply.id, 'reply')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                <line x1="10" x2="10" y1="11" y2="17"/>
                                <line x1="14" x2="14" y1="11" y2="17"/>
                              </svg>
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          variant={likedReplies.includes(reply.id) ? "default" : "ghost"}
                          size="sm" 
                          className={cn(
                            "h-6 min-w-0 px-1",
                            likedReplies.includes(reply.id) && "bg-red-500 hover:bg-red-600"
                          )}
                          onClick={() => handleLikeReply(reply.id)}
                        >
                          <Heart className={cn(
                            "h-3.5 w-3.5",
                            likedReplies.includes(reply.id) && "fill-white"
                          )} />
                          <span className="text-xs ml-1">{reply.likes}</span>
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm mt-1 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">No replies yet</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="flex flex-col border-t bg-accent/10 p-4">
          {editReplyId ? (
            <div className="w-full space-y-2">
              <Textarea
                ref={replyInputRef}
                value={editReplyContent}
                onChange={(e) => setEditReplyContent(e.target.value)}
                placeholder="Edit your reply..."
                className="min-h-[100px] resize-none"
              />
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditReplyId(null);
                    setEditReplyContent("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!editReplyContent.trim()}
                  onClick={handleSaveEditedReply}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[100px] resize-none"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(isAnonymous && "bg-accent")}
                    onClick={() => setIsAnonymous(!isAnonymous)}
                  >
                    Post anonymously
                    {isAnonymous && <BadgeCheck className="ml-1 h-3.5 w-3.5" />}
                  </Button>
                </div>
                
                <Button
                  disabled={!replyContent.trim() || isSubmitting}
                  onClick={handleSubmitReply}
                  className="gap-1"
                >
                  <Send className="h-4 w-4" />
                  Reply
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report {itemToReport?.type}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to report this {itemToReport?.type} for violating community guidelines?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReport}>
              Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
