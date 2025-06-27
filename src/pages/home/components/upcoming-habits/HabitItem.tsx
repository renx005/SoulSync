
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Habit } from "./types";

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

export function HabitItem({ habit, onToggle }: HabitItemProps) {
  return (
    <div 
      className={cn(
        "card-primary p-4 flex items-center transition-all border-l-4 shadow-sm hover:shadow-md",
        habit.completed ? "border-green-400 bg-green-50/80" : habit.color
      )}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className={cn(
          "w-7 h-7 rounded-full border flex items-center justify-center mr-4 transition-colors",
          habit.completed ? "bg-green-400 border-green-400" : "bg-white border-gray-300"
        )}
      >
        {habit.completed ? <Check className="h-4 w-4 text-white" /> : null}
      </button>
      
      <div className="flex-1">
        <h3 className={cn(
          "font-medium transition-all",
          habit.completed ? "line-through text-muted-foreground" : ""
        )}>
          {habit.name}
        </h3>
        {habit.time && (
          <p className="text-xs text-muted-foreground mt-1">{habit.time}</p>
        )}
      </div>
    </div>
  );
}
