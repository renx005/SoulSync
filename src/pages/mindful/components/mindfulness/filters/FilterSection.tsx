
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterOption {
  label: string;
  value: string | null;
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  options: FilterOption[];
  activeFilter: string | null;
  onFilterChange: (value: string | null) => void;
}

export default function FilterSection({
  title,
  icon,
  options,
  activeFilter,
  onFilterChange,
}: FilterSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ScrollArea className="pb-1 max-w-full">
        <div className="flex flex-wrap gap-2 pb-1">
          {options.map((filter) => (
            <Badge
              key={filter.label}
              variant={activeFilter === filter.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer rounded-full whitespace-nowrap text-xs py-0.5 px-2",
                activeFilter === filter.value &&
                  "bg-mindscape-primary hover:bg-mindscape-primary/90"
              )}
              onClick={() => onFilterChange(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
