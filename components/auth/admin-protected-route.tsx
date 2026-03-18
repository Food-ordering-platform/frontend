// components/auth/admin-protected-route.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context"; 
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run checks when the context has finished loading
    if (!isLoading) {
      if (!user) {
        // Not logged in? Send to login page
        router.replace("/login"); 
      } else if (user.role !== "ADMIN") {
        // Logged in, but NOT an admin? Kick them to the main customer site!
        // We use window.location to force a full redirect away from the subdomain
        window.location.href = "https://choweazy.com"; 
      }
    }
  }, [isLoading, user, router]);

  // Show a secure loading state while checking credentials
  // We check !user here instead of !isAuthenticated
  if (isLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ShieldAlert className="h-12 w-12 text-[#7b1e3a] animate-pulse mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Verifying Admin Credentials...</h2>
      </div>
    );
  }

  // If they pass all checks, render the dashboard!
  return <>{children}</>;
}