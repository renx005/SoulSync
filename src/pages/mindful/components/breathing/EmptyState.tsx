
import { Wind } from "lucide-react";
import SharedEmptyState from "../shared/EmptyState";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <SharedEmptyState 
      onClearFilters={onClearFilters} 
      icon={<Wind className="h-5 w-5" />}
      color="blue"
      message="No breathing exercises match your filters"
    />
  );
}
