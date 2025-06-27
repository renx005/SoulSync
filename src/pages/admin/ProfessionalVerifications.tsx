
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  FileText, 
  ShieldCheck, 
  Mail,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

export default function ProfessionalVerifications() {
  const { toast } = useToast();
  const { pendingProfessionals, verifyProfessional, rejectProfessional } = useUser();
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  if (pendingProfessionals.length === 0) {
    return (
      <div className="space-y-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Professional Verifications</h1>
          <p className="text-muted-foreground">Review and approve professional account requests.</p>
        </div>
        
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Pending Verifications</h3>
              <p className="text-muted-foreground">All professional verification requests have been processed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleViewDocument = (professional: any) => {
    setSelectedProfessional(professional);
    setDocumentDialogOpen(true);
  };

  const handleApprove = (id: string) => {
    verifyProfessional(id);
    toast({
      title: "Professional Approved",
      description: "The professional account has been verified and can now log in.",
    });
  };

  const handleReject = (id: string) => {
    rejectProfessional(id);
    toast({
      title: "Professional Rejected",
      description: "The professional verification request has been rejected.",
    });
  };

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Professional Verifications</h1>
        <p className="text-muted-foreground">Review and approve professional account requests.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Verification Requests ({pendingProfessionals.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="divide-y">
              {pendingProfessionals.map((professional) => (
                <div key={professional.id} className="p-4 hover:bg-muted/30">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-blue-600">{professional.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{professional.username}</h3>
                        <p className="text-sm text-muted-foreground">{professional.occupation}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate">{professional.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      {professional.identityDocument && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDocument(professional)}
                          className="w-full sm:w-auto"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleReject(professional.id)}
                          className="flex-1 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Reject
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleApprove(professional.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verification Document</DialogTitle>
            <DialogDescription>
              Review the document submitted by the professional
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProfessional && (
              <>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm mb-2"><strong>Name:</strong> {selectedProfessional.username}</p>
                  <p className="text-sm mb-2"><strong>Occupation:</strong> {selectedProfessional.occupation}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedProfessional.email}</p>
                </div>
                
                <div className="aspect-video bg-muted flex items-center justify-center rounded-md border">
                  <FileText className="h-16 w-16 text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground absolute">Document Preview</p>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDocumentDialogOpen(false)}
              className="w-full"
            >
              Close
            </Button>
            {selectedProfessional && (
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="text-destructive flex-1"
                  onClick={() => {
                    handleReject(selectedProfessional.id);
                    setDocumentDialogOpen(false);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => {
                    handleApprove(selectedProfessional.id);
                    setDocumentDialogOpen(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
