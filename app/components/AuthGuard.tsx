"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/app/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const publicRoutes = ["/login"];

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Allow access to public routes
    if (publicRoutes.includes(pathname)) {
      // If already authenticated, redirect to home
      if (isAuthenticated) {
        router.push("/");
      }
      return;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role permissions
    if (allowedRoles && !allowedRoles.includes(user?.role as UserRole)) {
      router.push("/");
      return;
    }
  }, [isLoading, isAuthenticated, pathname, router, allowedRoles, user?.role]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#ffc93e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Allow rendering of public routes
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if role check fails
  if (allowedRoles && !allowedRoles.includes(user?.role as UserRole)) {
    return null;
  }

  return <>{children}</>;
}
