
import { Plus } from "lucide-react";

interface JournalHeaderProps {
  onNewJournal: () => void;
}

export function JournalHeader({ onNewJournal }: JournalHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Journal</h1>
        <p className="text-muted-foreground">Track your thoughts and feelings</p>
      </div>
      
      <button 
        onClick={onNewJournal}
        className="w-10 h-10 rounded-full bg-mindscape-primary text-white flex items-center justify-center shadow-md hover:bg-mindscape-secondary transition-all"
        aria-label="New Entry"
      >
        <Plus className="h-5 w-5" />
      </button>
    </header>
  );
}
