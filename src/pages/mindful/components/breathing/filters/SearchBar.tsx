
import { Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search exercises..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 w-full h-9 text-sm"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
