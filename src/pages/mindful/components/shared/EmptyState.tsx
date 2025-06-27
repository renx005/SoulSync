
import React from "react";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  onClearFilters: () => void;
  icon: React.ReactNode;
  message?: string;
  color?: string;
}

export default function EmptyState({ 
  onClearFilters, 
  icon, 
  color = "primary",
  message = "No exercises match your filters" 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-36 text-muted-foreground py-8 px-4 rounded-lg border border-border/30 bg-background/50">
      <div className={cn(
        "mb-3 p-2 rounded-full",
        color === "blue" && "bg-blue-100/30 text-blue-500",
        color === "purple" && "bg-purple-100/30 text-purple-500",
        color === "green" && "bg-green-100/30 text-green-500",
        color === "primary" && "bg-mindscape-light/40 text-mindscape-primary"
      )}>
        {icon}
      </div>
      <p className="text-sm text-center">{message}</p>
      <button 
        className="text-mindscape-primary underline mt-2 flex items-center gap-1.5 text-xs"
        onClick={onClearFilters}
        aria-label="Clear all filters"
      >
        <XCircle className="h-3.5 w-3.5" />
        Clear all filters
      </button>
    </div>
  );
}
