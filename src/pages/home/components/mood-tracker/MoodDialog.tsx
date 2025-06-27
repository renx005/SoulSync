
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mood } from "./types";

interface MoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMood: Mood | null;
  moodNote: string;
  onMoodNoteChange: (note: string) => void;
  onSave: () => void;
}

export function MoodDialog({
  open,
  onOpenChange,
  currentMood,
  moodNote,
  onMoodNoteChange,
  onSave
}: MoodDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How are you feeling?</DialogTitle>
          <DialogDescription>
            Add more details about your mood
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {currentMood && (
            <div className="flex flex-col items-center justify-center mb-4">
              <div className={cn("h-16 w-16 rounded-full flex items-center justify-center", currentMood.bgColor)}>
                <div className={currentMood.color}>
                  {currentMood.icon}
                </div>
              </div>
              <h3 className="text-lg font-medium mt-2">{currentMood.label}</h3>
            </div>
          )}
          
          <Textarea
            placeholder="What's making you feel this way? (optional)"
            value={moodNote}
            onChange={(e) => onMoodNoteChange(e.target.value)}
            className="min-h-[100px] mt-2"
          />
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className="button-primary"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
