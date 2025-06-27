import { useUser } from "@/contexts/UserContext";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Bell, Camera } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/contexts/SettingsContext";

export default function ProfessionalSettings() {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const { appearance, toggleDarkMode } = useSettings();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [occupation, setOccupation] = useState(user?.occupation || "");
  const [bio, setBio] = useState(localStorage.getItem("soulsync_professional_bio") || "");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    communityNotifications: true,
  });

  const [professionalAvatar, setProfessionalAvatar] = useState<string | undefined>(
    () => user?.id ? localStorage.getItem(`professional-${user.id}-avatar`) ?? undefined : undefined
  );

  useEffect(() => {
    if (user?.id) {
      setProfessionalAvatar(localStorage.getItem(`professional-${user.id}-avatar`) ?? undefined);
    }
  }, [user]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        localStorage.setItem(`professional-${user.id}-avatar`, result);
        setProfessionalAvatar(result);
        toast({ title: "Avatar updated", description: "Your professional profile picture has been updated." });
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

    localStorage.setItem("soulsync_professional_settings", JSON.stringify(settings));
    localStorage.setItem("soulsync_professional_bio", bio);

    setTimeout(() => {
      updateUser({
        username,
        occupation
      });

      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }, 500);
  };

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your professional account and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card className="bg-card border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Avatar</CardTitle>
              <CardDescription>
                Update your professional profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={professionalAvatar || "/assets/professional-avatar.png"} alt={user?.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1 
                      shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Change avatar"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 transition-colors px-3 py-2 rounded-md text-sm">
                      <Upload className="h-4 w-4" />
                      <span>Change avatar</span>
                    </div>
                    <input
                      id="avatar-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription>
                Update your professional profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Display Name</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  value={email} 
                  readOnly
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occupation">Professional Title</Label>
                <Input 
                  id="occupation" 
                  value={occupation} 
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about your professional background and expertise..."
                  className="min-h-32"
                />
              </div>
              
              <Button 
                onClick={handleProfileUpdate} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="bg-card border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about community activity
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on your device
                  </p>
                </div>
                <Switch 
                  id="push-notifications" 
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggle("pushNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="community-notifications">Community Activity</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Notifications about questions and comments
                  </p>
                </div>
                <Switch 
                  id="community-notifications" 
                  checked={settings.communityNotifications}
                  onCheckedChange={() => handleToggle("communityNotifications")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card className="bg-card border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>
                Customize how SoulSync Pro looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {appearance.darkMode ? (
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={appearance.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleProfileUpdate} 
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
