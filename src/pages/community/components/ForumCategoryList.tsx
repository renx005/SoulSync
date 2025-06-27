
import { ChevronRight } from "lucide-react";
import { ForumCategory } from "@/types/community";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { CategoryIcon } from "@/components/community/CategoryIcon";

interface ForumCategoryListProps {
  categories: ForumCategory[];
}

export function ForumCategoryList({ categories }: ForumCategoryListProps) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {categories.map((category) => (
        <Link 
          to={`/community/category/${category.id}`}
          key={category.id}
          className="block card-primary p-4 sm:p-5 transition-all hover:shadow-md"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", category.color)}>
                <CategoryIcon categoryId={category.id} className="text-mindscape-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm sm:text-base">{category.name}</h3>
                <p className="text-xs text-muted-foreground max-w-full mt-1">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{category.posts} posts</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
