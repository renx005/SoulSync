
import React from 'react';
import { MoodCalendar } from './mood-calendar';
import { MoodTrends } from './MoodTrends';
import { EmotionAnalysis } from './EmotionAnalysis';
import { HabitProgress } from './HabitProgress';
import { WeeklySummary } from './WeeklySummary';
import { InsightsData } from '../types';

interface InsightsContentProps {
  data: InsightsData | null;
  insightsRef: React.RefObject<HTMLDivElement>;
}

export function InsightsContent({ data, insightsRef }: InsightsContentProps) {
  if (!data) {
    return (
      <div ref={insightsRef} className="space-y-6">
        <div className="md:col-span-2 p-6 text-center">
          <p className="text-muted-foreground">No data available. Start tracking your mood to see insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={insightsRef} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <MoodCalendar moods={data.recentMoods} />
        <MoodTrends 
          weeklyMoodCounts={data.weeklyMoodCounts} 
          moodTrend={data.moodTrend} 
        />
        <EmotionAnalysis moodDistribution={data.moodDistribution} />
        <HabitProgress habitProgress={data.habitProgress} />
      </div>
      
      <WeeklySummary 
        moodAverage={data.weeklySummary.moodAverage}
        journalEntries={data.weeklySummary.journalEntries}
        completedHabits={data.weeklySummary.completedHabits}
        mindfulnessMinutes={data.weeklySummary.mindfulnessMinutes}
      />
    </div>
  );
}
