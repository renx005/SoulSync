
import { formatDistanceToNow, format, isToday, isYesterday, isSameWeek, isSameMonth } from "date-fns";
import { Heart, Calendar, Tag } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RecentJournalsProps {
  entries: JournalEntry[];
  showDateGroups?: boolean;
  emptyMessage?: string;
  onToggleFavorite: (entryId: string) => void;
  onJournalClick: (entry: JournalEntry) => void;
  onWriteFirstEntry: () => void;
}

export function RecentJournals({ 
  entries, 
  showDateGroups = false,
  emptyMessage = "You haven't created any journal entries yet.",
  onToggleFavorite,
  onJournalClick,
  onWriteFirstEntry
}: RecentJournalsProps) {
  
  if (entries.length === 0) {
    return (
      <div className="card-primary p-5 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
        <button 
          className="button-primary mt-3"
          onClick={onWriteFirstEntry}
        >
          Write First Entry
        </button>
      </div>
    );
  }
  
  // Group entries by date when showDateGroups is true
  if (showDateGroups) {
    const dateGroups: Record<string, JournalEntry[]> = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'This Month': [],
      'Earlier': []
    };
    
    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      
      if (isToday(entryDate)) {
        dateGroups['Today'].push(entry);
      } else if (isYesterday(entryDate)) {
        dateGroups['Yesterday'].push(entry);
      } else if (isSameWeek(entryDate, new Date(), { weekStartsOn: 1 })) {
        dateGroups['This Week'].push(entry);
      } else if (isSameMonth(entryDate, new Date())) {
        dateGroups['This Month'].push(entry);
      } else {
        dateGroups['Earlier'].push(entry);
      }
    });
    
    return (
      <div className="space-y-6">
        {Object.entries(dateGroups).map(([groupName, groupEntries]) => 
          groupEntries.length > 0 && (
            <div key={groupName} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {groupName}
              </h3>
              
              {groupEntries.map(entry => (
                <JournalCard 
                  key={entry.id} 
                  entry={entry} 
                  isFavorite={!!entry.favorite}
                  onToggleFavorite={onToggleFavorite}
                  onClick={() => onJournalClick(entry)}
                />
              ))}
            </div>
          )
        )}
      </div>
    );
  }
  
  // Default view without grouping
  return (
    <div className="space-y-3">
      {entries.map(entry => (
        <JournalCard 
          key={entry.id} 
          entry={entry} 
          isFavorite={!!entry.favorite}
          onToggleFavorite={onToggleFavorite}
          onClick={() => onJournalClick(entry)}
        />
      ))}
    </div>
  );
}

interface JournalCardProps {
  entry: JournalEntry;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
}

function JournalCard({ entry, isFavorite, onToggleFavorite, onClick }: JournalCardProps) {
  const entryDate = new Date(entry.date);
  
  return (
    <div 
      className="card-primary block p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{entry.title}</h3>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();  // Prevent triggering the card click
              onToggleFavorite(entry.id);
            }}
            className="p-1.5 rounded-full hover:bg-mindscape-light/70 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors", 
                isFavorite ? "fill-red-400 text-red-400" : "text-muted-foreground"
              )} 
            />
          </button>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(entryDate, { addSuffix: true })}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        {entry.content}
      </p>
      
      <div className="mt-2 flex items-center gap-3 text-xs">
        {entry.mood && (
          <span className="flex items-center gap-1 text-mindscape-primary font-medium">
            {entry.mood}
          </span>
        )}
        
        {entry.tags && entry.tags.length > 0 && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Tag className="h-3 w-3" />
            {entry.tags.join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}
