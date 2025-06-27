
export interface Habit {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  color: string;
  daysCompleted: number;
  totalDays: number;
}

export interface ColorOption {
  label: string;
  value: string;
  textColor: string;
}

export const colorOptions: ColorOption[] = [
  { label: "Green", value: "bg-mindscape-green border-green-300", textColor: "text-green-800" },
  { label: "Blue", value: "bg-mindscape-blue border-blue-300", textColor: "text-blue-800" },
  { label: "Yellow", value: "bg-mindscape-yellow border-yellow-300", textColor: "text-yellow-800" },
  { label: "Peach", value: "bg-mindscape-peach border-orange-300", textColor: "text-orange-800" },
  { label: "Pink", value: "bg-mindscape-pink border-pink-300", textColor: "text-pink-800" },
];
