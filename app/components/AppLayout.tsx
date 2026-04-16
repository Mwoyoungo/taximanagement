"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, UserRole } from "../context/AuthContext";
import Sidebar from "./Sidebar";

// Define which roles can access which routes
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/": ["Director", "Super Admin", "Junior Admin", "Route Admin", "Owner"],
  "/taxis": ["Director", "Super Admin", "Owner"],
  "/drivers": ["Director", "Super Admin", "Route Admin", "Owner"],
  "/routes": ["Director", "Super Admin", "Route Admin"],
  "/trips": ["Director", "Super Admin", "Junior Admin", "Route Admin", "Owner"],
  "/users": ["Director", "Super Admin"],
  "/owners": ["Director", "Super Admin"],
};

// Role-specific dashboard titles
const DASHBOARD_TITLES: Record<UserRole, string> = {
  Director: "Director Dashboard",
  "Super Admin": "Admin Dashboard",
  "Junior Admin": "Operations Dashboard",
  "Route Admin": "Route Manager Dashboard",
  Owner: "My Fleet Dashboard",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, hasPermission } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Public routes that don't require auth
  const isPublicRoute = pathname === "/login";

  useEffect(() => {
    // Redirect to login if not authenticated and not on public route
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
    }

    // Redirect to dashboard if already logged in and trying to access login
    if (isAuthenticated && isPublicRoute) {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router, isPublicRoute]);

  // Check permissions for protected routes
  useEffect(() => {
    if (isAuthenticated && !isPublicRoute) {
      const allowedRoles = ROUTE_PERMISSIONS[pathname];
      if (allowedRoles && !hasPermission(allowedRoles)) {
        router.push("/"); // Redirect to dashboard if no permission
      }
    }
  }, [isAuthenticated, pathname, hasPermission, router, isPublicRoute]);

  // Show loading state while checking auth
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#18E299] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Public route - no sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Protected route - show sidebar
  return (
    <div className="flex min-h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">{children}</main>
    </div>
  );
}

// Export for use in pages
export { ROUTE_PERMISSIONS, DASHBOARD_TITLES };
