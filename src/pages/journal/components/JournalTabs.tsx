
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentJournals } from "./RecentJournals";
import { JournalEntry } from "@/types/journal";

interface JournalTabsProps {
  filteredEntries: JournalEntry[];
  onToggleFavorite: (entryId: string) => void;
  onJournalClick: (entry: JournalEntry) => void;
  onWriteFirstEntry: () => void;
}

export function JournalTabs({ 
  filteredEntries, 
  onToggleFavorite, 
  onJournalClick, 
  onWriteFirstEntry 
}: JournalTabsProps) {
  return (
    <Tabs defaultValue="recent" className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
        <TabsTrigger value="all">All Entries</TabsTrigger>
      </TabsList>
      
      <TabsContent value="recent" className="mt-4">
        <RecentJournals 
          entries={filteredEntries.slice(0, 10)} 
          onToggleFavorite={onToggleFavorite}
          onJournalClick={onJournalClick}
          onWriteFirstEntry={onWriteFirstEntry}
        />
      </TabsContent>
      
      <TabsContent value="favorites" className="mt-4">
        <RecentJournals 
          entries={filteredEntries.filter(entry => entry.favorite)} 
          onToggleFavorite={onToggleFavorite}
          onJournalClick={onJournalClick}
          emptyMessage="No favorite entries yet. Star an entry to add it to favorites."
          onWriteFirstEntry={onWriteFirstEntry}
        />
      </TabsContent>
      
      <TabsContent value="all" className="mt-4">
        <RecentJournals 
          entries={filteredEntries} 
          showDateGroups={true}
          onToggleFavorite={onToggleFavorite}
          onJournalClick={onJournalClick}
          onWriteFirstEntry={onWriteFirstEntry}
        />
      </TabsContent>
    </Tabs>
  );
}
