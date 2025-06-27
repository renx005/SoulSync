
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Define the theme options
export const themeOptions = [
  { name: "Purple", value: "purple", color: "#9b87f5", bgColor: "#E5DEFF" },
  { name: "Green", value: "green", color: "#85D996", bgColor: "#F2FCE2" },
  { name: "Yellow", value: "yellow", color: "#FFD466", bgColor: "#FEF7CD" },
  { name: "Orange", value: "orange", color: "#FFA35C", bgColor: "#FEC6A1" },
  { name: "Pink", value: "pink", color: "#FF9FB6", bgColor: "#FFDEE2" },
  { name: "Peach", value: "peach", color: "#FFBB9A", bgColor: "#FDE1D3" },
  { name: "Blue", value: "blue", color: "#7CC4FA", bgColor: "#D3E4FD" }
];

// Settings types
export interface NotificationSettings {
  moodReminders: boolean;
  journalReminders: boolean;
  communityUpdates: boolean;
  newContent: boolean;
}

export interface AppearanceSettings {
  darkMode: boolean;
  theme: typeof themeOptions[0];
}

export interface SettingsContextType {
  // Appearance
  appearance: AppearanceSettings;
  toggleDarkMode: () => void;
  setTheme: (theme: typeof themeOptions[0]) => void;
  
  // Notifications
  notifications: NotificationSettings;
  toggleNotification: (key: keyof NotificationSettings) => void;
  
  // Avatar
  avatar: string | null;
  updateAvatar: (url: string) => void;
  
  // Save all settings
  saveSettings: () => void;
}

const defaultSettings: SettingsContextType = {
  appearance: {
    darkMode: false,
    theme: themeOptions[0],
  },
  notifications: {
    moodReminders: true,
    journalReminders: true,
    communityUpdates: true,
    newContent: true,
  },
  avatar: null,
  toggleDarkMode: () => {},
  setTheme: () => {},
  toggleNotification: () => {},
  updateAvatar: () => {},
  saveSettings: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Omit<SettingsContextType, 'toggleDarkMode' | 'setTheme' | 'toggleNotification' | 'updateAvatar' | 'saveSettings'>>({
    appearance: {
      darkMode: localStorage.getItem('soulsync_darkMode') === 'true',
      theme: JSON.parse(localStorage.getItem('soulsync_theme') || JSON.stringify(themeOptions[0])),
    },
    notifications: JSON.parse(localStorage.getItem('soulsync_notifications') || JSON.stringify(defaultSettings.notifications)),
    avatar: localStorage.getItem('soulsync_avatar'),
  });

  // Apply dark mode effect
  useEffect(() => {
    if (settings.appearance.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.appearance.darkMode]);

  // Apply theme effect
  useEffect(() => {
    const theme = settings.appearance.theme;
    document.documentElement.style.setProperty('--theme-primary', theme.color);
    document.documentElement.style.setProperty('--theme-light', theme.bgColor);
  }, [settings.appearance.theme]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        darkMode: !prev.appearance.darkMode
      }
    }));
    
    // Save to localStorage
    localStorage.setItem('soulsync_darkMode', (!settings.appearance.darkMode).toString());
    
    toast({
      title: settings.appearance.darkMode ? "Light mode enabled" : "Dark mode enabled",
      description: "Your display preference has been updated.",
    });
  };

  // Set theme
  const setTheme = (theme: typeof themeOptions[0]) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme
      }
    }));
    
    // Save to localStorage
    localStorage.setItem('soulsync_theme', JSON.stringify(theme));
    
    toast({
      title: "Theme updated",
      description: `Your theme has been changed to ${theme.name}.`,
    });
  };

  // Toggle notification
  const toggleNotification = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
    
    // Save to localStorage (with the updated state)
    const updatedNotifications = {
      ...settings.notifications,
      [key]: !settings.notifications[key]
    };
    localStorage.setItem('soulsync_notifications', JSON.stringify(updatedNotifications));
    
    toast({
      title: "Notification settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} notifications ${settings.notifications[key] ? 'disabled' : 'enabled'}.`,
    });
  };

  // Update avatar
  const updateAvatar = (url: string) => {
    setSettings(prev => ({
      ...prev,
      avatar: url
    }));
    
    // Save to localStorage
    localStorage.setItem('soulsync_avatar', url);
    
    toast({
      title: "Avatar updated",
      description: "Your profile picture has been updated.",
    });
  };

  // Save all settings
  const saveSettings = () => {
    // Save all settings to localStorage
    localStorage.setItem('soulsync_darkMode', settings.appearance.darkMode.toString());
    localStorage.setItem('soulsync_theme', JSON.stringify(settings.appearance.theme));
    localStorage.setItem('soulsync_notifications', JSON.stringify(settings.notifications));
    if (settings.avatar) {
      localStorage.setItem('soulsync_avatar', settings.avatar);
    }
    
    toast({
      title: "Settings saved",
      description: "All your settings have been saved.",
    });
  };

  return (
    <SettingsContext.Provider 
      value={{
        ...settings,
        toggleDarkMode,
        setTheme,
        toggleNotification,
        updateAvatar,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
