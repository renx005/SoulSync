
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { InsightsData } from '../types';
import { fetchInsightsData } from './useInsightsDataFetcher';

export function useInsightsData() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useUser();

  const updateSelectedDate = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadData = () => {
      setIsLoading(true);
      
      try {
        const insightsData = fetchInsightsData(selectedDate, user.id);
        setData(insightsData);
      } catch (error) {
        console.error("Error in useInsightsData:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      // Only refresh if related to our app's data
      if (e.key && e.key.startsWith('soulsync_')) {
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, selectedDate]);
  
  return { data, isLoading, selectedDate, setSelectedDate: updateSelectedDate };
}
