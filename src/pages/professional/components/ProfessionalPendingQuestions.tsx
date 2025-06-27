
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, MessageCircle, HelpCircle, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PendingQuestion {
  id: string;
  userId: string;
  username: string;
  categoryId: string;
  categoryName: string;
  content: string;
  date: Date;
}

export function ProfessionalPendingQuestions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([]);
  const [responses, setResponses] = useState<{[key: string]: string}>({});
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching questions
    setTimeout(() => {
      setPendingQuestions([
        {
          id: "q1",
          userId: "user123",
          username: "Sarah J.",
          categoryId: "anxiety",
          categoryName: "Anxiety Support",
          content: "I've been having panic attacks at night that prevent me from sleeping. I've tried deep breathing but it's not helping. What other techniques can I try that might be more effective for nighttime anxiety?",
          date: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
        {
          id: "q2",
          userId: "user456",
          username: "Michael T.",
          categoryId: "depression",
          categoryName: "Depression",
          content: "Since losing my job last month, I've been feeling really down and unmotivated. I know I need to look for work but can't find the energy. How can I break this cycle when everything feels so overwhelming?",
          date: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
        {
          id: "q3",
          userId: "user789",
          username: "Emma L.",
          categoryId: "stress",
          categoryName: "Stress Management",
          content: "I'm experiencing severe burnout at work but can't take time off right now due to financial reasons. Are there any techniques that can help me manage stress while continuing to work?",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses({...responses, [questionId]: value});
  };

  const handleSendResponse = (questionId: string) => {
    if (!responses[questionId]?.trim()) {
      toast({
        variant: "destructive",
        title: "Response required",
        description: "Please enter a response before submitting",
      });
      return;
    }
    
    // In a real app, this would send the response to the backend
    setPendingQuestions(prev => prev.filter(q => q.id !== questionId));
    
    toast({
      title: "Response sent",
      description: "Your professional response has been sent to the user",
    });
  };

  const toggleExpand = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  if (loading) {
    return (
      <Card className="bg-card border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Pending Questions
          </CardTitle>
          <CardDescription>Questions from users awaiting your professional response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingQuestions.length === 0) {
    return (
      <Card className="bg-card border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Pending Questions
          </CardTitle>
          <CardDescription>Questions from users awaiting your professional response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground">No pending questions to answer</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Pending Questions ({pendingQuestions.length})
        </CardTitle>
        <CardDescription>Questions from users awaiting your professional response</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[450px]">
          <div className="space-y-4 pr-4">
            {pendingQuestions.map((question) => (
              <div key={question.id} className="border rounded-lg overflow-hidden">
                <div className="p-3 bg-background/50 border-b">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{question.username}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(question.date, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {question.categoryName}
                    </span>
                  </div>
                  
                  <p className={cn(
                    "text-sm mb-3",
                    expandedQuestion === question.id ? "" : "line-clamp-3"
                  )}>
                    {question.content}
                  </p>
                  
                  {question.content.length > 120 && expandedQuestion !== question.id && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="px-0 h-auto text-primary"
                      onClick={() => toggleExpand(question.id)}
                    >
                      Read more
                    </Button>
                  )}
                  
                  {expandedQuestion === question.id && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="px-0 h-auto text-primary mb-3"
                      onClick={() => toggleExpand(question.id)}
                    >
                      Show less
                    </Button>
                  )}
                  
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Type your professional response here..."
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="min-h-[100px]"
                    />
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleSendResponse(question.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
