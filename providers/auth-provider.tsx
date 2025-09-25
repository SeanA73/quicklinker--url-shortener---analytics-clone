import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro";
  createdAt: string;
  subscriptionEnd?: string;
  stats?: {
    totalLinks: number;
    totalClicks: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    // Mock login - in real app, this would call your API
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email,
      plan: "free",
      createdAt: new Date().toISOString(),
      stats: {
        totalLinks: 5,
        totalClicks: 127,
      },
    };

    setUser(mockUser);
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    // Mock registration - in real app, this would call your API
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      plan: "free",
      createdAt: new Date().toISOString(),
      stats: {
        totalLinks: 0,
        totalClicks: 0,
      },
    };

    setUser(mockUser);
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout, isLoading }),
    [user, login, register, logout, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}