
import React from "react";
import { RefreshCw } from "lucide-react";
import { useDailyMotivation } from "./use-daily-motivation";
import { QuoteDisplay } from "./QuoteDisplay";
import { MoodValue } from "../mood-tracker/types";

interface DailyMotivationCardProps {
  selectedMood: MoodValue | null;
}

export function DailyMotivationCard({ selectedMood }: DailyMotivationCardProps) {
  const { quote, refreshing, animation, refreshQuote } = useDailyMotivation(selectedMood);
  
  if (!quote) return null;
  
  return (
    <div className="card-primary p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-block px-2 py-1 text-xs font-medium bg-mindscape-light text-mindscape-primary rounded-full ${selectedMood ? 'animate-pulse' : ''}`}>
            Daily Motivation
          </span>
        </div>
        <button 
          onClick={refreshQuote} 
          className="text-mindscape-primary p-1 rounded-full hover:bg-mindscape-light transition-colors"
          disabled={refreshing}
        >
          <RefreshCw 
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} 
          />
        </button>
      </div>
      
      <QuoteDisplay quote={quote} animation={animation} />
    </div>
  );
}
