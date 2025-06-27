
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { ForumCategory } from "@/types/community";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const iconOptions = [
  { value: "heart", label: "Heart" },
  { value: "brain", label: "Brain" },
  { value: "flame", label: "Flame" },
  { value: "book", label: "Book" },
  { value: "globe", label: "Globe" }
];

const colorOptions = [
  { value: "bg-blue-100", label: "Blue" },
  { value: "bg-purple-100", label: "Purple" },
  { value: "bg-green-100", label: "Green" },
  { value: "bg-orange-100", label: "Orange" },
  { value: "bg-gray-100", label: "Gray" }
];

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: (category: ForumCategory) => void;
  existingCategories: ForumCategory[];
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  onCategoryAdded,
  existingCategories
}: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(iconOptions[0].value);
  const [color, setColor] = useState(colorOptions[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Simple validation
    if (!name.trim() || !description.trim() || !icon || !color) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
      });
      return;
    }

    // Use a slug version of name for id
    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (existingCategories.some(cat => cat.id === id)) {
      toast({
        title: "Duplicate Category",
        description: "A category with this name already exists.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newCategory: ForumCategory = {
        id,
        name: name.trim(),
        description: description.trim(),
        icon,
        posts: 0,
        color,
      };

      onCategoryAdded(newCategory);

      setName("");
      setDescription("");
      setIcon(iconOptions[0].value);
      setColor(colorOptions[0].value);

      onOpenChange(false);

      toast({
        title: "Category Added",
        description: `“${newCategory.name}” has been added successfully!`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the category.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDialogClose() {
    setName("");
    setDescription("");
    setIcon(iconOptions[0].value);
    setColor(colorOptions[0].value);
    setIsSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Add New Category
          </DialogTitle>
          <DialogDescription>
            Fill in details for the new forum category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-1 pt-2">
          <div>
            <label htmlFor="category-name" className="text-xs font-medium">Name</label>
            <Input
              id="category-name"
              placeholder="e.g. Self Care"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isSubmitting}
              maxLength={32}
              autoFocus
              required
            />
          </div>
          <div>
            <label htmlFor="category-description" className="text-xs font-medium">Description</label>
            <Input
              id="category-description"
              placeholder="Short description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={isSubmitting}
              maxLength={64}
              required
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="category-icon" className="text-xs font-medium block mb-0.5">Icon</label>
              <select
                id="category-icon"
                className="block w-full border rounded p-1 bg-white text-xs"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                disabled={isSubmitting}
              >
                {iconOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="category-color" className="text-xs font-medium block mb-0.5">Color</label>
              <select
                id="category-color"
                className="block w-full border rounded p-1 bg-white text-xs"
                value={color}
                onChange={e => setColor(e.target.value)}
                disabled={isSubmitting}
              >
                {colorOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              disabled={isSubmitting}
            >
              Add Category
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
