import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, AuthMethod } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  socialLogin: (user: User) => void;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  shopName?: string;
  marketLocation?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'agripresyo_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = user !== null;

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, _password: string, role: UserRole) => {
    // Mock login — accepts any credentials
    await new Promise((resolve) => setTimeout(resolve, 800));

    const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const newUser: User = {
      email,
      name: name || 'User',
      role,
      authMethod: 'email',
      isVerified: false,
      verificationStatus: 'none',
    };

    setUser(newUser);
  }, []);

  const socialLogin = useCallback((socialUser: User) => {
    const userWithDefaults: User = {
      ...socialUser,
      isVerified: socialUser.isVerified ?? false,
      verificationStatus: socialUser.verificationStatus ?? 'none',
      shopName: socialUser.shopName || (socialUser.role === 'vendor' ? `${socialUser.name}'s Shop` : undefined),
    };
    setUser(userWithDefaults);
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    // Mock signup — accepts any data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      email: data.email,
      name: data.name,
      role: data.role,
      authMethod: 'email',
      shopName: data.shopName,
      marketLocation: data.marketLocation,
      isVerified: false,
      verificationStatus: 'none',
    };

    setUser(newUser);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, socialLogin, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
