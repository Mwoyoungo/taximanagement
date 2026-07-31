"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  type FirebaseUser,
} from "@/app/lib/firebase";
import { getUserProfile, createUserProfile, updateUserProfile, type UserProfile } from "@/app/services/userService";

export type UserRole = "Director" | "Super Admin" | "Junior Admin" | "Route Admin" | "Owner" | "Driver";

interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
  isReadOnly: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin user for initial setup
const DEFAULT_ADMIN = {
  email: "admin@taxi.com",
  password: "admin123",
  name: "System Admin",
  role: "Super Admin" as UserRole,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);

        if (profile && profile.isActive) {
          setUser({
            id: profile.uid,
            uid: profile.uid,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            phone: profile.phone,
            isActive: profile.isActive,
          });
        } else if (profile && !profile.isActive) {
          // User is deactivated
          await firebaseSignOut(auth);
          setUser(null);
        } else {
          // No profile found, create one with default role
          const newProfile: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            role: "Owner", // Default role
            isActive: true,
          };
          await createUserProfile(firebaseUser.uid, newProfile);
          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: newProfile.name,
            email: newProfile.email,
            role: newProfile.role,
            isActive: true,
          });
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(userCredential.user.uid);

      if (!profile) {
        await firebaseSignOut(auth);
        return { success: false, error: "User profile not found. Please contact administrator." };
      }

      if (!profile.isActive) {
        await firebaseSignOut(auth);
        return { success: false, error: "Your account has been deactivated. Please contact administrator." };
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, { displayName: name });

      // Create user profile in Firestore
      await createUserProfile(userCredential.user.uid, {
        email,
        name,
        role,
        phone,
        isActive: true,
      });

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Password reset failed";
      return { success: false, error: errorMessage };
    }
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
    await updateUserProfile(uid, { role });
    // If updating current user, refresh user state
    if (user && user.uid === uid) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        logout,
        register,
        resetPassword,
        isAuthenticated: !!user,
        isLoading,
        hasPermission,
        updateUserRole,
        isReadOnly: user?.role === "Driver",
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

export { DEFAULT_ADMIN };
