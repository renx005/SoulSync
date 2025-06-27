
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FilePlus, Filter } from "lucide-react";
import { ForumPost } from "@/types/community";
import { AdminPostItem } from "./components/AdminPostItem";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminCategoryPosts() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!categoryId) return;
    
    // Load category info
    const savedCategories = localStorage.getItem('soulsync_forum_categories');
    if (savedCategories) {
      const categories = JSON.parse(savedCategories);
      const category = categories.find((c: any) => c.id === categoryId);
      if (category) {
        setCategoryName(category.name);
      }
    }
    
    // Load posts for this category
    const savedPosts = localStorage.getItem(`soulsync_posts_${categoryId}`);
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        // Convert date strings to Date objects
        const processedPosts = parsedPosts.map((post: any) => ({
          ...post,
          date: new Date(post.date)
        }));
        // Sort by date (newest first)
        processedPosts.sort((a: ForumPost, b: ForumPost) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPosts(processedPosts);
      } catch (error) {
        console.error('Failed to parse posts:', error);
        setPosts([]);
      }
    } else {
      setPosts([]);
    }
  }, [categoryId]);

  const handleDeletePost = (postId: string) => {
    try {
      // Update posts state
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      
      // Update localStorage
      if (categoryId) {
        localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify(updatedPosts));
        
        // Update category post count
        const savedCategories = localStorage.getItem('soulsync_forum_categories');
        if (savedCategories) {
          const categories = JSON.parse(savedCategories);
          const updatedCategories = categories.map((c: any) => 
            c.id === categoryId ? {...c, posts: updatedPosts.length} : c
          );
          localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
        }
      }
      
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Link 
            to="/admin/community" 
            className="inline-flex items-center text-sm px-4 py-2 rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to categories
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{categoryName}</h1>
          <p className="text-muted-foreground">{posts.length} posts in this category</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            {posts.length > 0 ? (
              <div className="divide-y">
                {posts.map((post) => (
                  <AdminPostItem 
                    key={post.id} 
                    post={post} 
                    onDelete={() => handleDeletePost(post.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FilePlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No posts yet</h3>
                <p className="text-muted-foreground max-w-md">
                  There are no posts in this category yet. Users can create posts to start discussions.
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
