
import { Habit } from "../types";
import { useHabitStorage } from "./useHabitStorage";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export function useHabitOperations() {
  const { toast } = useToast();
  const { user } = useUser();
  const { saveHabits, loadHabits } = useHabitStorage();

  const toggleHabit = (
    id: string, 
    habits: Habit[], 
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
  ) => {
    if (!user) return;
    
    // Update UI state
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const completed = !habit.completed;
        return { 
          ...habit, 
          completed,
          daysCompleted: completed ? habit.daysCompleted + 1 : Math.max(0, habit.daysCompleted - 1)
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    
    // Update localStorage
    const allHabits = loadHabits();
    const habitToUpdate = allHabits.find((h: any) => h.id === id);
    
    if (habitToUpdate) {
      habitToUpdate.completed = !habitToUpdate.completed;
      saveHabits(allHabits);
      
      // Show a toast
      const targetHabit = updatedHabits.find(h => h.id === id);
      if (targetHabit) {
        toast({
          title: targetHabit.completed ? "Habit completed!" : "Habit uncompleted",
          description: targetHabit.completed 
            ? `Great job completing your ${targetHabit.title} habit!`
            : `You've marked ${targetHabit.title} as not completed.`,
        });
      }
    } else {
      // No habits stored yet, create new entry
      const today = new Date().toISOString();
      const habit = habits.find(h => h.id === id);
      
      if (habit) {
        const newHabitEntry = [{
          id,
          name: habit.title,
          date: today,
          completed: habit.completed,
          targetDays: habit.totalDays,
          time: habit.time,
          color: habit.color
        }];
        
        saveHabits(newHabitEntry);
      }
    }
  };

  const addNewHabit = (
    newHabit: { title: string; time: string; color: string },
    habits: Habit[],
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
  ) => {
    if (!user) return;
    if (!newHabit.title || !newHabit.time) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a title and time for your habit.",
      });
      return;
    }
    
    const id = Date.now().toString();
    const today = new Date().toISOString();
    
    // Add to UI state
    const habit: Habit = {
      id,
      title: newHabit.title,
      time: newHabit.time,
      completed: false,
      color: newHabit.color,
      daysCompleted: 0,
      totalDays: 7, // Default to weekly goal
    };
    
    setHabits([...habits, habit]);
    
    // Add to localStorage
    const allHabits = loadHabits();
    
    const newHabitEntry = {
      id,
      name: newHabit.title,
      date: today,
      completed: false,
      targetDays: 7,
      time: newHabit.time,
      color: newHabit.color
    };
    
    saveHabits([...allHabits, newHabitEntry]);
    
    toast({
      title: "Habit created",
      description: `You've added "${habit.title}" to your habits.`,
    });
    
    return habit;
  };
  
  const updateHabit = (
    editingHabit: Habit,
    habits: Habit[],
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
  ) => {
    if (!user) return;
    
    // Update UI state
    setHabits(
      habits.map((habit) => 
        habit.id === editingHabit.id ? editingHabit : habit
      )
    );
    
    // Update in localStorage
    const allHabits = loadHabits();
    
    // Find any entries with this habit name and update them
    const updatedHabits = allHabits.map((habit: any) => {
      if (habit.id === editingHabit.id) {
        return {
          ...habit,
          name: editingHabit.title,
          time: editingHabit.time,
          color: editingHabit.color
        };
      }
      return habit;
    });
    
    saveHabits(updatedHabits);
    
    toast({
      title: "Habit updated",
      description: `Changes to "${editingHabit.title}" have been saved.`,
    });
  };
  
  const deleteHabit = (
    id: string,
    habits: Habit[],
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
  ) => {
    if (!user) return;
    
    // Get the habit title before removing
    const habitToDelete = habits.find(habit => habit.id === id);
    
    // Update UI state
    setHabits(habits.filter(habit => habit.id !== id));
    
    // Update localStorage
    const allHabits = loadHabits();
    
    if (habitToDelete) {
      // Remove habit with this id and also any entries with the same name
      const updatedHabits = allHabits.filter((habit: any) => 
        habit.id !== id && habit.name !== habitToDelete.title
      );
      
      saveHabits(updatedHabits);
    }
    
    toast({
      title: "Habit deleted",
      description: habitToDelete 
        ? `"${habitToDelete.title}" has been removed from your habits.`
        : "The habit has been removed from your list.",
    });
  };

  return {
    toggleHabit,
    addNewHabit,
    updateHabit,
    deleteHabit
  };
}
