
import React, { useRef } from 'react';
import { useInsightsData } from './hooks/useInsightsData';
import { InsightsHeader } from './components/InsightsHeader';
import { InsightsContent } from './components/InsightsContent';
import { InsightsLoading } from './components/InsightsLoading';
import { ReportGenerator } from './components/ReportGenerator';

export default function Insights() {
  const { data, isLoading } = useInsightsData();
  const insightsRef = useRef<HTMLDivElement>(null);
  
  if (isLoading) {
    return <InsightsLoading />;
  }
  
  return (
    <div className="space-y-6">
      <InsightsHeader />
      <InsightsContent data={data} insightsRef={insightsRef} />
      <ReportGenerator data={data} insightsRef={insightsRef} />
    </div>
  );
}
