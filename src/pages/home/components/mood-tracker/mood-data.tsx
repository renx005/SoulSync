
import { 
  SunMedium, 
  HeartHandshake, 
  CircleOff,
  Cloud,
  CloudRain,
  Flame,
  Wind,
  Zap,
  AlertCircle,
  Battery,
  Clock,
  Leaf
} from "lucide-react";
import { Mood } from "./types";

export const moods: Mood[] = [
  { 
    value: "amazing", 
    label: "Amazing", 
    icon: <SunMedium className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200"
  },
  { 
    value: "good", 
    label: "Good", 
    icon: <HeartHandshake className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200" 
  },
  { 
    value: "calm", 
    label: "Calm", 
    icon: <Wind className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-blue-400",
    bgColor: "bg-blue-50 border-blue-100" 
  },
  { 
    value: "energetic", 
    label: "Energetic", 
    icon: <Zap className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-amber-500",
    bgColor: "bg-amber-50 border-amber-200" 
  },
  { 
    value: "peaceful", 
    label: "Peaceful", 
    icon: <Leaf className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-green-500",
    bgColor: "bg-green-50 border-green-100" 
  },
  { 
    value: "okay", 
    label: "Okay", 
    icon: <CircleOff className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200" 
  },
  { 
    value: "tired", 
    label: "Tired", 
    icon: <Battery className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-gray-500",
    bgColor: "bg-gray-50 border-gray-200" 
  },
  { 
    value: "stressed", 
    label: "Stressed", 
    icon: <Clock className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-orange-500",
    bgColor: "bg-orange-50 border-orange-100" 
  },
  { 
    value: "anxious", 
    label: "Anxious", 
    icon: <AlertCircle className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 border-indigo-200" 
  },
  { 
    value: "sad", 
    label: "Sad", 
    icon: <Cloud className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200" 
  },
  { 
    value: "angry", 
    label: "Angry", 
    icon: <Flame className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200" 
  },
  { 
    value: "awful", 
    label: "Awful", 
    icon: <CloudRain className="h-8 w-8 stroke-[1.25]" />, 
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200" 
  },
];
