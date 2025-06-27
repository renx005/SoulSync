import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'user' | 'professional' | 'admin';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  occupation?: string;
  identityDocument?: string;
}

interface UserContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  professionalLogin: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: UserRole, occupation?: string, identityDocument?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
  pendingProfessionals: UserData[];
  verifyProfessional: (professionalId: string) => void;
  rejectProfessional: (professionalId: string) => void;
  registeredUsers: UserData[];
}

// Define the structure of the mock user entries
interface MockUserEntry {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  occupation?: string;
  identityDocument?: string;
}

// Define the structure of the mock users object
interface MockUsers {
  [email: string]: MockUserEntry;
}

const MOCK_USERS_STORAGE_KEY = 'soulsync_users_mock_db';

const initializeMockUsers = (): MockUsers => {
  const storedUsers = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
  
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (error) {
      console.error('Failed to parse stored users:', error);
    }
  }
  
  return {
    'admin@gmail.com': {
      id: 'admin-1',
      username: 'Admin',
      email: 'admin@gmail.com',
      password: '123',
      role: 'admin',
      avatar: '/placeholder.svg',
      isVerified: true
    }
  };
};

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'soulsync_user_v2';
const PENDING_PROFESSIONALS_KEY = 'pending_professionals';
const APPROVED_NOTIFICATIONS_KEY = 'approved_professional_notifications';

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [mockUsers, setMockUsers] = useState<MockUsers>(() => initializeMockUsers());
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingProfessionals, setPendingProfessionals] = useState<UserData[]>([]);
  const { toast } = useToast();

  const registeredUsers = useMemo(() => {
    return Object.values(mockUsers).map((user: MockUserEntry) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      occupation: user.occupation,
      identityDocument: user.identityDocument,
      lastActive: new Date(),
      joinDate: new Date()
    }));
  }, [mockUsers]);

  useEffect(() => {
    localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(mockUsers));
  }, [mockUsers]);

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.email && parsedUser.id) {
            // get correct avatar for the role: user or professional
            let storedAvatar = undefined;
            if (parsedUser.role === "professional") {
              storedAvatar = localStorage.getItem(`professional-${parsedUser.id}-avatar`);
            } else {
              storedAvatar = localStorage.getItem(`user-${parsedUser.id}-avatar`);
            }
            setUser({ ...parsedUser, avatar: storedAvatar || parsedUser.avatar });
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
        
        const savedPendingProfessionals = localStorage.getItem(PENDING_PROFESSIONALS_KEY);
        if (savedPendingProfessionals) {
          setPendingProfessionals(JSON.parse(savedPendingProfessionals));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'professional') {
      const approvedNotifications = localStorage.getItem(APPROVED_NOTIFICATIONS_KEY);
      if (approvedNotifications) {
        try {
          const notifications = JSON.parse(approvedNotifications) as string[];
          if (notifications.includes(user.id)) {
            toast({
              title: "Account Verified",
              description: "Your professional account has been approved by an admin.",
            });
            
            const updatedNotifications = notifications.filter(id => id !== user.id);
            localStorage.setItem(APPROVED_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
          }
        } catch (error) {
          console.error('Failed to process notifications:', error);
        }
      }
    }
  }, [user, toast]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      const storedUser = mockUsers[email];
      if (!storedUser || storedUser.password !== password) {
        throw new Error('Invalid credentials');
      }

      if (storedUser.role === 'admin') {
        throw new Error('Please use the admin login');
      }
      
      if (storedUser.role === 'professional') {
        throw new Error('Please use the professional login');
      }

      const userData: UserData = {
        id: storedUser.id,
        username: storedUser.username,
        email: storedUser.email,
        role: storedUser.role,
        avatar: storedUser.avatar,
        isVerified: storedUser.isVerified,
        occupation: storedUser.occupation,
        identityDocument: storedUser.identityDocument,
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.username}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const professionalLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      const storedUser = mockUsers[email];
      if (!storedUser || storedUser.password !== password) {
        console.log("Invalid credentials: User not found or password mismatch");
        throw new Error('Invalid credentials');
      }

      if (storedUser.role !== 'professional') {
        console.log("Not a professional account:", storedUser.role);
        throw new Error('This login is only for professional accounts');
      }
      
      if (!storedUser.isVerified) {
        console.log("Professional not verified:", storedUser.isVerified);
        throw new Error('Your account is pending verification. Please wait for admin approval.');
      }

      const userData: UserData = {
        id: storedUser.id,
        username: storedUser.username,
        email: storedUser.email,
        role: storedUser.role,
        avatar: storedUser.avatar,
        isVerified: storedUser.isVerified,
        occupation: storedUser.occupation,
        identityDocument: storedUser.identityDocument,
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      toast({
        title: "Welcome back, Professional!",
        description: `Logged in as ${userData.username}`,
      });
    } catch (error) {
      console.error("Professional login error:", error);
      toast({
        variant: "destructive",
        title: "Professional login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (email !== 'admin@gmail.com') {
        throw new Error('Invalid admin credentials');
      }
      
      if (password !== '123') {
        throw new Error('Invalid admin credentials');
      }

      const adminUser = mockUsers['admin@gmail.com'];
      
      const userData: UserData = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: 'admin',
        avatar: adminUser.avatar,
        isVerified: true
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Admin login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    role: UserRole, 
    occupation?: string, 
    identityDocument?: string
  ) => {
    setIsLoading(true);
    try {
      if (!username.trim()) {
        throw new Error('Username is required');
      }
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      if (mockUsers[email]) {
        throw new Error('Email already registered');
      }

      if (role === 'professional' && !occupation) {
        throw new Error('Occupation is required for professional accounts');
      }

      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        role,
        password,
        avatar: '/placeholder.svg',
        isVerified: role === 'user',
        occupation,
        identityDocument,
      };

      const updatedMockUsers = { ...mockUsers, [email]: newUser };
      setMockUsers(updatedMockUsers);
      console.log("User registered:", newUser);
      console.log("Updated mockUsers:", updatedMockUsers);

      if (role === 'professional') {
        const professionalData: UserData = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          isVerified: newUser.isVerified,
          occupation: newUser.occupation,
          identityDocument: newUser.identityDocument,
        };
        
        const updatedPendingList = [...pendingProfessionals, professionalData];
        setPendingProfessionals(updatedPendingList);
        localStorage.setItem(PENDING_PROFESSIONALS_KEY, JSON.stringify(updatedPendingList));
        
        toast({
          title: "Professional Registration Pending",
          description: "Your account will be activated after verification by an admin.",
        });
        
        return;
      }

      toast({
        title: "Account created!",
        description: "You can now sign in with your credentials.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('soulsync_moods');
    localStorage.removeItem('soulsync_habits');
    localStorage.removeItem('soulsync_journal');
    
    toast({
      title: "Logged out",
      description: "Come back soon!",
    });
  };

  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      if (mockUsers[user.email]) {
        const updatedMockUsers = { 
          ...mockUsers, 
          [user.email]: { ...mockUsers[user.email], ...data } 
        };
        setMockUsers(updatedMockUsers);
      }
      
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    }
  };

  const verifyProfessional = (professionalId: string) => {
    const professional = pendingProfessionals.find(p => p.id === professionalId);
    
    if (professional) {
      console.log("Found professional to verify:", professional);
      
      if (mockUsers[professional.email]) {
        const updatedMockUsers = {
          ...mockUsers,
          [professional.email]: {
            ...mockUsers[professional.email],
            isVerified: true
          }
        };
        setMockUsers(updatedMockUsers);
        console.log("Updated professional verification status in mockUsers:", updatedMockUsers[professional.email]);
      } else {
        console.error("Professional not found in mockUsers:", professional.email);
        const updatedMockUsers = {
          ...mockUsers,
          [professional.email]: {
            ...professional,
            password: 'password123',
            isVerified: true
          }
        };
        setMockUsers(updatedMockUsers);
        console.log("Re-added professional to mockUsers:", updatedMockUsers[professional.email]);
      }
      
      try {
        const notifications = JSON.parse(localStorage.getItem(APPROVED_NOTIFICATIONS_KEY) || '[]');
        notifications.push(professional.id);
        localStorage.setItem(APPROVED_NOTIFICATIONS_KEY, JSON.stringify(notifications));
        console.log("Added notification for professional:", professional.id);
      } catch (error) {
        console.error('Failed to store notification:', error);
        localStorage.setItem(APPROVED_NOTIFICATIONS_KEY, JSON.stringify([professional.id]));
      }
      
      const updatedPending = pendingProfessionals.filter(p => p.id !== professionalId);
      setPendingProfessionals(updatedPending);
      localStorage.setItem(PENDING_PROFESSIONALS_KEY, JSON.stringify(updatedPending));
      
      toast({
        title: "Professional Verified",
        description: `${professional.username} has been approved as a professional.`,
      });
    } else {
      console.error("Professional not found in pending list:", professionalId);
    }
  };

  const rejectProfessional = (professionalId: string) => {
    const professional = pendingProfessionals.find(p => p.id !== professionalId);
    const updatedPending = pendingProfessionals.filter(p => p.id !== professionalId);
    
    if (professional) {
      const { [professional.email]: _, ...restMockUsers } = mockUsers;
      setMockUsers(restMockUsers);
      
      setPendingProfessionals(updatedPending);
      localStorage.setItem(PENDING_PROFESSIONALS_KEY, JSON.stringify(updatedPending));
      
      toast({
        title: "Professional Rejected",
        description: `${professional.username}'s professional application has been rejected.`,
      });
    } else {
      setPendingProfessionals(updatedPending);
      localStorage.setItem(PENDING_PROFESSIONALS_KEY, JSON.stringify(updatedPending));
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login,
        professionalLogin,
        adminLogin,
        register, 
        logout, 
        updateUser,
        pendingProfessionals,
        verifyProfessional,
        rejectProfessional,
        registeredUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
