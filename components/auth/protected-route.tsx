"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation"; 
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    // Wait for the auth check to finish completely
    if (isLoading) return;

    // 1. CHECK: Is User Logged In?
    if (!user) {
      router.push("/login");
      return;
    }

    // 2. CHECK: Does User Have Location?
    const hasLocation = user.address && user.latitude && user.longitude;
    
    // Allow setup page and checkout page to bypass the hard redirect
    // (Checkout page handles missing locations via its own modal)
    const isSetupPage = pathname === "/setup-location";
    const isCheckoutPage = pathname === "/checkout";

    if (!hasLocation && !isSetupPage && !isCheckoutPage) {
      console.log("📍 Missing location. Redirecting to setup...");
      router.push("/setup-location");
    }

  }, [user, isLoading, router, pathname]);

  // Show loader while checking auth (prevents flicker)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" />
      </div>
    );
  }

  // If no user, render nothing (useEffect will redirect)
  if (!user) return null;

  // Prevent "Flash of Content"
  const hasLocation = user.address && user.latitude && user.longitude;
  const isSetupPage = pathname === "/setup-location";
  const isCheckoutPage = pathname === "/checkout";

  // Hide the children so they don't see a flash of the dashboard before redirecting,
  // UNLESS they are on the setup page or checkout page.
  if (!hasLocation && !isSetupPage && !isCheckoutPage) {
      return null; 
  }

  return <>{children}</>;
}