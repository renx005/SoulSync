
import { Search, Filter, SortAsc, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface JournalSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterBy: string | null;
  toggleFilter: () => void;
  toggleSort: () => void;
  sortOrder: "asc" | "desc";
  onCalendarView?: () => void;
}

export function JournalSearchBar({ 
  searchQuery, 
  setSearchQuery, 
  filterBy, 
  toggleFilter, 
  toggleSort, 
  sortOrder,
  onCalendarView
}: JournalSearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search journal entries"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 w-full border-mindscape-light focus:border-mindscape-primary text-sm"
        />
      </div>
      
      <button 
        className={`w-10 h-10 rounded-lg ${filterBy ? 'bg-mindscape-primary text-white' : 'border border-input bg-background hover:bg-accent'} flex items-center justify-center`}
        aria-label="Filter"
        onClick={toggleFilter}
      >
        <Filter className="h-4 w-4" />
      </button>
      
      <button 
        className="w-10 h-10 rounded-lg border border-input bg-background hover:bg-accent flex items-center justify-center"
        aria-label="Sort"
        onClick={toggleSort}
      >
        <SortAsc className={`h-4 w-4 transform ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
      </button>
      
      <button 
        className="w-10 h-10 rounded-lg border border-input bg-background hover:bg-accent flex items-center justify-center"
        aria-label="Calendar view"
        onClick={onCalendarView}
      >
        <Calendar className="h-4 w-4" />
      </button>
    </div>
  );
}
