
export function processJournalData(storedJournals: string): number | null {
  try {
    const journalEntries = JSON.parse(storedJournals);
    
    // Only calculate if there are journal entries
    if (!journalEntries || journalEntries.length === 0) {
      return null;
    }
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekJournals = journalEntries.filter((entry: any) => 
      new Date(entry.date) >= oneWeekAgo
    );
    
    if (thisWeekJournals.length === 0) {
      return null;
    }
    
    const daysWithJournals = new Set(
      thisWeekJournals.map((entry: any) => new Date(entry.date).toDateString())
    ).size;
    
    // Journal consistency percentage (out of 7 days)
    return Math.round((daysWithJournals / 7) * 100);
  } catch (error) {
    console.error("Error processing journal data:", error);
    return null;
  }
}
