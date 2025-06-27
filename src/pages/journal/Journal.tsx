
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NewJournalForm } from "./components/NewJournalForm";
import { JournalDetails } from "./components/JournalDetails";
import { JournalEntry } from "@/types/journal";
import { useJournalEntries } from "./hooks/useJournalEntries";
import { JournalHeader } from "./components/JournalHeader";
import { JournalSearchBar } from "./components/JournalSearchBar";
import { JournalTabs } from "./components/JournalTabs";

export default function Journal() {
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  
  const {
    filteredEntries,
    searchQuery,
    setSearchQuery,
    filterBy,
    sortOrder,
    addNewEntry,
    toggleFavorite,
    toggleSort,
    toggleFilter,
    deleteEntry
  } = useJournalEntries();
  
  const handleWriteFirstEntry = () => {
    setIsNewJournalOpen(true);
  };
  
  const openJournalDetails = (entry: JournalEntry) => {
    setSelectedJournal(entry);
  };
  
  const closeJournalDetails = () => {
    setSelectedJournal(null);
  };
  
  const handleNewJournalComplete = (entry: JournalEntry) => {
    addNewEntry(entry);
    setIsNewJournalOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <JournalHeader onNewJournal={() => setIsNewJournalOpen(true)} />
      
      <JournalSearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterBy={filterBy}
        toggleFilter={toggleFilter}
        toggleSort={toggleSort}
        sortOrder={sortOrder}
      />
      
      <JournalTabs 
        filteredEntries={filteredEntries}
        onToggleFavorite={toggleFavorite}
        onJournalClick={openJournalDetails}
        onWriteFirstEntry={handleWriteFirstEntry}
      />
      
      <Sheet open={isNewJournalOpen} onOpenChange={setIsNewJournalOpen}>
        <SheetContent side="bottom" className="h-[90%] rounded-t-xl pt-6">
          <SheetHeader>
            <SheetTitle>New Journal Entry</SheetTitle>
          </SheetHeader>
          <NewJournalForm 
            onComplete={handleNewJournalComplete} 
            onCancel={() => setIsNewJournalOpen(false)} 
          />
        </SheetContent>
      </Sheet>
      
      {selectedJournal && (
        <JournalDetails 
          entry={selectedJournal} 
          isOpen={!!selectedJournal} 
          onClose={closeJournalDetails}
          onToggleFavorite={toggleFavorite}
          onDelete={(id) => {
            deleteEntry(id);
            closeJournalDetails();
          }}
        />
      )}
    </div>
  );
}
