
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Habit, colorOptions } from "./types";

interface EditHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingHabit: Habit | null;
  setEditingHabit: (habit: Habit | null) => void;
  onUpdateHabit: (habit: Habit) => void;
}

export function EditHabitDialog({ 
  open, 
  onOpenChange, 
  editingHabit, 
  setEditingHabit, 
  onUpdateHabit 
}: EditHabitDialogProps) {
  const handleUpdateHabit = () => {
    if (editingHabit) {
      onUpdateHabit(editingHabit);
      onOpenChange(false);
    }
  };

  if (!editingHabit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Make changes to your habit
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Habit Name</Label>
            <Input
              id="edit-title"
              value={editingHabit.title}
              onChange={(e) => setEditingHabit({...editingHabit, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-time">Time</Label>
            <Input
              id="edit-time"
              value={editingHabit.time}
              onChange={(e) => setEditingHabit({...editingHabit, time: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <RadioGroup 
              value={editingHabit.color}
              onValueChange={(value) => setEditingHabit({...editingHabit, color: value})}
              className="flex gap-2"
            >
              {colorOptions.map((color) => (
                <div key={color.value} className="flex items-center">
                  <RadioGroupItem
                    value={color.value}
                    id={`edit-color-${color.label}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`edit-color-${color.label}`}
                    className={cn(
                      "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2",
                      color.value.split(' ')[0],
                      editingHabit.color === color.value ? "border-gray-800 ring-2 ring-gray-400" : "border-transparent"
                    )}
                  >
                    {editingHabit.color === color.value && <Check className="h-4 w-4 text-white" />}
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
          <Button onClick={handleUpdateHabit} className="button-primary">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
