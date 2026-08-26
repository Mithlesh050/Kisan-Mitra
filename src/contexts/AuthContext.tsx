
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from './LanguageContext'; // Assuming LanguageContext is in the same directory or correctly aliased

export interface MockUser {
  id: string;
  name: string;
  email?: string; // Optional email
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: MockUser | null;
  login: (userData?: Partial<MockUser>) => void;
  logout: () => void;
  isLoading: boolean; // To simulate async login/logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Initialize to false
  const { toast } = useToast();
  const { translate } = useLanguage();

  // Check localStorage for persisted auth state on mount
  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('kisanMitraUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
    } catch (error) {
        console.error("Error reading user from localStorage", error);
        // Clear potentially corrupted data
        localStorage.removeItem('kisanMitraUser');
    }
  }, []);

  const login = useCallback((userData?: Partial<MockUser>) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUserData: MockUser = {
        id: userData?.id || 'user_123_abc',
        name: userData?.name || translate('demoUser'),
        email: userData?.email || 'demo@example.com',
      };
      setUser(mockUserData);
      setIsAuthenticated(true);
      localStorage.setItem('kisanMitraUser', JSON.stringify(mockUserData));
      toast({
        title: translate('loginSuccessTitle'),
        description: translate('loginSuccessDesc', { userName: mockUserData.name }),
      });
      setIsLoading(false);
    }, 500);
  }, [toast, translate]);

  const logout = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('kisanMitraUser');
      toast({
        title: translate('logoutSuccessTitle'),
        description: translate('logoutSuccessDesc'),
      });
      setIsLoading(false);
    }, 500);
  }, [toast, translate]);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout, isLoading }),
    [isAuthenticated, user, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
