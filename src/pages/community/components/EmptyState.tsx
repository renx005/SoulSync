
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No content yet</h3>
      <p className="text-muted-foreground max-w-xs mx-auto mt-2">
        Be the first to start a conversation in our community
      </p>
      <Button className="mt-6">Create Post</Button>
    </div>
  );
}
