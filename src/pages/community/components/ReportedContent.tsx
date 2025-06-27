
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Report } from "@/types/community";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
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

export function ReportedContent() {
  const { toast } = useToast();
  const { user } = useUser();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  // Load reported content from localStorage
  useEffect(() => {
    const savedReports = localStorage.getItem('soulsync_reported_content');
    if (savedReports) {
      try {
        const parsedReports = JSON.parse(savedReports);
        // Convert date strings to Date objects
        const processedReports = parsedReports.map((report: any) => ({
          ...report,
          date: new Date(report.date)
        }));
        setReports(processedReports);
      } catch (error) {
        console.error('Failed to parse reported content:', error);
        setReports([]);
      }
    } else {
      setReports([]);
      localStorage.setItem('soulsync_reported_content', JSON.stringify([]));
    }
  }, []);

  const handleDismiss = (id: string) => {
    const updatedReports = reports.map(r => 
      r.id === id ? {...r, status: 'reviewed' as 'reviewed'} : r
    );
    setReports(updatedReports);
    localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
    
    toast({
      title: "Report dismissed",
      description: "The report has been marked as reviewed",
    });
  };

  const openDeleteDialog = (id: string) => {
    setSelectedReportId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedReportId) {
      // Find the report
      const report = reports.find(r => r.id === selectedReportId);
      
      if (report) {
        // Update report status
        const updatedReports = reports.map(r => 
          r.id === selectedReportId ? {...r, status: 'resolved' as 'resolved'} : r
        );
        setReports(updatedReports);
        localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
        
        // Delete the content
        if (report.contentType === 'post') {
          const postsStorageKey = `soulsync_posts_${report.categoryId}`;
          const savedPosts = localStorage.getItem(postsStorageKey);
          if (savedPosts) {
            const posts = JSON.parse(savedPosts);
            const updatedPosts = posts.filter((post: any) => post.id !== report.contentId);
            localStorage.setItem(postsStorageKey, JSON.stringify(updatedPosts));
            
            // Update category post count
            const savedCategories = localStorage.getItem('soulsync_forum_categories');
            if (savedCategories) {
              const categories = JSON.parse(savedCategories);
              const updatedCategories = categories.map((c: any) => 
                c.id === report.categoryId ? {...c, posts: updatedPosts.length} : c
              );
              localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
            }
          }
        } else if (report.contentType === 'reply') {
          const repliesStorageKey = `soulsync_replies_${report.postId}`;
          const savedReplies = localStorage.getItem(repliesStorageKey);
          if (savedReplies) {
            const replies = JSON.parse(savedReplies);
            const updatedReplies = replies.filter((reply: any) => reply.id !== report.contentId);
            localStorage.setItem(repliesStorageKey, JSON.stringify(updatedReplies));
            
            // Update post reply count
            const postCategoryId = report.categoryId;
            if (postCategoryId) {
              const postsStorageKey = `soulsync_posts_${postCategoryId}`;
              const savedPosts = localStorage.getItem(postsStorageKey);
              if (savedPosts) {
                const posts = JSON.parse(savedPosts);
                const updatedPosts = posts.map((post: any) => 
                  post.id === report.postId ? {...post, replies: updatedReplies.length} : post
                );
                localStorage.setItem(postsStorageKey, JSON.stringify(updatedPosts));
              }
            }
          }
        }
        
        toast({
          title: "Content removed",
          description: "The reported content has been deleted",
        });
      }
      
      setIsDeleteDialogOpen(false);
    }
  };

  // Only show pending reports relevant to the current user
  const pendingReports = reports.filter(r => r.status === 'pending');

  if (pendingReports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reported Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No reported content</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reported Content ({pendingReports.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingReports.map((report) => (
            <div key={report.id} className="card-primary p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {report.contentType === 'post' ? 'Post Reported' : 'Reply Reported'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Reported {formatDistanceToNow(report.date, { addSuffix: true })}
                  </p>
                </div>
                <div className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  {report.status}
                </div>
              </div>

              <div className="bg-accent/50 p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Reason for reporting</p>
                <p>{report.reason}</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDismiss(report.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Dismiss
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => openDeleteDialog(report.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete Content
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
