
import { Flower } from "lucide-react";
import SharedEmptyState from "../shared/EmptyState";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <SharedEmptyState 
      onClearFilters={onClearFilters} 
      icon={<Flower className="h-5 w-5" />}
      color="purple"
      message="No mindfulness exercises match your filters"
    />
  );
}
