
import { useState, useEffect } from "react";
import { MoodEntry, MoodValue } from "./types";
import { useUser } from "@/contexts/UserContext";

export function useMood() {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const { user } = useUser();
  
  // Function to get storage key for the current user
  const getMoodStorageKey = (): string => {
    return user?.id ? `soulsync_moods_${user.id}` : 'soulsync_moods';
  };
  
  // Function to get today's mood from storage
  const getTodaysMood = (): MoodEntry | null => {
    const storageKey = getMoodStorageKey();
    const storedMoods = localStorage.getItem(storageKey);
    if (!storedMoods) return null;
    
    const moods: MoodEntry[] = JSON.parse(storedMoods);
    const today = new Date().toDateString();
    
    return moods.find(mood => new Date(mood.date).toDateString() === today) || null;
  };
  
  // Function to save mood to storage
  const saveMood = (mood: MoodValue, note?: string) => {
    if (!user) return; // Don't save if no user is logged in
    
    const newMoodEntry: MoodEntry = {
      value: mood,
      date: new Date(),
      note: note
    };
    
    const storageKey = getMoodStorageKey();
    const storedMoods = localStorage.getItem(storageKey);
    const moods: MoodEntry[] = storedMoods ? JSON.parse(storedMoods) : [];
    
    // Check if there's already an entry for today
    const todayIndex = moods.findIndex(
      mood => new Date(mood.date).toDateString() === new Date().toDateString()
    );
    
    if (todayIndex >= 0) {
      // Update today's entry
      moods[todayIndex] = newMoodEntry;
    } else {
      // Add new entry
      moods.push(newMoodEntry);
    }
    
    // Save the updated moods
    localStorage.setItem(storageKey, JSON.stringify(moods));
    
    // Also save to the global key for backward compatibility with insights
    localStorage.setItem('soulsync_moods', JSON.stringify(moods));
    
    // Dispatch both a standard storage event and a custom event
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(moods),
      oldValue: storedMoods || null,
      storageArea: localStorage
    }));
    
    // Dispatch a custom event that can be listened for
    window.dispatchEvent(new CustomEvent('soulsync_data_updated'));
  };
  
  // Load today's mood when component mounts or user changes
  useEffect(() => {
    const loadTodaysMood = () => {
      const todaysMood = getTodaysMood();
      if (todaysMood) {
        setSelectedMood(todaysMood.value);
        setMoodNote(todaysMood.note || "");
      } else {
        // Reset mood when no entry is found or user changes
        setSelectedMood(null);
        setMoodNote("");
      }
    };
    
    if (user) {
      loadTodaysMood();
    }
    
    // Also set up listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getMoodStorageKey()) {
        loadTodaysMood();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('soulsync_data_updated', loadTodaysMood);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('soulsync_data_updated', loadTodaysMood);
    };
  }, [user]); // Re-run when user changes

  return {
    selectedMood,
    setSelectedMood,
    moodNote,
    setMoodNote,
    saveMood
  };
}
