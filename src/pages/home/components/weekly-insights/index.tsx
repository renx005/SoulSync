
import { useUser } from "@/contexts/UserContext";
import { useInsights } from "./useInsights";
import { MoodTrendCard } from "./MoodTrendCard";
import { JournalConsistencyCard } from "./JournalConsistencyCard";
import { HabitStreaksCard } from "./HabitStreaksCard";
import { ActivityLevelCard } from "./ActivityLevelCard";

export function WeeklyInsights() {
  const { user } = useUser();
  const insights = useInsights(user?.id);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <MoodTrendCard moodTrend={insights.moodTrend} />
      <JournalConsistencyCard journalConsistency={insights.journalConsistency} />
      <HabitStreaksCard habitStreaks={insights.habitStreaks} />
      <ActivityLevelCard activityLevel={insights.activityLevel} />
    </div>
  );
}
