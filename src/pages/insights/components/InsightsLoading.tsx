
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function InsightsLoading() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-display">Insights</h1>
        <p className="text-muted-foreground">Track your progress and patterns</p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-[270px] w-full" />
        ))}
      </div>
      
      <Skeleton className="h-[340px] w-full" />
    </div>
  );
}
