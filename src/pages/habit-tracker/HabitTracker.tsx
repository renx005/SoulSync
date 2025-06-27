
import { useState } from "react";
import { Plus, Calendar, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useHabits } from "./useHabits";
import { Habit } from "./types";
import { HabitItem } from "./HabitItem";
import { HabitProgress } from "./HabitProgress";
import { EmptyHabits } from "./EmptyHabits";
import { NewHabitDialog } from "./NewHabitDialog";
import { EditHabitDialog } from "./EditHabitDialog";

export default function HabitTracker() {
  const [newHabitDialogOpen, setNewHabitDialogOpen] = useState(false);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { habits, toggleHabit, addNewHabit, updateHabit, deleteHabit } = useHabits();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditHabitDialogOpen(true);
  };
  
  const openCalendarView = () => {
    navigate('/insights');
    toast({
      title: "Calendar View",
      description: "Viewing your habits in the Insights section",
    });
  };
  
  const openStatsView = () => {
    navigate('/insights');
    toast({
      title: "Statistics View",
      description: "Viewing your habit statistics in the Insights section",
    });
  };
  
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Habit Tracker</h1>
          <p className="text-muted-foreground">Build positive routines</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-mindscape-light text-mindscape-primary hover:bg-mindscape-light/80 transition-all"
            aria-label="View calendar"
            onClick={openCalendarView}
          >
            <Calendar className="h-5 w-5" />
          </button>
          
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-mindscape-light text-mindscape-primary hover:bg-mindscape-light/80 transition-all"
            aria-label="View statistics"
            onClick={openStatsView}
          >
            <BarChart className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => setNewHabitDialogOpen(true)}
            className="w-10 h-10 rounded-full bg-mindscape-primary text-white flex items-center justify-center shadow-md hover:bg-mindscape-secondary transition-all"
            aria-label="New habit"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Today's Habits</h2>
        
        {habits.length === 0 ? (
          <EmptyHabits onAddHabit={() => setNewHabitDialogOpen(true)} />
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={toggleHabit}
                onEdit={handleEditHabit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        )}
      </div>
      
      {habits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Streaks & Progress</h2>
          
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitProgress key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      )}
      
      {/* Dialogs */}
      <NewHabitDialog 
        open={newHabitDialogOpen} 
        onOpenChange={setNewHabitDialogOpen} 
        onCreateHabit={addNewHabit} 
      />
      
      <EditHabitDialog 
        open={editHabitDialogOpen}
        onOpenChange={setEditHabitDialogOpen}
        editingHabit={editingHabit}
        setEditingHabit={setEditingHabit}
        onUpdateHabit={updateHabit}
      />
    </div>
  );
}
