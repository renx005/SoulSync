
import { useHabits } from "./useHabits";
import { HabitItem } from "./HabitItem";
import { EmptyState } from "./EmptyState";
import { AddHabitButton } from "./AddHabitButton";

export function UpcomingHabits() {
  const { habits, toggleHabit } = useHabits();
  
  if (habits.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-3 rounded-xl overflow-hidden">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={toggleHabit}
        />
      ))}
      
      <AddHabitButton />
    </div>
  );
}
