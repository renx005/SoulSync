
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface BreathingFeedbackProps {
  currentStep: string;
  remainingTime: number;
  color: string;
}

export default function BreathingFeedback({ 
  currentStep, 
  remainingTime,
  color 
}: BreathingFeedbackProps) {
  const isMobile = useIsMobile();
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Instruction text
  const getInstructionText = () => {
    switch (currentStep) {
      case "inhale": return "Breathe in deeply through your nose";
      case "hold-in": return "Hold your breath";
      case "exhale": return "Exhale slowly through your mouth";
      case "hold-out": return "Rest before next breath";
      default: return "";
    }
  };
  
  // Visual indicator based on current breathing step
  const renderIcon = () => {
    switch (currentStep) {
      case "inhale":
        return (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            className={cn(
              "p-2 rounded-full",
              color === "blue" && "text-blue-600",
              color === "purple" && "text-purple-600",
              color === "green" && "text-green-600"
            )}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.div>
        );
      case "exhale":
        return (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [5, -5] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            className={cn(
              "p-2 rounded-full",
              color === "blue" && "text-blue-600",
              color === "purple" && "text-purple-600",
              color === "green" && "text-green-600"
            )}
          >
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        );
      case "hold-in":
      case "hold-out":
        return (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={cn(
              "p-2 rounded-full",
              color === "blue" && "text-blue-600",
              color === "purple" && "text-purple-600",
              color === "green" && "text-green-600"
            )}
          >
            <Clock className="h-5 w-5" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 mt-2 mb-2">
      {renderIcon()}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "bg-white/90 shadow-sm p-2 rounded text-sm text-center max-w-[160px]",
          color === "blue" && "text-blue-700",
          color === "purple" && "text-purple-700",
          color === "green" && "text-green-700"
        )}
      >
        {getInstructionText()}
      </motion.div>
      
      <div className="text-muted-foreground text-xs">
        {formatTime(remainingTime)}
      </div>
    </div>
  );
}
