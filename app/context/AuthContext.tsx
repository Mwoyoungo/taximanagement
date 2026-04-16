"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "Director" | "Super Admin" | "Junior Admin" | "Route Admin" | "Owner";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, Record<string, User>> = {
  "director@taxi.com": {
    "password123": { id: "1", name: "James Wilson", email: "director@taxi.com", role: "Director" },
  },
  "admin@taxi.com": {
    "password123": { id: "2", name: "Super Admin", email: "admin@taxi.com", role: "Super Admin" },
  },
  "junior@taxi.com": {
    "password123": { id: "3", name: "Maria Garcia", email: "junior@taxi.com", role: "Junior Admin" },
  },
  "route@taxi.com": {
    "password123": { id: "4", name: "Robert Chen", email: "route@taxi.com", role: "Route Admin" },
  },
  "owner@taxi.com": {
    "password123": { id: "5", name: "Fleet Owner", email: "owner@taxi.com", role: "Owner" },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth on mount
    const stored = localStorage.getItem("taxi_auth");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Demo: allow any email with role selection, or use mock users
    const userForEmail = MOCK_USERS[email]?.[password];
    
    if (userForEmail) {
      setUser(userForEmail);
      localStorage.setItem("taxi_auth", JSON.stringify(userForEmail));
      return true;
    }
    
    // Demo mode: allow login with any email and role selection
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      role,
    };
    setUser(newUser);
    localStorage.setItem("taxi_auth", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("taxi_auth");
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
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
