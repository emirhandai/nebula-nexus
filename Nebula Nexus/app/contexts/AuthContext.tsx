'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isBanned: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
    } else if (session?.user) {
      const userData = {
        id: (session.user as { id?: string }).id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: (session.user as { role?: string }).role || 'user',
        isActive: (session.user as { isActive?: boolean }).isActive ?? true,
        isBanned: (session.user as { isBanned?: boolean }).isBanned ?? false,
      };

      // Banlı kullanıcıları otomatik olarak çıkış yaptır
      if (userData.isBanned) {
        console.log('Banlı kullanıcı tespit edildi, otomatik çıkış yapılıyor:', userData.email);
        signOut({ redirect: false });
        setUser(null);
        setIsLoading(false);
        return;
      }

      setUser(userData);
      setIsLoading(false);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [session, status]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Giriş başarısız');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Kayıt başarısız');
      }

      // Kayıt başarılıysa otomatik giriş yap
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'admin', // Admin kontrolü
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 