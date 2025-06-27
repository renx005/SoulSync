
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmptyState() {
  const navigate = useNavigate();
  
  return (
    <div className="card-primary p-5 text-center rounded-xl shadow-md">
      <p className="text-muted-foreground">No habits scheduled for today.</p>
      <Button 
        className="button-primary mt-3"
        onClick={() => navigate('/habit-tracker')}
      >
        Add a Habit
      </Button>
    </div>
  );
}
