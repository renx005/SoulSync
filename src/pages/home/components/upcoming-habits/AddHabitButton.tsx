
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AddHabitButton() {
  const navigate = useNavigate();
  
  return (
    <Button 
      className="w-full py-3 flex items-center justify-center gap-1 bg-mindscape-light/70 hover:bg-mindscape-light text-mindscape-tertiary rounded-lg transition-colors"
      onClick={() => navigate('/habit-tracker')}
    >
      <Plus className="h-4 w-4" />
      Add New Habit
    </Button>
  );
}
