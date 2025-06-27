
import { useState, useEffect } from "react";
import { moodQuotes, MoodQuoteType, MoodType } from "./quotes-data";
import { MoodValue } from "../mood-tracker/types";

export function useDailyMotivation(selectedMood: MoodValue | null) {
  const [quote, setQuote] = useState<MoodQuoteType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState("");
  
  const fetchQuoteForMood = () => {
    let quoteList = moodQuotes.default;
    
    if (selectedMood && moodQuotes[selectedMood as MoodType]) {
      quoteList = moodQuotes[selectedMood as MoodType];
    }
    
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    return quoteList[randomIndex];
  };
  
  const refreshQuote = () => {
    setRefreshing(true);
    setAnimation("animate-fade-out");
    
    setTimeout(() => {
      setQuote(fetchQuoteForMood());
      setAnimation("animate-fade-in");
      
      setTimeout(() => {
        setRefreshing(false);
      }, 300);
    }, 300);
  };
  
  useEffect(() => {
    setQuote(fetchQuoteForMood());
    setAnimation("animate-fade-in");
  }, [selectedMood]);
  
  return {
    quote,
    refreshing,
    animation,
    refreshQuote
  };
}
