
import { Plus } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";

export function CommunityHeader() {
  const { user } = useUser();
  
  return (
    <header className="flex items-center justify-between mb-4 sm:mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-display">Community</h1>
        <p className="text-sm text-muted-foreground">Connect and share with others</p>
      </div>
      
      <div className="flex items-center">
        <button 
          className="w-9 h-9 rounded-full bg-mindscape-primary text-white flex items-center justify-center shadow-md hover:bg-mindscape-secondary transition-all"
          aria-label="New Post"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
