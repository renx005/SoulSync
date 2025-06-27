
// Define mood scores to evaluate trends
export function getMoodScores(): Record<string, number> {
  return {
    "amazing": 5,
    "good": 4,
    "peaceful": 4,
    "calm": 4,
    "energetic": 4,
    "okay": 3,
    "tired": 2,
    "stressed": 2,
    "anxious": 2,
    "sad": 2,
    "angry": 1,
    "awful": 1
  };
}

// Calculate trend percentage
export function calculateMoodTrend(currentAvg: number, previousAvg: number): number {
  // If no previous data to compare, use a moderate positive trend
  if (previousAvg === 0) {
    return currentAvg > 0 ? 15 : 0;
  }
  
  // Calculate percentage change
  return Math.round(((currentAvg - previousAvg) / previousAvg) * 100);
}
