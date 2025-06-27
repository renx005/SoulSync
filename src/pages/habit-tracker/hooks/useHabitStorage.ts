
import { useUser } from "@/contexts/UserContext";
import { Habit } from "../types";

export function useHabitStorage() {
  const { user } = useUser();

  const getStorageKey = () => {
    if (!user) return null;
    return `soulsync_habits_${user.id}`;
  };

  const loadHabits = () => {
    const storageKey = getStorageKey();
    if (!storageKey) return [];
    
    const storedHabits = localStorage.getItem(storageKey);
    if (!storedHabits) return [];
    
    try {
      return JSON.parse(storedHabits);
    } catch (error) {
      console.error("Failed to parse habits:", error);
      return [];
    }
  };

  const saveHabits = (habits: any[]) => {
    const storageKey = getStorageKey();
    if (!storageKey || !user) return;
    
    localStorage.setItem(storageKey, JSON.stringify(habits));
    
    // Dispatch storage event for other components
    const event = new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(habits),
      storageArea: localStorage
    });
    window.dispatchEvent(event);
  };

  const formatHabitsForDisplay = (parsedHabits: any[]): Habit[] => {
    // Group habits by name to calculate completion stats
    const habitGroups: Record<string, any[]> = {};
    parsedHabits.forEach((habit: any) => {
      if (!habitGroups[habit.name]) {
        habitGroups[habit.name] = [];
      }
      habitGroups[habit.name].push(habit);
    });
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    
    // Convert to the format expected by the UI
    return Object.entries(habitGroups).map(([name, entries]) => {
      // Find today's entry if it exists
      const todayEntry = entries.find((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.toISOString().split('T')[0] === todayString;
      });
      
      // Calculate days completed
      const completedEntries = entries.filter(entry => entry.completed);
      
      // Find a color from existing entries or assign default
      const habitColor = entries.find(entry => entry.color)?.color || getColorForHabit(name);
      
      // Get target days from a random entry (they should all have the same target)
      const targetDays = entries[0]?.targetDays || 7;
      
      return {
        id: todayEntry?.id || `${name}-${Date.now()}`,
        title: name,
        time: todayEntry?.time || "9:00 AM",
        completed: todayEntry?.completed || false,
        color: habitColor,
        daysCompleted: completedEntries.length,
        totalDays: targetDays
      };
    });
  };

  return {
    getStorageKey,
    loadHabits,
    saveHabits,
    formatHabitsForDisplay
  };
}

// Helper function moved from utils.ts for self-containment
const getColorForHabit = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("meditation") || lowerName.includes("yoga")) {
    return "bg-mindscape-blue border-blue-300";
  } else if (lowerName.includes("exercise") || lowerName.includes("workout")) {
    return "bg-mindscape-green border-green-300";
  } else if (lowerName.includes("read")) {
    return "bg-mindscape-yellow border-yellow-300";
  } else if (lowerName.includes("journal")) {
    return "bg-mindscape-peach border-orange-300";
  } else {
    return "bg-mindscape-pink border-pink-300";
  }
};
