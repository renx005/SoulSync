
import React from 'react';
import { LineChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface MoodTrendsProps {
  weeklyMoodCounts: Record<string, number>;
  moodTrend: number;
}

export function MoodTrends({ weeklyMoodCounts, moodTrend }: MoodTrendsProps) {
  // Convert data to format expected by recharts
  const chartData = Object.entries(weeklyMoodCounts).map(([day, count]) => ({
    day,
    count: count || 0 // Ensure we have at least 0
  }));
  
  // Ensure trend display is more reasonable
  const displayTrend = Math.min(Math.max(-50, moodTrend), 50);
  const trendColor = displayTrend >= 0 ? 'text-green-500' : 'text-red-500';
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-mindscape-primary" />
            Mood Trends
          </CardTitle>
          <div className={`text-sm font-medium flex items-center gap-1 ${trendColor}`}>
            {displayTrend >= 0 ? '+' : ''}{displayTrend}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-2 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => value === 0 ? '' : value.toString()}
              />
              <Tooltip 
                formatter={(value) => [`${value} entries`, 'Count']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#9b87f5" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
                activeDot={{ r: 6, fill: "#6952c9", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
