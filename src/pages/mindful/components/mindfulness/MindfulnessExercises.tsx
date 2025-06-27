
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flower, Clock, Filter, ScanFace, XCircle } from "lucide-react";
import MindfulnessSession from "./MindfulnessSession";
import { mindfulnessExercises } from "../../data/mindfulnessExercises";
import FilterSection from "./filters/FilterSection";
import SearchBar from "./filters/SearchBar";
import ExerciseCard from "./cards/ExerciseCard";
import EmptyState from "./EmptyState";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface MindfulnessExercisesProps {
  onSessionChange?: (inSession: boolean) => void;
}

export default function MindfulnessExercises({ onSessionChange }: MindfulnessExercisesProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [favoriteExercises, setFavoriteExercises] = useLocalStorage<string[]>("mindfulness-favorites", []);
  const [activeFocusFilter, setActiveFocusFilter] = useState<string | null>(null);
  const [activeDurationFilter, setActiveDurationFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredExercises, setFilteredExercises] = useState(mindfulnessExercises);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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

  const focusFilters = [
    { label: "All", value: null },
    { label: "Stress Relief", value: "Stress Relief" },
    { label: "Focus", value: "Focus" },
    { label: "Body Awareness", value: "Body Awareness" },
    { label: "Favorites", value: "favorites" }
  ];

  const durationFilters = [
    { label: "All", value: null },
    { label: "< 5 min", value: "quick" },
    { label: "5-10 min", value: "medium" },
    { label: "> 10 min", value: "long" }
  ];

  // Filter exercises whenever filter, search, or favorites change
  useEffect(() => {
    let result = mindfulnessExercises;
    
    // Apply focus filter
    if (activeFocusFilter === "favorites") {
      result = result.filter(exercise => favoriteExercises.includes(exercise.id));
    } else if (activeFocusFilter) {
      result = result.filter(exercise => exercise.focus === activeFocusFilter);
    }
    
    // Apply duration filter
    if (activeDurationFilter) {
      result = result.filter(exercise => {
        const duration = exercise.duration;
        switch (activeDurationFilter) {
          case "quick": return duration < 5;
          case "medium": return duration >= 5 && duration <= 10;
          case "long": return duration > 10;
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
  }, [activeFocusFilter, activeDurationFilter, searchQuery, favoriteExercises]);

  const clearFilters = () => {
    setActiveFocusFilter(null);
    setActiveDurationFilter(null);
    setSearchQuery("");
  };

  if (activeSession) {
    const exercise = mindfulnessExercises.find(ex => ex.id === activeSession);
    if (!exercise) return null;
    
    return (
      <MindfulnessSession 
        exercise={exercise} 
        onClose={() => setActiveSession(null)} 
      />
    );
  }

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <Flower className="h-5 w-5 text-mindscape-primary" />
          Mindfulness Exercises
        </h2>
        <span className="text-xs text-muted-foreground">Choose to begin</span>
      </div>
      
      {/* Search Bar */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Mobile Filters */}
      <div className="md:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="filters" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(activeFocusFilter || activeDurationFilter) && (
                  <span className="bg-mindscape-primary/20 text-mindscape-primary text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 py-2">
                {/* Focus Filters */}
                <FilterSection
                  title="Focus Area"
                  icon={<ScanFace className="h-4 w-4 text-muted-foreground" />}
                  options={focusFilters}
                  activeFilter={activeFocusFilter}
                  onFilterChange={setActiveFocusFilter}
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
                {(activeFocusFilter || activeDurationFilter || searchQuery) && (
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
      </div>
      
      {/* Desktop Filters (hidden on mobile) */}
      <div className="hidden md:block space-y-3">
        {/* Focus Filters */}
        <FilterSection
          title="Focus Area"
          icon={<ScanFace className="h-4 w-4 text-muted-foreground" />}
          options={focusFilters}
          activeFilter={activeFocusFilter}
          onFilterChange={setActiveFocusFilter}
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
        {(activeFocusFilter || activeDurationFilter || searchQuery) && (
          <button 
            className="text-mindscape-primary text-sm font-medium flex items-center gap-1 mt-2"
            onClick={clearFilters}
          >
            <XCircle className="h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100vh-370px)] md:h-[calc(100vh-320px)]">
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
