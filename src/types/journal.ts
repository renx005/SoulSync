
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string format
  mood?: string;
  tags?: string[];
  favorite?: boolean;
}
