
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalVerification } from "@/types/community";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function PendingVerifications() {
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<ProfessionalVerification[]>([
    {
      id: "1",
      userId: "prof1",
      name: "Dr. Sarah Johnson",
      occupation: "Psychologist",
      documentUrl: "/placeholder.svg",
      status: "pending",
      submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      userId: "prof2",
      name: "Thomas Wilson",
      occupation: "Mental Health Counselor",
      documentUrl: "/placeholder.svg",
      status: "pending",
      submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    }
  ]);

  const handleApprove = (id: string) => {
    setVerifications(prev => 
      prev.map(v => v.id === id ? {...v, status: 'approved', reviewedDate: new Date()} : v)
    );
    toast({
      title: "Professional approved",
      description: "The professional has been verified and can now participate in the community",
    });
  };

  const handleReject = (id: string) => {
    setVerifications(prev => 
      prev.map(v => v.id === id ? {...v, status: 'rejected', reviewedDate: new Date()} : v)
    );
    toast({
      title: "Professional rejected",
      description: "The verification request has been rejected",
    });
  };

  const pendingVerifications = verifications.filter(v => v.status === 'pending');

  if (pendingVerifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No pending verifications</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pending Verifications ({pendingVerifications.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingVerifications.map((verification) => (
          <div key={verification.id} className="card-primary p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{verification.name}</h3>
                <p className="text-sm text-muted-foreground">{verification.occupation}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Submitted {formatDistanceToNow(verification.submittedDate, { addSuffix: true })}
              </p>
            </div>

            <div className="bg-accent/50 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Verification Document</p>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <a href={verification.documentUrl} target="_blank" rel="noopener noreferrer" className="text-mindscape-primary hover:underline">
                  View Document
                </a>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleReject(verification.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => handleApprove(verification.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
