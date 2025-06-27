
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, Moon, Sun, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/contexts/SettingsContext";

export default function AdminSettings() {
  const { toast } = useToast();
  const { user } = useUser();
  const { appearance, toggleDarkMode } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    contentModeration: "strict",
    maintenanceMode: false,
    autoFlagReports: true,
    displayName: user?.username || "Admin"
  });

  useEffect(() => {
    // Load saved settings from localStorage if they exist
    const savedSettings = localStorage.getItem('soulsync_admin_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Save settings to localStorage
    localStorage.setItem('soulsync_admin_settings', JSON.stringify(settings));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your admin settings have been updated successfully.",
      });
    }, 800);
  };

  const handleToggle = (setting: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleInputChange = (setting: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 pt-2 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-black dark:text-white" />
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the admin dashboard looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {appearance.darkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={appearance.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="display-name">Admin Display Name</Label>
                <Input 
                  id="display-name" 
                  value={settings.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  className="max-w-md" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                </div>
                <Switch 
                  id="maintenance-mode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleToggle("maintenanceMode", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, all users except admins will see a maintenance page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
              <CardDescription>
                Control how content moderation works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="email-notifications">Email Notifications for Reports</Label>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleToggle("emailNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <Label htmlFor="auto-flag">Auto-flag Reported Content</Label>
                </div>
                <Switch 
                  id="auto-flag"
                  checked={settings.autoFlagReports}
                  onCheckedChange={(checked) => handleToggle("autoFlagReports", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, reported content will be automatically hidden until reviewed by an admin.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline">Cancel</Button>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading}
          className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
