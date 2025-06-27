
import { cn } from "@/lib/utils";
import { Mood } from "./types";

interface MoodButtonProps {
  mood: Mood;
  isSelected: boolean;
  onClick: () => void;
}

export function MoodButton({ mood, isSelected, onClick }: MoodButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg transition-all hover:scale-105",
        isSelected ? 
          `${mood.bgColor} border-2 scale-105` : 
          "border border-transparent"
      )}
      aria-label={`Select mood: ${mood.label}`}
    >
      <div className={cn("transition-colors", mood.color, isSelected ? "animate-bounce-soft" : "")}>
        {mood.icon}
      </div>
      <span className="text-xs mt-2 font-medium truncate max-w-full">{mood.label}</span>
    </button>
  );
}
