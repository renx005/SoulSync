
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Report } from "@/types/community";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, EyeOff, MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * PRO ONLY: This component loads ONLY real reports from localStorage as a professional.
 * Shows empty state if no pending reports.
 */
export function ProfessionalReportedContent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedReports = localStorage.getItem("soulsync_reported_content");
      if (savedReports) {
        const parsedReports = JSON.parse(savedReports);
        // Convert date strings to Date objects
        const processedReports = parsedReports.map((report: any) => ({
          ...report,
          date: new Date(report.date),
        }));
        setReports(processedReports);
      } else {
        setReports([]);
      }
    } catch (e) {
      setReports([]);
      setError("Error loading reported content.");
      console.error(e);
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleDismiss = (id: string) => {
    try {
      const updatedReports = reports.map(r =>
        r.id === id ? { ...r, status: "reviewed" as "reviewed" } : r
      );
      setReports(updatedReports);
      localStorage.setItem("soulsync_reported_content", JSON.stringify(updatedReports));
      toast({
        title: "Report dismissed",
        description: "The report has been marked as reviewed",
      });
    } catch (e) {
      setError("Failed to dismiss report.");
    }
  };

  const openDeleteDialog = (id: string) => {
    setSelectedReportId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedReportId) {
      try {
        const report = reports.find(r => r.id === selectedReportId);

        if (report) {
          const updatedReports = reports.map(r =>
            r.id === selectedReportId ? { ...r, status: "resolved" as "resolved" } : r
          );
          setReports(updatedReports);
          localStorage.setItem("soulsync_reported_content", JSON.stringify(updatedReports));
          // Hide content (simulate)
          // You can implement content removal here (posts/replies)
          toast({
            title: "Content hidden",
            description: "The reported content has been hidden from users",
          });
        }
        setIsDeleteDialogOpen(false);
      } catch (e) {
        setError("Failed to hide content.");
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const pendingReports = reports.filter(r => r.status === "pending");

  if (loading) {
    return (
      <Card className="bg-card border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Reported Content
          </CardTitle>
          <CardDescription>Review and moderate reported content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Error
          </CardTitle>
          <CardDescription>Could not load reported content.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (pendingReports.length === 0) {
    return (
      <Card className="bg-card border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Reported Content
          </CardTitle>
          <CardDescription>Review and moderate reported content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground">No reported content to review</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Reported Content ({pendingReports.length})
          </CardTitle>
          <CardDescription>Review and moderate reported content</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[450px]">
            <div className="space-y-4 pr-4">
              {pendingReports.map((report) => (
                <div key={report.id} className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-background/50 border-b">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <h3 className="font-medium text-sm">
                        {report.contentType === "post"
                          ? "Post Reported"
                          : "Reply Reported"}
                      </h3>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(report.date, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="bg-muted/50 p-3 rounded-md text-sm mb-3">
                      <p className="font-medium mb-1 text-xs">Reason for reporting</p>
                      <p>{report.reason}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          navigate(
                            `/professional/community/post/${report.contentId}`
                          )
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-1 md:mr-2" />
                        <span>View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDismiss(report.id)}
                      >
                        <Check className="h-4 w-4 mr-1 md:mr-2" />
                        <span>Dismiss</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => openDeleteDialog(report.id)}
                      >
                        <EyeOff className="h-4 w-4 mr-1 md:mr-2" />
                        <span>Hide</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hide Reported Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to hide this content? It will be removed from public view and reviewed by an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Hide Content
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
