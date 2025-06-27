
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Habit } from "./types";
import { useHabitStorage } from "./hooks/useHabitStorage";
import { useHabitOperations } from "./hooks/useHabitOperations";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { user } = useUser();
  const { loadHabits, formatHabitsForDisplay, getStorageKey } = useHabitStorage();
  const { toggleHabit: toggleHabitOperation, addNewHabit: addNewHabitOperation, updateHabit: updateHabitOperation, deleteHabit: deleteHabitOperation } = useHabitOperations();

  // Load habits from localStorage
  useEffect(() => {
    if (!user) return;
    
    const loadHabitsFromStorage = () => {
      const allHabits = loadHabits();
      const formattedHabits = formatHabitsForDisplay(allHabits);
      setHabits(formattedHabits);
    };
    
    loadHabitsFromStorage();
    
    // Listen for storage events to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      const storageKey = getStorageKey();
      if (e.key === storageKey) {
        loadHabitsFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Wrapper functions to simplify calls
  const toggleHabit = (id: string) => toggleHabitOperation(id, habits, setHabits);
  
  const addNewHabit = (newHabit: { title: string; time: string; color: string }) => 
    addNewHabitOperation(newHabit, habits, setHabits);
  
  const updateHabit = (editingHabit: Habit) => 
    updateHabitOperation(editingHabit, habits, setHabits);
  
  const deleteHabit = (id: string) => 
    deleteHabitOperation(id, habits, setHabits);

  return {
    habits,
    toggleHabit,
    addNewHabit,
    updateHabit,
    deleteHabit
  };
}
