
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface BreathingCircleProps {
  currentStep: string;
  circleSize: number;
  exercise: {
    color: string;
    pattern: {
      inhale: number;
      exhale: number;
      holdIn: number;
      holdOut: number;
    };
  };
}

export default function BreathingCircle({
  currentStep,
  circleSize,
  exercise
}: BreathingCircleProps) {
  const isMobile = useIsMobile();
  const adjustedSize = isMobile ? circleSize * 0.8 : circleSize;
  
  const getInstructionText = () => {
    switch (currentStep) {
      case "inhale":
        return "Breathe In";
      case "hold-in":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "hold-out":
        return "Hold";
      default:
        return "";
    }
  };

  // Get the current duration for the animation based on step
  const getCurrentDuration = () => {
    switch (currentStep) {
      case "inhale":
        return exercise.pattern.inhale;
      case "hold-in":
        return exercise.pattern.holdIn;
      case "exhale":
        return exercise.pattern.exhale;
      case "hold-out":
        return exercise.pattern.holdOut;
      default:
        return 4;
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{
        height: isMobile ? '220px' : '260px', // Reduced height to fit more content
        width: '100%',
        overflow: 'hidden' // Prevent content from spilling out
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{
            width: adjustedSize,
            height: adjustedSize
          }} 
          transition={{
            duration: currentStep === "inhale" ? exercise.pattern.inhale : currentStep === "exhale" ? exercise.pattern.exhale : 0.5,
            ease: "easeInOut"
          }} 
          className={cn(
            "rounded-full flex items-center justify-center border-4 relative", 
            exercise.color === "blue" && "bg-blue-100/50 border-blue-200", 
            exercise.color === "purple" && "bg-purple-100/50 border-purple-200", 
            exercise.color === "green" && "bg-green-100/50 border-green-200"
          )}
        >
          <motion.div 
            animate={{
              width: adjustedSize * 0.7,
              height: adjustedSize * 0.7,
              opacity: currentStep === "hold-in" || currentStep === "hold-out" ? [0.7, 1, 0.7] : 1
            }} 
            transition={{
              duration: currentStep === "inhale" ? exercise.pattern.inhale : currentStep === "exhale" ? exercise.pattern.exhale : 2,
              repeat: currentStep === "hold-in" || currentStep === "hold-out" ? Infinity : 0,
              ease: "easeInOut"
            }} 
            className={cn(
              "rounded-full flex items-center justify-center relative", 
              exercise.color === "blue" && "bg-blue-200/50", 
              exercise.color === "purple" && "bg-purple-200/50", 
              exercise.color === "green" && "bg-green-200/50"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep} 
                initial={{
                  opacity: 0,
                  scale: 0.8
                }} 
                animate={{
                  opacity: 1,
                  scale: 1
                }} 
                exit={{
                  opacity: 0,
                  scale: 0.8
                }} 
                className={cn(
                  "text-xl font-medium text-center", 
                  exercise.color === "blue" && "text-blue-700", 
                  exercise.color === "purple" && "text-purple-700", 
                  exercise.color === "green" && "text-green-700"
                )}
              >
                {getInstructionText()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
        
        {/* Add pulsing rings for visual effect but make sure they don't affect layout */}
        {currentStep === "inhale" && (
          <motion.div 
            className={cn(
              "absolute rounded-full border-2 z-0 pointer-events-none", 
              exercise.color === "blue" && "border-blue-300/40", 
              exercise.color === "purple" && "border-purple-300/40", 
              exercise.color === "green" && "border-green-300/40"
            )} 
            initial={{
              width: adjustedSize * 0.9,
              height: adjustedSize * 0.9,
              opacity: 0
            }} 
            animate={{
              width: [adjustedSize * 0.9, adjustedSize * 1.1, adjustedSize * 1.3],
              height: [adjustedSize * 0.9, adjustedSize * 1.1, adjustedSize * 1.3],
              opacity: [0, 0.5, 0]
            }} 
            transition={{
              duration: 3,
              repeat: Infinity
            }} 
            style={{
              position: 'absolute'
            }} 
          />
        )}
        
        {currentStep === "exhale" && (
          <motion.div 
            className={cn(
              "absolute rounded-full border-2 z-0 pointer-events-none", 
              exercise.color === "blue" && "border-blue-300/40", 
              exercise.color === "purple" && "border-purple-300/40", 
              exercise.color === "green" && "border-green-300/40"
            )} 
            initial={{
              width: adjustedSize * 1.3,
              height: adjustedSize * 1.3,
              opacity: 0
            }} 
            animate={{
              width: [adjustedSize * 1.3, adjustedSize * 1.1, adjustedSize * 0.9],
              height: [adjustedSize * 1.3, adjustedSize * 1.1, adjustedSize * 0.9],
              opacity: [0, 0.5, 0]
            }} 
            transition={{
              duration: 3,
              repeat: Infinity
            }} 
            style={{
              position: 'absolute'
            }} 
          />
        )}
      </div>
    </div>
  );
}
