import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumCategory } from "@/types/community";
import { AdminForumCategoryList } from "./components/AdminForumCategoryList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddCategoryDialog } from "./components/AddCategoryDialog";

export default function AdminCommunity() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    const defaultCategories = [
      {
        id: "anxiety",
        name: "Anxiety Support",
        description: "Discuss anxiety management techniques and share experiences",
        icon: "heart",
        posts: 0,
        color: "bg-blue-100"
      },
      {
        id: "depression",
        name: "Depression",
        description: "A safe space to talk about depression and coping strategies",
        icon: "brain",
        posts: 0,
        color: "bg-purple-100"
      },
      {
        id: "mindfulness",
        name: "Mindfulness",
        description: "Share mindfulness practices and meditation techniques",
        icon: "flame",
        posts: 0,
        color: "bg-green-100"
      },
      {
        id: "stress",
        name: "Stress Management",
        description: "Tips and discussions about managing stress in daily life",
        icon: "book",
        posts: 0,
        color: "bg-orange-100"
      },
      {
        id: "general",
        name: "General Discussions",
        description: "Open discussions about mental wellness and self-care",
        icon: "globe",
        posts: 0,
        color: "bg-gray-100"
      }
    ];

    const savedCategories = localStorage.getItem('soulsync_forum_categories');
    let loadedCategories = defaultCategories;
    
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
          loadedCategories = parsedCategories;
        }
      } catch (error) {
        console.error('Failed to parse categories:', error);
      }
    } else {
      localStorage.setItem('soulsync_forum_categories', JSON.stringify(defaultCategories));
    }

    const updatedCategories = [...loadedCategories];
    let needsUpdate = false;
    
    for (const category of updatedCategories) {
      const savedPosts = localStorage.getItem(`soulsync_posts_${category.id}`);
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        if (posts.length !== category.posts) {
          category.posts = posts.length;
          needsUpdate = true;
        }
      }
    }
    
    if (needsUpdate) {
      localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
    }
    
    setCategories(updatedCategories);
  }, []);

  const handleAddCategory = () => {
    setAddDialogOpen(true);
  };

  const handleCategoryAdded = (category) => {
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
  };

  const handleDeleteAllPosts = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) return;
    
    localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify([]));
    
    const updatedCategories = categories.map(c => 
      c.id === categoryId ? {...c, posts: 0} : c
    );
    
    setCategories(updatedCategories);
    localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
    
    toast({
      title: "All Posts Deleted",
      description: `All posts in ${category.name} have been deleted.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Management</h1>
        <p className="text-muted-foreground py-0 my-[4px]">Manage forum categories and content.</p>
      </div>
      
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className={cn("data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black")} value="categories">Categories</TabsTrigger>
          <TabsTrigger className={cn("data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black")} value="content">Content Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="mt-4 pb-16">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleAddCategory}
              className="flex items-center gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Forum Categories</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4">
              {categories.length > 0 ? (
                <AdminForumCategoryList 
                  categories={categories} 
                  onDeletePosts={handleDeleteAllPosts}
                />
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No categories found. Add one to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <AddCategoryDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onCategoryAdded={handleCategoryAdded}
            existingCategories={categories}
          />
        </TabsContent>
        
        <TabsContent value="content" className="mt-4 pb-16">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Global Content Moderation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use these controls to manage all content across the community. Exercise caution as these actions cannot be undone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <span className="text-xs text-muted-foreground">{category.posts} posts</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 flex items-center gap-1"
                        onClick={() => toast({
                          title: "Feature Coming Soon",
                          description: "Content editing will be available in the next update.",
                        })}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex-1 flex items-center gap-1"
                        onClick={() => handleDeleteAllPosts(category.id)}
                      >
                        <Trash className="h-3.5 w-3.5" />
                        Delete All
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
