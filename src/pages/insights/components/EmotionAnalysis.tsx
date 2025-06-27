
import React from 'react';
import { PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';

interface EmotionAnalysisProps {
  moodDistribution: Record<string, number>;
}

export function EmotionAnalysis({ moodDistribution }: EmotionAnalysisProps) {
  const COLORS = {
    'amazing': '#4ade80', // green-400
    'good': '#86efac',    // green-300
    'peaceful': '#a7f3d0', // green-200
    'calm': '#bae6fd',    // blue-200
    'energetic': '#fcd34d', // amber-300
    'okay': '#93c5fd',    // blue-300
    'tired': '#d1d5db',   // gray-300
    'stressed': '#fed7aa', // orange-200
    'anxious': '#a5b4fc',  // indigo-300
    'sad': '#fdba74',     // orange-300
    'angry': '#f87171',   // red-400
    'awful': '#fca5a5',   // red-300
  };
  
  const MOOD_LABELS = {
    'amazing': 'Amazing',
    'good': 'Good',
    'peaceful': 'Peaceful',
    'calm': 'Calm',
    'energetic': 'Energetic',
    'okay': 'Okay',
    'tired': 'Tired',
    'stressed': 'Stressed',
    'anxious': 'Anxious',
    'sad': 'Sad',
    'angry': 'Angry',
    'awful': 'Awful',
  };
  
  // Convert data to format expected by recharts
  const chartData = Object.entries(moodDistribution).map(([mood, count]) => ({
    name: MOOD_LABELS[mood as keyof typeof MOOD_LABELS] || mood,
    value: count,
    color: COLORS[mood as keyof typeof COLORS] || '#d4d4d4'
  }));
  
  // Calculate total entries
  const totalEntries = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-mindscape-primary" />
          Emotion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalEntries > 0 ? (
          <div className="flex flex-col items-center">
            {/* Mood type indicators at the top */}
            <div className="flex flex-wrap justify-center gap-3 mb-2 w-full">
              {chartData.map((entry, index) => {
                const percent = Math.round((entry.value / totalEntries) * 100);
                return (
                  <div key={`legend-${index}`} className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs">
                      {entry.name} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} entries (${Math.round((Number(value) / totalEntries) * 100)}%)`, name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No mood data recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
