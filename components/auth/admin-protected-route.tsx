// components/auth/admin-protected-route.tsx
"use client";

import { useAuth } from "@/lib/auth-context"; 
import { notFound } from "next/navigation";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Show a neutral spinner while checking credentials so we don't leak info
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b1e3a]"></div>
      </div>
    );
  }

  // 🟢 STEALTH: If no user or not an ADMIN, return the standard 404 page
  if (!user || user.role !== "ADMIN") {
    return notFound(); 
  }

  return <>{children}</>;
}