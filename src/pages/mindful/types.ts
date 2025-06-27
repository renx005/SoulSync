
import { LucideIcon } from "lucide-react";

// Breathing Exercise Types
export interface BreathingPattern {
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
}

export interface BreathingExerciseType {
  id: string;
  name: string;
  description: string;
  duration: number;
  level: string;
  color: string;
  pattern: BreathingPattern;
}

// Mindfulness Exercise Types
export interface MindfulnessStep {
  title: string;
  instruction: string;
  duration: number;
}

export interface MindfulnessExerciseType {
  id: string;
  name: string;
  description: string;
  duration: number;
  focus: string;
  color: string;
  steps: MindfulnessStep[];
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  text: string;
  description: string;
  category: string;
}

export interface QuizAnswer {
  questionId: string;
  category: string;
  value: number;
}

export interface QuizCategoryScore {
  category: string;
  score: number;
  level: string;
}

export interface QuizRecommendation {
  category: string;
  exerciseType: "breathing" | "mindfulness";
  exerciseIds: string[];
}

export interface QuizResult {
  categoryScores: QuizCategoryScore[];
  recommendations: QuizRecommendation[];
  date: string;
}

// Progress Types
export interface ProgressLogItem {
  id: string;
  date: string;
  exerciseId: string;
  exerciseType: "breathing" | "mindfulness";
  duration: number;
}

export interface MindfulStat {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  benefits: string[];
  research: string;
}
