
import { useState, useEffect } from "react";
import { JournalEntry } from "@/types/journal";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Load entries from localStorage
  useEffect(() => {
    if (!user) return;
    
    const storageKey = `soulsync_journal_${user.id}`;
    const storedEntries = localStorage.getItem(storageKey);
    
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        setEntries(parsedEntries);
        setFilteredEntries(parsedEntries);
      } catch (error) {
        console.error("Failed to parse journal entries:", error);
        toast({
          variant: "destructive",
          title: "Error loading entries",
          description: "There was a problem loading your journal entries."
        });
      }
    }
  }, [toast, user]);
  
  // Apply filters, search and sort
  useEffect(() => {
    if (!entries.length) return;
    
    let result = [...entries];
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.title.toLowerCase().includes(lowerQuery) || 
        entry.content.toLowerCase().includes(lowerQuery) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        entry.mood?.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (filterBy) {
      if (filterBy === "withTags") {
        result = result.filter(entry => entry.tags && entry.tags.length > 0);
      } else if (filterBy === "withMood") {
        result = result.filter(entry => entry.mood);
      }
    }
    
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredEntries(result);
  }, [searchQuery, entries, sortOrder, filterBy]);
  
  // Add a new entry
  const addNewEntry = (entry: JournalEntry) => {
    if (!user) return;
    
    const entryWithDate = {
      ...entry,
      date: new Date().toISOString()
    };
    
    const updatedEntries = [entryWithDate, ...entries];
    setEntries(updatedEntries);
    
    const storageKey = `soulsync_journal_${user.id}`;
    const previousValue = localStorage.getItem(storageKey);
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    
    // Dispatch storage event for cross-component updates
    const event = new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(updatedEntries),
      oldValue: previousValue || null,
      storageArea: localStorage
    });
    window.dispatchEvent(event);
    
    toast({
      title: "Journal entry saved",
      description: `"${entry.title}" has been added to your journal.`
    });
  };
  
  // Toggle favorite status
  const toggleFavorite = (entryId: string) => {
    if (!user) return;
    
    const updatedEntries = entries.map(entry => 
      entry.id === entryId 
        ? { ...entry, favorite: !entry.favorite }
        : entry
    );
    
    setEntries(updatedEntries);
    
    const storageKey = `soulsync_journal_${user.id}`;
    const previousValue = localStorage.getItem(storageKey);
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    
    // Dispatch storage event
    const event = new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(updatedEntries),
      oldValue: previousValue || null,
      storageArea: localStorage
    });
    window.dispatchEvent(event);
  };
  
  // Toggle sort order
  const toggleSort = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
    toast({
      title: `Sorted ${sortOrder === "desc" ? "oldest" : "newest"} first`,
      description: "Your journal entries have been reordered."
    });
  };
  
  // Toggle filter
  const toggleFilter = () => {
    const filters = [null, "withTags", "withMood"];
    const currentIndex = filters.indexOf(filterBy);
    const nextFilter = filters[(currentIndex + 1) % filters.length];
    
    setFilterBy(nextFilter);
    
    const filterNames: Record<string, string> = {
      "withTags": "entries with tags",
      "withMood": "entries with mood"
    };
    
    if (nextFilter) {
      toast({
        title: "Filter applied",
        description: `Showing ${filterNames[nextFilter]}.`
      });
    } else {
      toast({
        title: "Filter removed",
        description: "Showing all journal entries."
      });
    }
  };
  
  // Delete an entry
  const deleteEntry = (entryId: string) => {
    if (!user) return;
    
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
    
    const storageKey = `soulsync_journal_${user.id}`;
    const previousValue = localStorage.getItem(storageKey);
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    
    // Dispatch storage event
    const event = new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(updatedEntries),
      oldValue: previousValue || null,
      storageArea: localStorage
    });
    window.dispatchEvent(event);
    
    toast({
      title: "Journal entry deleted",
      description: "Your journal entry has been removed."
    });
  };
  
  return {
    entries,
    filteredEntries,
    searchQuery,
    setSearchQuery,
    sortOrder,
    filterBy,
    addNewEntry,
    toggleFavorite,
    toggleSort,
    toggleFilter,
    deleteEntry
  };
}
