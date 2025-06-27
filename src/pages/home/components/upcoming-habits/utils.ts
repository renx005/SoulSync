
import { Habit } from "./types";

// Colors for different habit types
export const habitColors: Record<string, string> = {
  "meditation": "border-blue-400 bg-blue-50/50",
  "exercise": "border-green-400 bg-green-50/50",
  "reading": "border-purple-400 bg-purple-50/50",
  "journaling": "border-indigo-400 bg-indigo-50/50",
  "water": "border-cyan-400 bg-cyan-50/50",
  "walking": "border-orange-400 bg-orange-50/50",
  "sleep": "border-blue-300 bg-blue-50/50",
  "stretching": "border-yellow-400 bg-yellow-50/50",
  "vitamins": "border-pink-400 bg-pink-50/50"
};

// Get a color for a habit
export const getHabitColor = (name: string, colorValue?: string) => {
  if (colorValue) return colorValue;
  
  const lowerName = name.toLowerCase();
  let color = "border-gray-400 bg-gray-50/50";
  
  // Find matching colors
  Object.keys(habitColors).forEach(key => {
    if (lowerName.includes(key)) {
      color = habitColors[key];
    }
  });
  
  return color;
};

export const saveHabitToStorage = (userId: string, habits: any[]) => {
  const storageKey = `soulsync_habits_${userId}`;
  localStorage.setItem(storageKey, JSON.stringify(habits));
  
  // Dispatch storage event for other components
  const event = new StorageEvent('storage', {
    key: storageKey,
    newValue: JSON.stringify(habits),
    storageArea: localStorage
  });
  window.dispatchEvent(event);
};
