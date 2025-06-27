
export const calculateMoodTrend = (recentAvg: number, prevAvg: number): number => {
  // If there's no previous data to compare with
  if (prevAvg === 0) {
    return recentAvg > 0 ? 15 : 0; // Return modest positive if we have recent data
  }
  
  // If there's no recent data but we had previous data
  if (recentAvg === 0 && prevAvg > 0) {
    return -10; // Show slight decline
  }
  
  // Calculate percentage change with more reasonable limits
  const percentChange = Math.round(((recentAvg - prevAvg) / prevAvg) * 100);
  
  // Limit the percentage change to more reasonable values
  return Math.max(-40, Math.min(40, percentChange));
};

export const getMoodScores = (): Record<string, number> => {
  return {
    "amazing": 5, 
    "good": 4,
    "energetic": 4,
    "calm": 4,
    "peaceful": 4,
    "okay": 3,
    "tired": 3,
    "stressed": 2,
    "anxious": 2, 
    "sad": 2,
    "angry": 1, 
    "awful": 1
  };
};
