
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Bell, AlertCircle, User, Settings, Heart, Plus, X, UserCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/contexts/SettingsContext";
import { useNotifications } from "@/hooks/useNotifications";
import { format } from "date-fns";

interface TopNavbarProps {
  className?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export function TopNavbar({
  className
}: TopNavbarProps) {
  const {
    user,
    logout
  } = useUser();
  const { toast } = useToast();
  const { appearance, avatar } = useSettings();
  const { notifications, markAsRead, clearNotifications } = useNotifications();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, "id">>({
    name: "",
    phone: "",
    relationship: ""
  });
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    const storedContacts = localStorage.getItem('soulsync_emergency_contacts');
    if (storedContacts) {
      setEmergencyContacts(JSON.parse(storedContacts));
    }
  }, []);

  useEffect(() => {
    if (emergencyContacts.length > 0) {
      localStorage.setItem('soulsync_emergency_contacts', JSON.stringify(emergencyContacts));
    }
  }, [emergencyContacts]);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing information",
        description: "Please provide both name and phone number.",
        variant: "destructive"
      });
      return;
    }
    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    };
    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({
      name: "",
      phone: "",
      relationship: ""
    });
    setAddContactOpen(false);
    toast({
      title: "Contact added",
      description: `${contact.name} has been added to your emergency contacts.`
    });
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact removed",
      description: "Emergency contact has been removed."
    });
  };

  const handleClearNotifications = () => {
    clearNotifications();
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared."
    });
  };

  // Make sure notifications is an array before filtering
  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    toast({
      title: "Signed out successfully",
      description: "Come back soon!"
    });
  };

  const getUserIcon = () => {
    if (!user) return <User className="h-4 w-4" />;
    switch (user.role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4" />;
      case 'professional':
        return <UserCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return <>
      <nav className={cn("fixed top-0 left-0 right-0 z-50 h-14 px-3 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/50", className)}>
        <button onClick={() => setCrisisOpen(true)} className="h-8 px-2 bg-crisis text-white rounded-full flex items-center justify-center gap-1 text-xs font-medium hover:bg-crisis-hover transition-colors" aria-label="Crisis Help">
          <AlertCircle className="h-3.5 w-3.5" />
          <span className="mr-0.5">Help</span>
        </button>
        
        <Link to="/" className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
          <div className="h-7 w-7 rounded-full bg-mindscape-primary flex items-center justify-center">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-base font-display font-medium">SoulSync</h1>
        </Link>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setNotificationsOpen(true)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-mindscape-light transition-colors relative" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-mindscape-primary rounded-full"></span>}
          </button>
          
          <button onClick={() => setProfileOpen(true)} className="w-8 h-8 rounded-full border-2 border-mindscape-primary hover:bg-mindscape-light transition-colors overflow-hidden flex items-center justify-center" aria-label="Profile">
            {avatar ? (
              <Avatar className="h-full w-full">
                <AvatarImage src={avatar} alt={user?.username} />
                <AvatarFallback>{getUserIcon()}</AvatarFallback>
              </Avatar>
            ) : (
              getUserIcon()
            )}
          </button>
        </div>
      </nav>
      
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="glassmorphism">
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
          </SheetHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-mindscape-light flex items-center justify-center overflow-hidden border-2 border-mindscape-primary">
              {avatar ? (
                <Avatar className="h-full w-full">
                  <AvatarImage src={avatar} alt={user?.username} />
                  <AvatarFallback>{getUserIcon()}</AvatarFallback>
                </Avatar>
              ) : (
                getUserIcon()
              )}
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-lg">{user?.username || 'Guest'}</h3>
              <p className="text-sm text-muted-foreground">{user?.email || 'Not signed in'}</p>
            </div>
            
            <div className="w-full mt-4 space-y-2">
              <Link to="/profile/settings" className="block w-full p-3 rounded-lg hover:bg-mindscape-light transition-colors flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              
              <Link to="/habit-tracker" className="block w-full p-3 rounded-lg hover:bg-mindscape-light transition-colors">
                Habit Tracker
              </Link>
              <button className="w-full p-3 rounded-lg text-left hover:bg-mindscape-light text-destructive transition-colors" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <Sheet open={crisisOpen} onOpenChange={setCrisisOpen}>
        <SheetContent side="left" className="glassmorphism border-r border-crisis/30">
          <SheetHeader>
            <SheetTitle className="text-crisis">Crisis Help</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p className="text-sm">
              If you're experiencing a mental health emergency, please contact one of these crisis helplines immediately.
            </p>
            
            <div className="space-y-3">
              <div className="card-primary border-crisis/30">
                <h3 className="font-medium">National Mental Health Helpline (India)</h3>
                <a href="tel:+911800599599" className="block text-lg font-semibold text-primary mt-1">
                  1800-599-599
                </a>
              </div>
              
              <div className="card-primary border-crisis/30">
                <h3 className="font-medium">Crisis Text Line</h3>
                <p className="text-sm text-muted-foreground">Text HOME to 741741</p>
              </div>
              
              <div className="card-primary border-crisis/30">
                <h3 className="font-medium">Emergency Services</h3>
                <a href="tel:112" className="block text-lg font-semibold text-primary mt-1">
                  112
                </a>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium mb-2">Personal Emergency Contacts</h4>
              {emergencyContacts.length > 0 ? <div className="space-y-2 mb-3">
                  {emergencyContacts.map(contact => <div key={contact.id} className="p-2 border rounded-lg bg-white flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <div className="flex items-center gap-2">
                          <a href={`tel:${contact.phone}`} className="text-xs text-primary">{contact.phone}</a>
                          {contact.relationship && <span className="text-xs text-muted-foreground">({contact.relationship})</span>}
                        </div>
                      </div>
                      <button onClick={() => handleRemoveContact(contact.id)} className="p-1 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>)}
                </div> : <p className="text-sm text-muted-foreground mb-3">No emergency contacts added yet.</p>}
              <button className="button-secondary w-full flex justify-center items-center gap-1" onClick={() => setAddContactOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Contact
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetContent side="right" className="glassmorphism">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {Array.isArray(notifications) && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map(notification => {
                  const borderColor = notification.type === 'reminder' 
                    ? 'border-mindscape-primary' 
                    : notification.type === 'system' 
                    ? 'border-green-400' 
                    : 'border-blue-400';
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`card-primary border-l-4 ${borderColor} ${!notification.read ? 'bg-mindscape-light/10' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{notification.type}</h3>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notification.date), 'PP')}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{notification.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
            
            {Array.isArray(notifications) && notifications.length > 0 && (
              <div className="pt-4 text-center">
                <button 
                  className="button-secondary" 
                  onClick={handleClearNotifications}
                >
                  Clear All Notifications
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Contact name" value={newContact.name} onChange={e => setNewContact({
              ...newContact,
              name: e.target.value
            })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Phone number" value={newContact.phone} onChange={e => setNewContact({
              ...newContact,
              phone: e.target.value
            })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship (Optional)</Label>
              <Input id="relationship" placeholder="Friend, Family member, etc." value={newContact.relationship} onChange={e => setNewContact({
              ...newContact,
              relationship: e.target.value
            })} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact}>
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
}
