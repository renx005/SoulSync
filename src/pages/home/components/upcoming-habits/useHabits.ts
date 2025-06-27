
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Habit } from "./types";
import { getHabitColor } from "./utils";
import { useUser } from "@/contexts/UserContext";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { user } = useUser();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) return;
    
    const loadHabits = () => {
      const storageKey = `soulsync_habits_${user.id}`;
      const storedHabits = localStorage.getItem(storageKey);
      
      if (storedHabits) {
        try {
          const allHabits = JSON.parse(storedHabits);
          
          // Group habits by name
          const habitGroups: Record<string, any[]> = {};
          allHabits.forEach((habit: any) => {
            if (!habitGroups[habit.name]) {
              habitGroups[habit.name] = [];
            }
            habitGroups[habit.name].push(habit);
          });
          
          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayString = today.toISOString().split('T')[0];
          
          // Get or create today's habits
          const todaysHabits: Habit[] = [];
          
          Object.entries(habitGroups).forEach(([name, entries]) => {
            // Find today's entry if it exists
            const todayEntry = entries.find((entry) => {
              const entryDate = new Date(entry.date);
              entryDate.setHours(0, 0, 0, 0);
              return entryDate.toISOString().split('T')[0] === todayString;
            });
            
            // If today's entry exists, use it; otherwise create a placeholder
            if (todayEntry) {
              todaysHabits.push({
                id: todayEntry.id,
                name: todayEntry.name,
                time: todayEntry.time || '9:00 AM',
                completed: todayEntry.completed,
                color: getHabitColor(todayEntry.name, todayEntry.color),
                date: todayEntry.date,
                targetDays: todayEntry.targetDays || 7
              });
            } else {
              // If we have any entries for this habit at all, create a today entry
              const latestEntry = entries[entries.length - 1];
              if (latestEntry) {
                // Generate a time based on habit name or use previous time
                let time = latestEntry.time || '';
                if (!time) {
                  if (name.toLowerCase().includes('morning') || name.toLowerCase().includes('wake')) {
                    time = '8:00 AM';
                  } else if (name.toLowerCase().includes('evening') || name.toLowerCase().includes('night')) {
                    time = '7:00 PM';
                  } else if (name.toLowerCase().includes('lunch') || name.toLowerCase().includes('noon')) {
                    time = '12:00 PM';
                  } else {
                    const hour = Math.floor(Math.random() * 12) + 8;
                    time = `${hour > 12 ? hour - 12 : hour}:${Math.random() > 0.5 ? '00' : '30'} ${hour >= 12 ? 'PM' : 'AM'}`;
                  }
                }
                
                const newId = `${name}-${Date.now()}`;
                todaysHabits.push({
                  id: newId,
                  name,
                  time,
                  completed: false,
                  color: getHabitColor(name, latestEntry.color),
                  date: new Date().toISOString(),
                  targetDays: latestEntry.targetDays || 7
                });
              }
            }
          });
          
          setHabits(todaysHabits);
        } catch (error) {
          console.error("Failed to parse habits:", error);
          setHabits([]);
        }
      }
    };
    
    loadHabits();
    
    // Listen for storage events to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `soulsync_habits_${user.id}`) {
        loadHabits();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);
  
  const toggleHabit = (id: string) => {
    if (!user) return;
    
    // First update the UI
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    
    // Then update localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    if (storedHabits) {
      try {
        const allHabits = JSON.parse(storedHabits);
        const habitToUpdate = allHabits.find((h: any) => h.id === id);
        
        if (habitToUpdate) {
          // Update the existing habit
          habitToUpdate.completed = !habitToUpdate.completed;
          localStorage.setItem(storageKey, JSON.stringify(allHabits));
        } else {
          // This is a newly created habit (for today)
          const newHabit = habits.find(h => h.id === id);
          if (newHabit) {
            const newHabitEntry = {
              id,
              name: newHabit.name,
              date: newHabit.date,
              completed: !newHabit.completed,
              targetDays: newHabit.targetDays,
              time: newHabit.time,
              color: newHabit.color
            };
            
            localStorage.setItem(storageKey, JSON.stringify([...allHabits, newHabitEntry]));
          }
        }
        
        // Dispatch a storage event for other components
        const event = new StorageEvent('storage', {
          key: storageKey,
          newValue: localStorage.getItem(storageKey),
          oldValue: storedHabits,
          storageArea: localStorage
        });
        window.dispatchEvent(event);
        
        // Show a toast
        const targetHabit = updatedHabits.find(h => h.id === id);
        if (targetHabit) {
          toast({
            title: targetHabit.completed ? "Habit completed!" : "Habit uncompleted",
            description: targetHabit.completed 
              ? `Great job completing your ${targetHabit.name} habit!`
              : `You've marked ${targetHabit.name} as not completed.`,
          });
        }
      } catch (error) {
        console.error("Failed to update habits:", error);
      }
    } else {
      // No habits stored yet, create new
      const habitToSave = habits.find(h => h.id === id);
      if (habitToSave) {
        const newHabitEntry = [{
          id,
          name: habitToSave.name,
          date: habitToSave.date,
          completed: !habitToSave.completed,
          targetDays: habitToSave.targetDays,
          time: habitToSave.time,
          color: habitToSave.color
        }];
        
        localStorage.setItem(storageKey, JSON.stringify(newHabitEntry));
        
        // Dispatch storage event
        const event = new StorageEvent('storage', {
          key: storageKey,
          newValue: JSON.stringify(newHabitEntry),
          oldValue: null,
          storageArea: localStorage
        });
        window.dispatchEvent(event);
      }
    }
  };

  return { habits, toggleHabit };
}
