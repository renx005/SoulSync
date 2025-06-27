
export function calculateActivityLevel(
  habitCompletionRate: number, 
  journalActivityRate: number, 
  moodEngagementRate: number
): number | null {
  // Only calculate activity level if there is at least one type of activity
  if (habitCompletionRate <= 0 && journalActivityRate <= 0 && moodEngagementRate <= 0) {
    return null;
  }
  
  // Calculate overall activity level as weighted average
  return Math.round(
    (habitCompletionRate * 0.5) + (journalActivityRate * 0.3) + (moodEngagementRate * 0.2)
  );
}
