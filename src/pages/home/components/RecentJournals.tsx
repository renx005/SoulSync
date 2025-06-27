
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Smile, ThumbsUp, Meh, Frown, Angry, PenSquare } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function RecentJournals() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) return;
    
    const loadJournals = () => {
      const storageKey = `soulsync_journal_${user.id}`;
      const storedEntries = localStorage.getItem(storageKey);
      
      if (storedEntries) {
        try {
          const allEntries = JSON.parse(storedEntries);
          // Sort by date (newest first) and take just the first 2
          const recentEntries = [...allEntries]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 2);
          
          setJournalEntries(recentEntries);
        } catch (error) {
          console.error("Failed to parse journal entries:", error);
          setJournalEntries([]);
        }
      }
    };
    
    loadJournals();
    
    // Listen for storage events to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `soulsync_journal_${user.id}`) {
        loadJournals();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);
  
  // Function to get mood icon
  const getMoodIcon = (mood: string | undefined) => {
    if (!mood) return null;
    
    switch(mood.toLowerCase()) {
      case 'amazing':
        return <Smile className="h-3.5 w-3.5 text-green-500" />;
      case 'good':
        return <ThumbsUp className="h-3.5 w-3.5 text-blue-500" />;
      case 'okay':
        return <Meh className="h-3.5 w-3.5 text-blue-300" />;
      case 'sad':
        return <Frown className="h-3.5 w-3.5 text-orange-500" />;
      case 'awful':
        return <Angry className="h-3.5 w-3.5 text-red-500" />;
      default:
        return null;
    }
  };
  
  if (journalEntries.length === 0) {
    return (
      <div className="card-primary p-5 text-center rounded-xl shadow-sm border border-mindscape-light/30 bg-white">
        <p className="text-muted-foreground">You haven't created any journal entries yet.</p>
        <Button 
          className="button-primary mt-3"
          onClick={() => navigate('/journal')}
        >
          Write First Entry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {journalEntries.map((entry) => (
        <a 
          key={entry.id}
          href={`/journal/${entry.id}`}
          className="card-primary block p-4 hover:shadow-md transition-all rounded-xl border border-mindscape-light/30 bg-white"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-mindscape-primary">{entry.title}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {entry.content}
          </p>
          
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-mindscape-primary font-medium">
              {entry.mood ? (
                <>
                  {getMoodIcon(entry.mood)}
                  <span className="capitalize">{entry.mood}</span>
                </>
              ) : (
                <>
                  <PenSquare className="h-3.5 w-3.5 text-mindscape-primary" />
                  <span>Journal</span>
                </>
              )}
            </span>
            
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                {entry.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="bg-mindscape-light/50 px-2 py-0.5 rounded-full text-[10px]">
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">+{entry.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
