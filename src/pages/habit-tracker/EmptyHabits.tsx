
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyHabitsProps {
  onAddHabit: () => void;
}

export function EmptyHabits({ onAddHabit }: EmptyHabitsProps) {
  return (
    <div className="card-primary p-5 text-center">
      <p className="text-muted-foreground">No habits added yet.</p>
      <Button 
        onClick={onAddHabit}
        className="button-primary mt-3"
      >
        Add Your First Habit
      </Button>
    </div>
  );
}
