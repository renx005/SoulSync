
import { useState, useEffect } from "react";
import { InsightData } from "./types";
import { useInsightsDataFetcher } from "./hooks/useInsightsDataFetcher";
import { getMoodEngagementRate } from "./utils/moodUtils";

export function useInsights(userId?: string) {
  const [insights, setInsights] = useState<InsightData>({
    moodTrend: null,
    journalConsistency: null,
    habitStreaks: null,
    activityLevel: null
  });
  
  const { fetchData } = useInsightsDataFetcher();
  
  useEffect(() => {
    if (!userId) return;
    
    const loadInsightsData = () => {
      const insightData = fetchData(userId);
      setInsights(insightData);
    };
    
    loadInsightsData();
    
    // Listen for storage changes for user-specific data
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (
        e.key.startsWith('soulsync_') || 
        e.key === `soulsync_moods_${userId}` || 
        e.key === 'soulsync_moods'
      )) {
        loadInsightsData();
      }
    };
    
    // Also run a periodic refresh to catch changes
    const intervalId = setInterval(loadInsightsData, 5000);
    
    // Use custom event for immediate updates
    const handleCustomStorageChange = () => {
      loadInsightsData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('soulsync_data_updated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('soulsync_data_updated', handleCustomStorageChange);
      clearInterval(intervalId);
    };
    
  }, [userId, fetchData]);

  return insights;
}
