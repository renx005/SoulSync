
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MoodButton } from "./MoodButton";
import { MoodDialog } from "./MoodDialog";
import { moods } from "./mood-data";
import { useMood } from "./use-mood";
import { Mood } from "./types";

export function MoodTracker() {
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const { toast } = useToast();
  const { selectedMood, setSelectedMood, moodNote, setMoodNote, saveMood } = useMood();
  
  const handleMoodClick = (mood: Mood) => {
    setCurrentMood(mood);
    setMoodDialogOpen(true);
  };
  
  const handleSaveMoodDetails = () => {
    if (!currentMood) return;
    
    setSelectedMood(currentMood.value);
    saveMood(currentMood.value, moodNote);
    
    setMoodDialogOpen(false);
    
    toast({
      title: "Mood logged",
      description: `You're feeling ${currentMood.label.toLowerCase()} today.`,
    });
  };
  
  return (
    <>
      <div className="card-highlight p-5 md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">How are you feeling?</h2>
          <p className="text-sm text-muted-foreground">Track your mood daily</p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {moods.map((mood) => (
            <MoodButton
              key={mood.value}
              mood={mood}
              isSelected={selectedMood === mood.value}
              onClick={() => handleMoodClick(mood)}
            />
          ))}
        </div>
      </div>
      
      <MoodDialog
        open={moodDialogOpen}
        onOpenChange={setMoodDialogOpen}
        currentMood={currentMood}
        moodNote={moodNote}
        onMoodNoteChange={setMoodNote}
        onSave={handleSaveMoodDetails}
      />
    </>
  );
}
