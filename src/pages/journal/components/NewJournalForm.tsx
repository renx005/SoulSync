
import { useState, useRef, useEffect } from "react";
import { Tag, Heart, Bold, Italic, List, AlignLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JournalEntry } from "@/types/journal";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface NewJournalFormProps {
  onComplete: (entry: JournalEntry) => void;
  onCancel: () => void;
  existingEntry?: JournalEntry;
}

export function NewJournalForm({ onComplete, onCancel, existingEntry }: NewJournalFormProps) {
  const [title, setTitle] = useState(existingEntry?.title || "");
  const [content, setContent] = useState(existingEntry?.content || "");
  const [mood, setMood] = useState(existingEntry?.mood || "");
  const [tags, setTags] = useState<string[]>(existingEntry?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(existingEntry?.favorite || false);
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Update text formatting
  const applyFormatting = (formatType: string) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    let cursorOffset = 0;
    
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'list':
        formattedText = selectedText
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        cursorOffset = 2;
        break;
      default:
        return;
    }
    
    const newContent = 
      content.substring(0, start) + 
      formattedText + 
      content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after the formatting
    setTimeout(() => {
      textarea.focus();
      if (start === end) {
        // If no text was selected, place cursor inside the formatting
        textarea.selectionStart = start + cursorOffset;
        textarea.selectionEnd = start + cursorOffset;
      } else {
        // If text was selected, place cursor after the formatted text
        textarea.selectionStart = start + formattedText.length;
        textarea.selectionEnd = start + formattedText.length;
      }
    }, 0);
  };
  
  const addTag = () => {
    if (!newTag.trim()) return;
    
    if (!tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
    }
    
    setNewTag("");
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please add both a title and content to your journal",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newEntry: JournalEntry = {
        id: existingEntry?.id || Date.now().toString(),
        title,
        content,
        date: new Date().toISOString(),
        mood,
        tags: tags.length > 0 ? tags : undefined,
        favorite: isFavorite
      };
      
      onComplete(newEntry);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: "There was an error saving your journal entry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Common mood options for journal entries
  const moodOptions = [
    "Happy", "Calm", "Excited", "Grateful", "Hopeful", 
    "Mixed", "Anxious", "Sad", "Frustrated", "Overwhelmed"
  ];
  
  // Keyboard shortcut listeners for formatting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            applyFormatting('bold');
            break;
          case 'i':
            e.preventDefault();
            applyFormatting('italic');
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-4">
        <Input
          placeholder="Title your entry"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium border-none focus:ring-0 p-0 h-auto"
        />
        
        <div className="border border-border rounded-lg p-1 space-y-2">
          <div className="flex overflow-x-auto p-1 gap-1 border-b border-border">
            <ToggleGroup type="multiple" className="justify-start">
              <ToggleGroupItem value="bold" aria-label="Bold" onClick={() => applyFormatting('bold')}>
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic" onClick={() => applyFormatting('italic')}>
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List" onClick={() => applyFormatting('list')}>
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="align" aria-label="Align">
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <Textarea
            ref={textAreaRef}
            placeholder="What's on your mind today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none border-none focus:ring-0 p-2"
          />
        </div>
      </div>
      
      <div className="border-t border-border pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">How are you feeling?</h3>
          <div className="w-48">
            <Select 
              value={mood} 
              onValueChange={setMood}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Tags</h3>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="h-9 max-w-[180px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button 
              onClick={addTag} 
              disabled={!newTag.trim()}
              size="sm"
              type="button"
            >
              <Tag className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag} className="bg-mindscape-light text-mindscape-primary rounded-full px-3 py-1 text-xs flex items-center gap-1">
                <span>{tag}</span>
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-border pb-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsFavorite(!isFavorite)}
          className={isFavorite ? "text-red-500" : ""}
        >
          <Heart className={`h-4 w-4 mr-1 ${isFavorite ? "fill-red-500" : ""}`} />
          {isFavorite ? "Favorited" : "Add to Favorites"}
        </Button>
        
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </div>
    </form>
  );
}
