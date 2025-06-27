
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumCategory } from "@/types/community";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Bell, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProfessionalForumCategoryList } from "./components/ProfessionalForumCategoryList";
import { ProfessionalReportedContent } from "./components/ProfessionalReportedContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/contexts/UserContext";
import ProfessionalNotificationPanel from "./components/ProfessionalNotificationPanel";

export default function ProfessionalCommunity() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [categories, setCategories] = useState<ForumCategory[]>([
    {
      id: "anxiety",
      name: "Anxiety Support",
      description: "Discuss anxiety management techniques and share experiences",
      icon: "heart",
      posts: 0,
      color: "bg-primary/10"
    },
    {
      id: "depression",
      name: "Depression",
      description: "A safe space to talk about depression and coping strategies",
      icon: "heart",
      posts: 0,
      color: "bg-primary/10"
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      description: "Share mindfulness practices and meditation techniques",
      icon: "heart",
      posts: 0,
      color: "bg-primary/10"
    },
    {
      id: "stress",
      name: "Stress Management",
      description: "Tips and discussions about managing stress in daily life",
      icon: "heart",
      posts: 0,
      color: "bg-primary/10"
    },
    {
      id: "general",
      name: "General Discussions",
      description: "Open discussions about mental wellness and self-care",
      icon: "heart",
      posts: 0,
      color: "bg-primary/10"
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [error, setError] = useState<string | null>(null);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  // Count posts per category from localStorage
  useEffect(() => {
    try {
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
        setFilteredCategories(updatedCategories);
      }
      setTimeout(() => setLoading(false), 500);
    } catch (err) {
      setError("Failed to load forum categories.");
      setLoading(false);
    }
  // eslint-disable-next-line
  }, []);

  // Search handling
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter(category =>
          category.name.toLowerCase().includes(search.toLowerCase()) ||
          category.description.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, categories]);

  // Notification count loading (from localStorage or backend if relevant)
  useEffect(() => {
    try {
      const notifStr = localStorage.getItem("soulsync_professional_notifications");
      if (notifStr) {
        const notifs = JSON.parse(notifStr);
        const unread = notifs.filter((n: any) => !n.read).length;
        setNotifCount(unread);
      } else {
        setNotifCount(0);
      }
    } catch {
      setNotifCount(0); // fallback
    }
  }, [notifPanelOpen]);

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Provide professional support to community members
          </p>
        </div>
        <div className="flex items-center gap-2 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setNotifPanelOpen((b) => !b)}
            aria-label="Show notifications"
          >
            <Bell className="h-5 w-5" />
            {notifCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-red-500 text-white animate-pulse">
                {notifCount}
              </span>
            )}
          </Button>
          {notifPanelOpen && (
            <div className="absolute top-14 right-0 z-20 w-80 max-w-[95vw] drop-shadow-xl">
              <ProfessionalNotificationPanel onClose={() => setNotifPanelOpen(false)} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search discussions..." 
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search categories"
          />
        </div>
        <Button variant="outline" size="icon" aria-label="Filter (not implemented)">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded text-sm">
          {error}
        </div>
      )}

      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forum" className="relative">
            Forum
            <Badge className="ml-1 bg-primary hover:bg-primary/90">{filteredCategories.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reports" className="relative">
            Reports
            <Badge className="ml-1 bg-destructive hover:bg-destructive/90">
              {/* ProfessionalReportedContent handles real count display */}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="mt-4">
          <Card className="bg-card border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Forum Categories
              </CardTitle>
              <CardDescription>
                Browse categories to provide professional support
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : (
                <ProfessionalForumCategoryList categories={filteredCategories} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ProfessionalReportedContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
