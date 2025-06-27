
import React from "react";
import { Check, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Habit } from "./types";

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, onToggle, onEdit, onDelete }: HabitItemProps) {
  return (
    <div 
      className={cn(
        "card-primary p-4 flex items-center transition-all border-l-4",
        habit.completed ? "border-green-400 bg-green-50" : habit.color
      )}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className={cn(
          "w-6 h-6 rounded-full border flex items-center justify-center mr-3 transition-colors",
          habit.completed ? "bg-green-400 border-green-400" : "bg-white border-border"
        )}
      >
        {habit.completed && <Check className="h-4 w-4 text-white" />}
      </button>
      
      <div className="flex-1">
        <h3 className={cn(
          "font-medium transition-all",
          habit.completed ? "line-through text-muted-foreground" : ""
        )}>
          {habit.title}
        </h3>
        <p className="text-xs text-muted-foreground">{habit.time}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onEdit(habit)}
          className="p-2 rounded-full hover:bg-mindscape-light/50 transition-colors"
          aria-label="Edit habit"
        >
          <Edit2 className="h-4 w-4 text-mindscape-primary" />
        </button>
        
        <button 
          onClick={() => onDelete(habit.id)}
          className="p-2 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Delete habit"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}
