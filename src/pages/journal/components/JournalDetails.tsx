import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { JournalEntry } from "@/types/journal";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Tag, Trash2 } from "lucide-react";
import { formatRelative } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
interface JournalDetailsProps {
  entry: JournalEntry;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}
export function JournalDetails({
  entry,
  isOpen,
  onClose,
  onToggleFavorite,
  onDelete
}: JournalDetailsProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mediaPreview, setMediaPreview] = useState<{
    type: 'image' | 'audio';
    url: string;
    name?: string;
  } | null>(null);

  // Check screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format content with markdown-like syntax
  const formatContent = (content: string) => {
    // Handle bold text
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle italic text
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle list items
    formattedContent = formattedContent.replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>');
    formattedContent = formattedContent.replace(/<li>.*?<\/li>/g, match => {
      return `<ul class="list-disc pl-5 my-2">${match}</ul>`;
    });

    // Handle line breaks
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    return formattedContent;
  };
  const closeMediaPreview = () => {
    setMediaPreview(null);
  };

  // Use Sheet for mobile and Dialog for desktop
  if (isMobile) {
    return <>
        <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
          <SheetContent side="bottom" className="h-[90%] rounded-t-xl pt-6 overflow-y-auto">
            <SheetHeader className="text-left">
              <div className="flex justify-between items-start">
                <SheetTitle className="text-xl pr-8">{entry.title}</SheetTitle>
                <div className="flex items-center gap-2">
                  
                  <button onClick={() => onToggleFavorite(entry.id)} className="p-1.5 rounded-full hover:bg-mindscape-light/70 transition-colors" aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}>
                    <Heart className={cn("h-5 w-5 transition-colors", entry.favorite ? "fill-red-400 text-red-400" : "text-muted-foreground")} />
                  </button>
                </div>
              </div>
              <SheetDescription className="flex items-center gap-1 text-sm mt-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatRelative(new Date(entry.date), new Date())}
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 animate-fade-in">
              <div className="prose prose-sm max-w-none card-primary p-4 shadow-sm" dangerouslySetInnerHTML={{
              __html: formatContent(entry.content)
            }} />
              
              {(entry.mood || entry.tags && entry.tags.length > 0) && <div className="flex flex-wrap gap-2 mt-4">
                  {entry.mood && <div className="bg-mindscape-primary/10 text-mindscape-primary rounded-full px-3 py-1 text-xs">
                      {entry.mood}
                    </div>}
                  
                  {entry.tags && entry.tags.map(tag => <div key={tag} className="bg-mindscape-light text-mindscape-primary rounded-full px-3 py-1 text-xs flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </div>)}
                </div>}
            </div>
            
            <div className="mt-8 flex justify-between pb-6">
              <Button variant="destructive" size="sm" onClick={() => onDelete(entry.id)} className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Media Preview Dialog */}
        {mediaPreview && <Dialog open={!!mediaPreview} onOpenChange={closeMediaPreview}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{mediaPreview.name || 'Preview'}</DialogTitle>
                <DialogDescription>View your media</DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                {mediaPreview.type === 'image' && <img src={mediaPreview.url} alt={mediaPreview.name || 'Image preview'} className="w-full h-auto rounded-md" />}
                
                {mediaPreview.type === 'audio' && <audio controls src={mediaPreview.url} className="w-full" />}
              </div>
            </DialogContent>
          </Dialog>}
      </>;
  }

  // Desktop version
  return <>
      <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle className="text-2xl">{entry.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <button onClick={() => onDelete(entry.id)} className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors" aria-label="Delete journal entry">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button onClick={() => onToggleFavorite(entry.id)} className="p-1.5 rounded-full hover:bg-mindscape-light/70 transition-colors" aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}>
                  <Heart className={cn("h-5 w-5 transition-colors", entry.favorite ? "fill-red-400 text-red-400" : "text-muted-foreground")} />
                </button>
              </div>
            </div>
            <DialogDescription className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatRelative(new Date(entry.date), new Date())}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 animate-fade-in">
            <div className="prose prose-sm max-w-none card-highlight p-5 rounded-xl shadow-md" dangerouslySetInnerHTML={{
            __html: formatContent(entry.content)
          }} />
            
            {(entry.mood || entry.tags && entry.tags.length > 0) && <div className="flex flex-wrap gap-2 mt-4">
                {entry.mood && <div className="bg-mindscape-primary/10 text-mindscape-primary rounded-full px-3 py-1 text-xs">
                    {entry.mood}
                  </div>}
                
                {entry.tags && entry.tags.map(tag => <div key={tag} className="bg-mindscape-light text-mindscape-primary rounded-full px-3 py-1 text-xs flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </div>)}
              </div>}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Media Preview Dialog */}
      {mediaPreview && <Dialog open={!!mediaPreview} onOpenChange={closeMediaPreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{mediaPreview.name || 'Preview'}</DialogTitle>
              <DialogDescription>View your media</DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              {mediaPreview.type === 'image' && <img src={mediaPreview.url} alt={mediaPreview.name || 'Image preview'} className="w-full h-auto rounded-md" />}
              
              {mediaPreview.type === 'audio' && <audio controls src={mediaPreview.url} className="w-full" />}
            </div>
          </DialogContent>
        </Dialog>}
    </>;
}