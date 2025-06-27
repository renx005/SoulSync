
import React from "react";
import { MoodQuoteType } from "./quotes-data";

interface QuoteDisplayProps {
  quote: MoodQuoteType;
  animation: string;
}

export function QuoteDisplay({ quote, animation }: QuoteDisplayProps) {
  return (
    <blockquote className={`mt-2 ${animation}`}>
      <p className="text-base italic">"{quote.text}"</p>
      <footer className="mt-2 text-sm text-muted-foreground">— {quote.author}</footer>
    </blockquote>
  );
}
