
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface WeeklySummaryProps {
  moodAverage: string;
  journalEntries: number;
  completedHabits: string;
  mindfulnessMinutes: number;
}

export function WeeklySummary({ 
  moodAverage, 
  journalEntries, 
  completedHabits, 
  mindfulnessMinutes 
}: WeeklySummaryProps) {
  const navigate = useNavigate();
  
  // Map mood to emoji
  const getMoodEmoji = (mood: string): string => {
    switch(mood.toLowerCase()) {
      case 'amazing': return '😄';
      case 'good': return '🙂';
      case 'peaceful': return '😌';
      case 'calm': return '😊';
      case 'energetic': return '⚡';
      case 'okay': return '😐';
      case 'tired': return '😴';
      case 'stressed': return '😓';
      case 'anxious': return '😰';
      case 'sad': return '😔';
      case 'angry': return '😠';
      case 'awful': return '😞';
      default: return '❓';
    }
  };
  
  // Generate insight based on mood data
  const getInsight = (mood: string): string => {
    if (mood.toLowerCase() === 'no data') {
      return 'Start tracking your mood, habits, and journal entries to get personalized insights.';
    }
    
    switch(mood.toLowerCase()) {
      case 'amazing':
        return 'Your mood has been excellent this week! Keep up with whatever you\'re doing.';
      case 'good':
      case 'peaceful':
      case 'calm':
        return 'Your mood tends to improve on days you complete your morning meditation habit.';
      case 'energetic':
        return 'Your energy levels have been high this week. Great for productivity and exercise!';
      case 'okay':
        return 'Try increasing your mindfulness minutes to help improve your mood.';
      case 'tired':
        return 'Consider adjusting your sleep schedule and adding more relaxation to your routine.';
      case 'stressed':
      case 'anxious':
        return 'Try breathing exercises and mindfulness to help reduce stress and anxiety.';
      case 'sad':
        return 'Consider adding more physical activity to your routine to help boost your mood.';
      case 'angry':
        return 'Mindfulness exercises might help manage feelings of anger and frustration.';
      case 'awful':
        return 'Remember to be kind to yourself during difficult times. Consider reaching out to a friend or professional.';
      default:
        return 'Start tracking your mood regularly to get personalized insights.';
    }
  };
  
  // Generate action recommendations
  const getActionRecommendation = () => {
    if (moodAverage === "No data") {
      return {
        text: "Start tracking your mood",
        action: () => navigate('/home')
      };
    }
    
    if (journalEntries < 3) {
      return {
        text: "Try writing in your journal more often",
        action: () => navigate('/journal')
      };
    }
    
    if (mindfulnessMinutes < 30) {
      return {
        text: "Add more mindfulness sessions to your week",
        action: () => navigate('/mindful')
      };
    }
    
    if (completedHabits !== "No data") {
      const [completed, total] = completedHabits.split('/').map(Number);
      if (completed / total < 0.6) {
        return {
          text: "Focus on completing more of your habits",
          action: () => navigate('/habit-tracker')
        };
      }
    }
    
    return {
      text: "Keep up the good work!",
      action: () => {}
    };
  };
  
  const recommendation = getActionRecommendation();
  const recommendationText = recommendation.text;
  
  return (
    <Card className="card-highlight">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Mood Average</span>
            <div className="flex items-center">
              <span className="text-lg mr-2">{getMoodEmoji(moodAverage)}</span>
              <span className="font-medium">{moodAverage}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Journal Entries</span>
            <span className="font-medium">{journalEntries}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Completed Habits</span>
            <span className="font-medium">{completedHabits}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Mindfulness Minutes</span>
            <span className="font-medium">{mindfulnessMinutes} mins</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-mindscape-primary/20">
          <h3 className="font-medium mb-2">This Week's Insight</h3>
          <div className="text-sm mb-4 p-3 bg-mindscape-light/30 rounded-lg min-h-16 max-h-32 overflow-y-auto">
            {getInsight(moodAverage)}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-2 h-auto py-2 px-4 whitespace-normal text-center"
            onClick={recommendation.action}
          >
            {recommendationText.length > 30 
              ? recommendationText.split(' ').slice(0, 4).join(' ') + '...' 
              : recommendationText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
