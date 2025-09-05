import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockUsers, 
  currentUser, 
  setCurrentUser, 
  isAuthenticated as mockIsAuthenticated,
  type MockUser 
} from '../data/mockData';

interface AuthContextType {
  user: MockUser | null;
  profile: MockUser | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<MockUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setUser(currentUser);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user (in real app, this would be handled by Supabase)
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: fullName,
      role: 'student',
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    setCurrentUser(newUser);
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // In a real app, you'd verify the password here
    setCurrentUser(foundUser);
    setUser(foundUser);
  };

  const signOut = async () => {
    setCurrentUser(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<MockUser>) => {
    if (!user) return;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = { ...user, ...updates };
    
    // Update in mock data
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }

    setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  const value = {
    user,
    profile: user,
    session: user ? { user } : null,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}