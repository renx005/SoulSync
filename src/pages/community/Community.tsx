
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumCategory } from "@/types/community";
import { ForumCategoryList } from "./components/ForumCategoryList";
import { EmptyState } from "./components/EmptyState";
import { CommunityHeader } from "./components/CommunityHeader";
import { PendingVerifications } from "./components/PendingVerifications";
import { ReportedContent } from "./components/ReportedContent";

export default function Community() {
  const { user } = useUser();
  const [categories, setCategories] = useState<ForumCategory[]>([
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
  ]);

  // Count posts per category from localStorage
  useEffect(() => {
    const updatedCategories = [...categories];
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
      setCategories(updatedCategories);
    }
  }, []);

  return (
    <div className="space-y-4">
      <CommunityHeader />
      
      {user?.role === "admin" ? (
        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forum">Community Forum</TabsTrigger>
            <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
            <TabsTrigger value="reports">Reported Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forum" className="mt-4 pb-16">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Forum Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4">
                {categories.length > 0 ? (
                  <ForumCategoryList categories={categories} />
                ) : (
                  <EmptyState />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verifications" className="mt-4 pb-16">
            <PendingVerifications />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4 pb-16">
            <ReportedContent />
          </TabsContent>
        </Tabs>
      ) : user?.role === "professional" ? (
        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forum">Community Forum</TabsTrigger>
            <TabsTrigger value="reports">Reported Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forum" className="mt-4 pb-16">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Forum Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4">
                {categories.length > 0 ? (
                  <ForumCategoryList categories={categories} />
                ) : (
                  <EmptyState />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4 pb-16">
            <ReportedContent />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="mb-16">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Forum Categories</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4">
            {categories.length > 0 ? (
              <ForumCategoryList categories={categories} />
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
