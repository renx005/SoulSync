
import { Flower, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface MindfulHeaderProps {
  username: string;
}

export default function MindfulHeader({ username }: MindfulHeaderProps) {
  return (
    <header className="pt-2 bg-gradient-to-r from-mindscape-light/30 to-transparent p-4 rounded-xl relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-xl font-bold font-display text-mindscape-primary flex items-center gap-2">
          <span className="truncate">Welcome to Mindful, {username}!</span>
          <Flower className="h-5 w-5 text-mindscape-primary animate-pulse shrink-0" />
        </h1>
        <p className="text-sm text-muted-foreground">Find peace and improve your well-being</p>
      </div>
      
      {/* Animated shapes */}
      <motion.div 
        className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-blue-100/40 blur-lg transform -translate-y-1/2"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute top-0 right-12 w-8 h-8 rounded-full bg-purple-100/30 blur-md"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-10 h-10 rounded-full bg-green-100/30 blur-lg"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.7
        }}
      />
    </header>
  );
}
