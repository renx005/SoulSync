
import { Heart, Brain, Flame, Globe, Book, MessageSquare, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  categoryId: string;
  className?: string;
}

export function CategoryIcon({ categoryId, className }: CategoryIconProps) {
  const getIcon = () => {
    switch(categoryId) {
      case 'anxiety':
        return <Heart className={cn("h-5 w-5", className)} />;
      case 'depression':
        return <Brain className={cn("h-5 w-5", className)} />;
      case 'mindfulness':
        return <Flame className={cn("h-5 w-5", className)} />;
      case 'stress':
        return <Book className={cn("h-5 w-5", className)} />;
      case 'general':
        return <Globe className={cn("h-5 w-5", className)} />;
      case 'community':
        return <MessageSquare className={cn("h-5 w-5", className)} />;
      case 'verified':
        return <CheckCircle2 className={cn("h-5 w-5", className)} />;
      default:
        return <Heart className={cn("h-5 w-5", className)} />;
    }
  };

  return getIcon();
}
