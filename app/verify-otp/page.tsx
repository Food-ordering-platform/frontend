"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Or your InputOTP component
import { toast } from "sonner";
import { verifyOtp } from "@/services/auth/auth";
import { useAuth } from "@/lib/auth-context";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth(); // We need this to refresh the user state after verification
  
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get token from URL (sent during signup/login)
  // If you store this in a "temp" localStorage during login, fetch it from there.
  // For now, let's assume it's passed via query param or you saved it in context.
  const tempToken = searchParams.get("token"); 

  const handleVerify = async () => {
    if (!tempToken) {
      toast.error("Invalid session. Please login again.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Verify OTP
      await verifyOtp({
        token: tempToken,
        code,
        clientType: "web", // <--- CRITICAL UPDATE
      });

      toast.success("Account verified!");

      // 2. Refresh Auth Context
      // Since the backend just set a HTTP-Only cookie, the JS doesn't know we are logged in yet.
      // We must tell the AuthContext to hit /auth/me to confirm the session.
      await checkAuth();

      // 3. Redirect
      router.push("/restaurant");

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Verify Account</h1>
          <p className="text-sm text-muted-foreground">
            Enter the code sent to your email.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
             {/* Replace with <InputOTP /> if you have that component */}
             <Input 
                placeholder="123456" 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
          </div>
          <Button disabled={isLoading} onClick={handleVerify}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}