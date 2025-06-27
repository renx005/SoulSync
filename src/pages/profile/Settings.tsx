import { useState, useRef, useEffect } from "react";
import { Palette, Bell, User, Shield, HelpCircle, Info, Moon, Sun, ChevronRight, Check, Upload, Camera, ExternalLink, Heart } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSettings, themeOptions } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export default function Settings() {
  const {
    user,
    updateUser
  } = useUser();
  const {
    toast
  } = useToast();
  const {
    appearance,
    notifications,
    toggleDarkMode,
    setTheme,
    toggleNotification
  } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  // SEPARATE USER AVATAR STATE (persisted independently for user mode)
  const [userAvatar, setUserAvatar] = useState<string | undefined>(
    () => user?.id ? localStorage.getItem(`user-${user.id}-avatar`) ?? user.avatar : user?.avatar
  );

  useEffect(() => {
    if (user?.id) {
      setUserAvatar(localStorage.getItem(`user-${user.id}-avatar`) ?? user.avatar);
    }
  }, [user]);
  
  // Avatar upload handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Invalid file type", description: "Please select an image file." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Please select an image under 2MB." });
      return;
    }
    // Read file
    const reader = new FileReader();
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Avatar upload failed",
        description: "There was an error reading the image file."
      });
    };
    reader.onloadend = () => {
      try {
        const result = reader.result as string;
        if (!user?.id) throw new Error("User not found!");
        localStorage.setItem(`user-${user.id}-avatar`, result);
        setUserAvatar(result);
        updateUser({ avatar: result });
        toast({ title: "Avatar updated", description: "Your profile picture has been updated." });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: err instanceof Error ? err.message : "Unknown error"
        });
      }
    };
    reader.readAsDataURL(file);
  };
  const handleProfileUpdate = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    }, 800);
  };
  return <div className="space-y-6 pb-8">
      <header>
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </header>
      
      {/* Account section */}
      <section className="card-primary space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="h-16 w-16 border-2 border-mindscape-primary">
              <AvatarImage src={userAvatar} alt={user?.username} />
              <AvatarFallback className="bg-mindscape-light text-mindscape-primary">
                {user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1 
                shadow-md opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Change avatar">
              <Camera className="h-3 w-3" />
            </button>
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>
          
          <div>
            <p className="font-medium">{user?.username}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <button className="text-xs text-primary mt-1" onClick={() => fileInputRef.current?.click()}>
              Change Profile Picture
            </button>
          </div>
        </div>
        
        
      </section>
      
      {/* Appearance section */}
      <section className="card-primary space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Palette className="h-5 w-5 text-mindscape-primary" />
          <span>Appearance</span>
        </h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {appearance.darkMode ? <Moon className="h-5 w-5 text-indigo-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <Switch id="dark-mode" checked={appearance.darkMode} onCheckedChange={toggleDarkMode} />
        </div>
        
        
      </section>
      
      {/* Notifications section */}
      <section className="card-primary space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-mindscape-primary" />
          <span>Notifications</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mood-reminders">Daily Mood Check-in Reminders</Label>
            <Switch id="mood-reminders" checked={notifications.moodReminders} onCheckedChange={() => toggleNotification('moodReminders')} />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="journal-reminders">Journal Reminders</Label>
            <Switch id="journal-reminders" checked={notifications.journalReminders} onCheckedChange={() => toggleNotification('journalReminders')} />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="community-updates">Community Updates</Label>
            <Switch id="community-updates" checked={notifications.communityUpdates} onCheckedChange={() => toggleNotification('communityUpdates')} />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="new-content">New Content Notifications</Label>
            <Switch id="new-content" checked={notifications.newContent} onCheckedChange={() => toggleNotification('newContent')} />
          </div>
        </div>
      </section>
      
      {/* Help & About section */}
      <section className="card-primary space-y-2">
        <h2 className="text-lg font-semibold mb-2">Help & About</h2>
        
        <button className="w-full p-3 text-left rounded-lg hover:bg-mindscape-light/50 transition-all flex items-center justify-between" onClick={() => setShowHelpCenter(true)}>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-mindscape-primary" />
            <span>Help Center</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <button className="w-full p-3 text-left rounded-lg hover:bg-mindscape-light/50 transition-all flex items-center justify-between" onClick={() => setShowAbout(true)}>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-mindscape-primary" />
            <span>About SoulSync</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <div className="pt-4 text-center text-xs text-muted-foreground">
          <p>SoulSync v1.0.0</p>
          <p className="mt-1">© 2025 SoulSync. All rights reserved.</p>
        </div>
      </section>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-mindscape-primary hover:bg-mindscape-primary/90" onClick={handleProfileUpdate} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Help Center Modal */}
      <Dialog open={showHelpCenter} onOpenChange={setShowHelpCenter}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-mindscape-primary" />
              Help Center
            </DialogTitle>
            <DialogDescription>
              Find answers to frequently asked questions and learn how to get the most out of SoulSync.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="mt-4 max-h-[60vh] pr-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I track my mood?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Tracking your mood is easy with SoulSync:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Go to the Home page by clicking on the Home icon in the bottom navigation.</li>
                    <li>Find the "How are you feeling today?" section.</li>
                    <li>Select the emoji that best represents your current mood.</li>
                    <li>Optionally add a note about why you feel this way.</li>
                    <li>Your mood will be saved and tracked over time to help identify patterns.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do I create a journal entry?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">To create a new journal entry:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Navigate to the Journal tab from the bottom navigation.</li>
                    <li>Click on the "New Entry" button.</li>
                    <li>Write your thoughts, feelings, or experiences in the provided text area.</li>
                    <li>Add a title to your entry.</li>
                    <li>You can tag your entry with relevant keywords for easier searching later.</li>
                    <li>Click "Save" to store your journal entry.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I track habits?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">SoulSync helps you build positive habits:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Navigate to the Habit Tracker from your profile or home screen.</li>
                    <li>Click "Add New Habit" to create a habit you want to develop.</li>
                    <li>Name your habit and set your target frequency.</li>
                    <li>Each day, mark your habit as complete when you've done it.</li>
                    <li>View your progress over time and maintain your streaks!</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How do mindfulness exercises work?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">To use the mindfulness features:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Go to the Mindful section using the bottom navigation.</li>
                    <li>Choose between Breathing exercises or Guided Mindfulness sessions.</li>
                    <li>Select an exercise that matches your current needs and time availability.</li>
                    <li>Follow the on-screen instructions to complete the exercise.</li>
                    <li>Your mindfulness practice will be tracked in your insights.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How do I use the Community features?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">The SoulSync community is a safe space to connect with others:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Navigate to the Community tab from the bottom navigation.</li>
                    <li>Browse different categories or search for specific topics.</li>
                    <li>Read posts from other users or professionals.</li>
                    <li>Create your own post by clicking "New Post".</li>
                    <li>Comment on posts to engage with other community members.</li>
                    <li>Remember to follow our community guidelines for respectful interactions.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How is my data protected?</AccordionTrigger>
                <AccordionContent>
                  <p>SoulSync takes your privacy seriously:</p>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>All your personal data is encrypted and stored securely.</li>
                    <li>Your journal entries and mood data are private by default.</li>
                    <li>You control what information is shared with the community.</li>
                    <li>We never sell your data to third parties.</li>
                    <li>You can export or delete your data at any time from the settings page.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-6 p-4 bg-mindscape-light/50 rounded-lg">
              <h3 className="font-medium mb-2">Need more help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you couldn't find an answer to your question, please contact our support team.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowHelpCenter(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* About SoulSync Modal */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-mindscape-primary" />
              About SoulSync
            </DialogTitle>
            <DialogDescription>
              Your personal mental well-being companion
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="mt-4 max-h-[60vh] pr-4">
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-mindscape-primary flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  SoulSync was created with a simple mission: to make mental well-being accessible to everyone. 
                  We believe that by providing tools for self-reflection, mindfulness, and community support, 
                  people can build healthier relationships with themselves and others.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-mindscape-light flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <div>
                      <span className="font-medium">Mood Tracking</span>
                      <p className="text-sm text-muted-foreground">Record and visualize your emotional patterns over time</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-mindscape-light flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <div>
                      <span className="font-medium">Digital Journal</span>
                      <p className="text-sm text-muted-foreground">Express your thoughts in a private, secure digital space</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-mindscape-light flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div>
                      <span className="font-medium">Mindfulness Exercises</span>
                      <p className="text-sm text-muted-foreground">Practice breathing and meditation techniques for stress reduction</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-mindscape-light flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <div>
                      <span className="font-medium">Habit Tracking</span>
                      <p className="text-sm text-muted-foreground">Build positive routines that support your mental health</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-mindscape-light flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium">5</span>
                    </div>
                    <div>
                      <span className="font-medium">Community Support</span>
                      <p className="text-sm text-muted-foreground">Connect with others on similar journeys in a safe environment</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              
              
              <div>
                <h3 className="text-lg font-medium mb-2">Privacy Commitment</h3>
                <p className="text-muted-foreground">
                  We believe your mental health data is deeply personal. That's why SoulSync was built with 
                  privacy as a core principle. Your data is encrypted, stored securely, and never sold to 
                  third parties. You have complete control over what you share and with whom.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Version Information</h3>
                <div className="bg-mindscape-light/50 p-3 rounded-lg">
                  <p className="text-sm">SoulSync v1.0.0</p>
                  <p className="text-xs text-muted-foreground mt-1">Released: April 2025</p>
                  <p className="text-xs text-muted-foreground">Last Updated: April 22, 2025</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Legal</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Terms of Service
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Policy
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Cookie Policy
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground pt-2 pb-4">
                <p>© 2025 SoulSync. All rights reserved.</p>
                <p className="mt-1">Made with ❤️ for mental well-being</p>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowAbout(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
