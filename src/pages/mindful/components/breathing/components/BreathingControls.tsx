
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onBell?: () => void;
  color?: string;
}

export default function BreathingControls({
  isPlaying,
  onPlayPause,
  onReset,
  onBell,
  color = "blue"
}: BreathingControlsProps) {
  return (
    <div className="flex gap-3 justify-center mt-4">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onPlayPause} 
        className={cn(
          "rounded-full", 
          !isPlaying && color === "blue" && "border-blue-500 text-blue-500", 
          !isPlaying && color === "purple" && "border-purple-500 text-purple-500", 
          !isPlaying && color === "green" && "border-green-500 text-green-500",
          !isPlaying && color === "orange" && "border-orange-500 text-orange-500"
        )}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onReset} 
        className="rounded-full"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      {onBell && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBell} 
          className="rounded-full"
        >
          <Bell className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
