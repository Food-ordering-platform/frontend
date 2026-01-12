"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation"; // ✅ Added usePathname
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // ✅ Get the current page path

  useEffect(() => {
    // Wait for the auth check to finish completely
    if (isLoading) return;

    // 1. CHECK: Is User Logged In?
    if (!user) {
      router.push("/login");
      return;
    }

    // 2. CHECK: Does User Have Location?
    // We check if address or coordinates are missing
    const hasLocation = user.address && user.latitude && user.longitude;
    
    // We must ensure we are NOT already on the setup page (to prevent infinite loop)
    const isSetupPage = pathname === "/setup-location";

    if (!hasLocation && !isSetupPage) {
      console.log("📍 Missing location. Redirecting to setup...");
      router.push("/setup-location");
    }

  }, [user, isLoading, router, pathname]);

  // ✅ Show loader while checking auth (prevents flicker)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" />
      </div>
    );
  }

  // If no user, render nothing (useEffect will redirect)
  if (!user) return null;

  // ✅ Prevent "Flash of Content"
  // If the user has no location and isn't on the setup page, hide the children
  // so they don't see the dashboard for a split second before redirecting.
  const hasLocation = user.address && user.latitude && user.longitude;
  if (!hasLocation && pathname !== "/setup-location") {
      return null; 
  }

  return <>{children}</>;
}