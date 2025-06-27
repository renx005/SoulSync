
import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { colorOptions } from "./types";

interface NewHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateHabit: (habit: { title: string; time: string; color: string }) => void;
}

export function NewHabitDialog({ open, onOpenChange, onCreateHabit }: NewHabitDialogProps) {
  const [newHabit, setNewHabit] = useState({
    title: "",
    time: "",
    color: colorOptions[0].value,
  });

  const handleCreateHabit = () => {
    onCreateHabit(newHabit);
    setNewHabit({
      title: "",
      time: "",
      color: colorOptions[0].value,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Add a new habit to track daily
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Habit Name</Label>
            <Input
              id="title"
              placeholder="e.g., Meditation"
              value={newHabit.title}
              onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              placeholder="e.g., 8:00 AM"
              value={newHabit.time}
              onChange={(e) => setNewHabit({...newHabit, time: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <RadioGroup 
              value={newHabit.color}
              onValueChange={(value) => setNewHabit({...newHabit, color: value})}
              className="flex gap-2"
            >
              {colorOptions.map((color) => (
                <div key={color.value} className="flex items-center">
                  <RadioGroupItem
                    value={color.value}
                    id={`color-${color.label}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`color-${color.label}`}
                    className={cn(
                      "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2",
                      color.value.split(' ')[0],
                      newHabit.color === color.value ? "border-gray-800 ring-2 ring-gray-400" : "border-transparent"
                    )}
                  >
                    {newHabit.color === color.value && <Check className="h-4 w-4 text-white" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateHabit} className="button-primary">
            Create Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
