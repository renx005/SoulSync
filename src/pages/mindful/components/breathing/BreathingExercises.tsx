
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wind, Clock, Filter, XCircle } from "lucide-react";
import BreathingSession from "./BreathingSession";
import { breathingExercises } from "../../data/breathingExercises";
import FilterSection from "./filters/FilterSection";
import SearchBar from "./filters/SearchBar";
import ExerciseCard from "./cards/ExerciseCard";
import EmptyState from "./EmptyState";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface BreathingExercisesProps {
  onSessionChange?: (inSession: boolean) => void;
}

export default function BreathingExercises({ onSessionChange }: BreathingExercisesProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [favoriteExercises, setFavoriteExercises] = useLocalStorage<string[]>("breathing-favorites", []);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeDurationFilter, setActiveDurationFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredExercises, setFilteredExercises] = useState(breathingExercises);
  
  // Notify parent component about session state changes
  useEffect(() => {
    if (onSessionChange) {
      onSessionChange(activeSession !== null);
    }
  }, [activeSession, onSessionChange]);
  
  const toggleFavorite = (id: string) => {
    if (favoriteExercises.includes(id)) {
      setFavoriteExercises(favoriteExercises.filter(exerciseId => exerciseId !== id));
    } else {
      setFavoriteExercises([...favoriteExercises, id]);
    }
  };

  const filters = [
    { label: "All", value: null },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Favorites", value: "favorites" }
  ];

  const durationFilters = [
    { label: "All", value: null },
    { label: "< 5 min", value: "quick" },
    { label: "5-7 min", value: "medium" },
    { label: "> 7 min", value: "long" }
  ];

  // Filter exercises whenever filter, search, or favorites change
  useEffect(() => {
    let result = breathingExercises;
    
    // Apply level filter
    if (activeFilter === "favorites") {
      result = result.filter(exercise => favoriteExercises.includes(exercise.id));
    } else if (activeFilter) {
      result = result.filter(exercise => exercise.level === activeFilter);
    }
    
    // Apply duration filter
    if (activeDurationFilter) {
      result = result.filter(exercise => {
        const duration = exercise.duration;
        switch (activeDurationFilter) {
          case "quick": return duration < 5;
          case "medium": return duration >= 5 && duration <= 7;
          case "long": return duration > 7;
          default: return true;
        }
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        exercise => 
          exercise.name.toLowerCase().includes(query) || 
          exercise.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredExercises(result);
  }, [activeFilter, activeDurationFilter, searchQuery, favoriteExercises]);

  const clearFilters = () => {
    setActiveFilter(null);
    setActiveDurationFilter(null);
    setSearchQuery("");
  };

  if (activeSession) {
    const exercise = breathingExercises.find(ex => ex.id === activeSession);
    if (!exercise) return null;
    
    return (
      <BreathingSession 
        exercise={exercise} 
        onClose={() => setActiveSession(null)} 
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <Wind className="h-5 w-5 text-mindscape-primary" />
          Breathing Exercises
        </h2>
        <span className="text-xs text-muted-foreground">Choose to begin</span>
      </div>
      
      {/* Search Bar */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Filters accordion for mobile */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {(activeFilter || activeDurationFilter) && (
                <span className="bg-mindscape-primary/20 text-mindscape-primary text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {/* Level Filters */}
              <FilterSection
                title="Level"
                icon={<Filter className="h-4 w-4 text-muted-foreground" />}
                options={filters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
              
              {/* Duration Filters */}
              <FilterSection
                title="Duration"
                icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                options={durationFilters}
                activeFilter={activeDurationFilter}
                onFilterChange={setActiveDurationFilter}
              />
              
              {/* Clear Filters Button */}
              {(activeFilter || activeDurationFilter || searchQuery) && (
                <button 
                  className="text-mindscape-primary text-sm font-medium flex items-center gap-1 mt-2"
                  onClick={clearFilters}
                >
                  <XCircle className="h-4 w-4" />
                  Clear all filters
                </button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <ScrollArea className="h-[calc(100vh-370px)]">
        {filteredExercises.length === 0 ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isFavorite={favoriteExercises.includes(exercise.id)}
                onToggleFavorite={toggleFavorite}
                onStartSession={setActiveSession}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
