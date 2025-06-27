
import { BreathingExerciseType } from "../types";

export const breathingExercises: BreathingExerciseType[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "A simple technique to reduce stress and improve focus through equal-duration breathing phases.",
    duration: 5,
    level: "Beginner",
    color: "blue",
    pattern: {
      inhale: 4,
      holdIn: 4,
      exhale: 4,
      holdOut: 4
    }
  },
  {
    id: "4-7-8-breathing",
    name: "4-7-8 Breathing",
    description: "A relaxing breath pattern that helps reduce anxiety and prepare for sleep.",
    duration: 5,
    level: "Beginner",
    color: "purple",
    pattern: {
      inhale: 4,
      holdIn: 7,
      exhale: 8,
      holdOut: 0
    }
  },
  {
    id: "deep-breathing",
    name: "Deep Breathing",
    description: "A fundamental technique that uses the diaphragm to maximize oxygen intake and promote relaxation.",
    duration: 3,
    level: "Beginner",
    color: "green",
    pattern: {
      inhale: 5,
      holdIn: 2,
      exhale: 5,
      holdOut: 0
    }
  },
  {
    id: "alternate-nostril",
    name: "Alternate Nostril Breathing",
    description: "Balance your nervous system and create mental clarity with this yogic breathing technique.",
    duration: 8,
    level: "Intermediate",
    color: "blue",
    pattern: {
      inhale: 4,
      holdIn: 2,
      exhale: 6,
      holdOut: 2
    }
  },
  {
    id: "calming-breath",
    name: "Calming Breath",
    description: "A longer exhale than inhale helps activate the parasympathetic nervous system for deep relaxation.",
    duration: 5,
    level: "Beginner",
    color: "green",
    pattern: {
      inhale: 4,
      holdIn: 0,
      exhale: 6,
      holdOut: 0
    }
  },
  {
    id: "energizing-breath",
    name: "Energizing Breath",
    description: "Quick, rhythmic breathing to increase alertness and energy levels.",
    duration: 3,
    level: "Intermediate",
    color: "purple",
    pattern: {
      inhale: 2,
      holdIn: 0,
      exhale: 2,
      holdOut: 0
    }
  }
];
