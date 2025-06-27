
import { useState, useRef } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { ForumPost } from "@/types/community";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Image, Link2, Plus, X, Youtube } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewPostSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: ForumPost) => void;
  categoryId: string;
  categoryName: string;
  editPost?: ForumPost;
}

export function NewPostSheet({ isOpen, onClose, onSubmit, categoryId, categoryName, editPost }: NewPostSheetProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [title, setTitle] = useState(editPost?.title || "");
  const [content, setContent] = useState(editPost?.content || "");
  const [isAnonymous, setIsAnonymous] = useState(editPost?.isAnonymous || (user?.role === "user"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(editPost?.images || []);
  const [mediaType, setMediaType] = useState<"image" | "video" | "link">("image");
  const [mediaInput, setMediaInput] = useState("");
  const [videoLinks, setVideoLinks] = useState<string[]>(editPost?.videoLinks || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a title and content for your post",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create post object
    const postData: ForumPost = {
      id: editPost?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      categoryId,
      categoryName,
      author: isAnonymous ? "Anonymous" : (user?.username || "Unknown"),
      authorId: user?.id || "unknown",
      authorRole: user?.role || "user",
      date: editPost?.date || new Date(),
      replies: editPost?.replies || 0,
      isAnonymous,
      likes: editPost?.likes || 0,
      images: images.length > 0 ? images : undefined,
      videoLinks: videoLinks.length > 0 ? videoLinks : undefined,
      isEdited: editPost ? true : false,
      lastEditedDate: editPost ? new Date() : undefined
    };
    
    onSubmit(postData);
    
    // Reset form
    setTitle("");
    setContent("");
    setIsAnonymous(user?.role === "user");
    setImages([]);
    setVideoLinks([]);
    setMediaInput("");
    setIsSubmitting(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Read the file and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImages([...images, base64String]);
      toast({
        title: "Image added",
        description: "Your image has been added to the post",
      });
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const addMedia = () => {
    if (!mediaInput.trim()) return;
    
    switch (mediaType) {
      case "image":
        // Trigger file input click
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        break;
        
      case "video":
        // Basic YouTube validation
        if (mediaInput.includes("youtube.com") || mediaInput.includes("youtu.be")) {
          if (!videoLinks.includes(mediaInput.trim())) {
            setVideoLinks([...videoLinks, mediaInput.trim()]);
            toast({
              title: "YouTube video added",
              description: "Video will be embedded in your post",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Invalid YouTube link",
            description: "Please enter a valid YouTube URL",
          });
        }
        break;
        
      case "link":
        if (!videoLinks.includes(mediaInput.trim())) {
          setVideoLinks([...videoLinks, mediaInput.trim()]);
          toast({
            title: "Link added",
            description: "Link added to your post",
          });
        }
        break;
    }
    
    setMediaInput("");
  };
  
  const removeImage = (imageUrl: string) => {
    setImages(images.filter(img => img !== imageUrl));
  };
  
  const removeLink = (link: string) => {
    setVideoLinks(videoLinks.filter(vl => vl !== link));
  };
  
  // Function to check if a link is from YouTube
  const isYouTubeLink = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="sm:max-w-md w-[95%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editPost ? "Edit Post" : "Create New Post"}</SheetTitle>
          <SheetDescription>
            {editPost ? "Edit your post in" : "Post in"} {categoryName}
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Add Media (Optional)</Label>
            
            <div className="flex gap-2">
              <Select 
                value={mediaType} 
                onValueChange={(value) => setMediaType(value as "image" | "video" | "link")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">YouTube</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1 flex gap-2">
                {mediaType === "image" ? (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center gap-2"
                    >
                      <Image className="h-4 w-4" />
                      <span>Choose Image</span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      placeholder={
                        mediaType === "video"
                          ? "Paste YouTube URL"
                          : "Paste URL"
                      }
                      value={mediaInput}
                      onChange={(e) => setMediaInput(e.target.value)}
                      type="url"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addMedia}
                      disabled={!mediaInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Preview area */}
            <div className="space-y-3">
              {/* Images preview */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Images</Label>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-input">
                        <img src={img} alt="Post attachment" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Links preview */}
              {videoLinks.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Links</Label>
                  <div className="space-y-2">
                    {videoLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-accent/50 p-2 rounded text-sm">
                        <div className="flex items-center truncate">
                          {isYouTubeLink(link) ? (
                            <Youtube className="h-3.5 w-3.5 mr-2 text-red-500" />
                          ) : (
                            <Link2 className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          )}
                          <span className="truncate max-w-[180px]">{link}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLink(link)}
                          className="text-muted-foreground hover:text-destructive ml-2 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {user?.role === "user" && (
            <div className="flex items-center justify-between">
              <Label htmlFor="anonymous" className="cursor-pointer">Post anonymously</Label>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (editPost ? "Updating..." : "Posting...") : (editPost ? "Update" : "Post")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
