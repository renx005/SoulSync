
import { ChevronRight, Edit, Trash, MessageSquare } from "lucide-react";
import { ForumCategory } from "@/types/community";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { CategoryIcon } from "@/components/community/CategoryIcon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AdminForumCategoryListProps {
  categories: ForumCategory[];
  onDeletePosts: (categoryId: string) => void;
}

export function AdminForumCategoryList({ categories, onDeletePosts }: AdminForumCategoryListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCategoryId(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleMessageClick = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Message Feature",
      description: "The message feature will be available in the next update.",
    });
  };

  const confirmDelete = () => {
    if (selectedCategoryId) {
      onDeletePosts(selectedCategoryId);
      setDeleteDialogOpen(false);
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5">
      {categories.map((category) => (
        <Link key={category.id} to={`/admin/community/category/${category.id}`} className="no-underline">
          <div className="block card-primary p-4 sm:p-5 transition-all hover:shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", category.color)}>
                  <CategoryIcon categoryId={category.id} className="text-primary" />
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
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={(e) => handleDeleteClick(e, category.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                  
                  <Button
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={(e) => handleMessageClick(e, category.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all posts?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all posts in this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground"
              onClick={confirmDelete}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
