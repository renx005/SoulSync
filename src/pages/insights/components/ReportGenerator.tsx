
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { InsightsData } from '../types';

interface ReportGeneratorProps {
  data: InsightsData | null;
  insightsRef: React.RefObject<HTMLDivElement>;
}

export function ReportGenerator({ data, insightsRef }: ReportGeneratorProps) {
  const { toast } = useToast();
  
  // Function to generate and download PDF report
  const downloadReport = async () => {
    if (!insightsRef.current || !data) {
      toast({
        title: "Cannot generate report",
        description: "No data available to generate report.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Generating report",
      description: "Please wait while we prepare your report...",
    });
    
    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title to the PDF
      pdf.setFontSize(20);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Mindscape Insights Report', 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 20, 30);
      
      // Add a line separator
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 35, 190, 35);
      
      // Add weekly summary section
      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Weekly Summary', 20, 45);
      
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Mood Average: ${data.weeklySummary.moodAverage}`, 25, 55);
      pdf.text(`Journal Entries: ${data.weeklySummary.journalEntries}`, 25, 62);
      pdf.text(`Completed Habits: ${data.weeklySummary.completedHabits}`, 25, 69);
      pdf.text(`Mindfulness Minutes: ${data.weeklySummary.mindfulnessMinutes}`, 25, 76);
      
      // Add mood distribution section
      pdf.setFontSize(16);
      pdf.text('Mood Distribution', 20, 90);
      
      let y = 100;
      Object.entries(data.moodDistribution).forEach(([mood, count], index) => {
        pdf.setFontSize(12);
        pdf.text(`${mood}: ${count} entries`, 25, y);
        y += 7;
      });
      
      // Add habit progress section
      pdf.setFontSize(16);
      pdf.text('Habit Progress', 20, y + 10);
      
      y += 20;
      data.habitProgress.forEach((habit) => {
        const percentage = Math.round((habit.completed / habit.total) * 100);
        pdf.setFontSize(12);
        pdf.text(`${habit.name}: ${habit.completed}/${habit.total} days (${percentage}%)`, 25, y);
        y += 7;
      });
      
      // Add weekly mood counts
      pdf.setFontSize(16);
      pdf.text('Weekly Mood Entries', 20, y + 10);
      
      y += 20;
      Object.entries(data.weeklyMoodCounts).forEach(([day, count]) => {
        pdf.setFontSize(12);
        pdf.text(`${day}: ${count} entries`, 25, y);
        y += 7;
      });
      
      // Add insights section
      pdf.setFontSize(16);
      pdf.text('Insights', 20, y + 10);
      
      // Get insight text from helper function
      const insightText = getInsight(data.weeklySummary.moodAverage);
      pdf.setFontSize(12);
      
      // Split long text into multiple lines
      const splitText = pdf.splitTextToSize(insightText, 160);
      pdf.text(splitText, 25, y + 20);
      
      // Save the PDF
      pdf.save(`mindscape_insights_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Report generated",
        description: "Your detailed insights report has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating report",
        description: "There was a problem creating your PDF report.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Button 
        variant="outline" 
        className="button-secondary flex items-center gap-2"
        onClick={downloadReport}
        disabled={!data}
      >
        <Download className="h-4 w-4" />
        Download Report
      </Button>
    </div>
  );
}

// Helper function for getting mood-based insights
function getInsight(mood: string): string {
  switch(mood.toLowerCase()) {
    case 'amazing':
      return 'Your mood has been excellent this week! Keep up with whatever you\'re doing.';
    case 'good':
      return 'Your mood tends to improve on days you complete your morning meditation habit.';
    case 'okay':
      return 'Try increasing your mindfulness minutes to help improve your mood.';
    case 'sad':
      return 'Consider adding more physical activity to your routine to help boost your mood.';
    case 'awful':
      return 'Remember to be kind to yourself during difficult times. Consider reaching out to a friend or professional.';
    default:
      return 'Start tracking your mood regularly to get personalized insights.';
  }
}
