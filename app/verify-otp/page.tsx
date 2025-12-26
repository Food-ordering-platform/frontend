"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useVerifyOtp } from "@/services/auth/auth.queries"; // Using the query hook
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/layout/header";
import { getErrorMessage } from "@/lib/error-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Mail } from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  
  // React Query Mutation
  const { mutateAsync: verifyOtpMutate, isPending } = useVerifyOtp();

  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // [FIX] Read token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("tempToken");
    if (!storedToken) {
      // If no temp token, maybe they are already logged in? 
      // Or they shouldn't be here.
      toast.error("No verification session found. Please login or register again.");
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleVerify = async () => {
    if (!token) return;

    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    try {
      // Use the mutation hook
      const res = await verifyOtpMutate({
        token: token,
        code,
        clientType: "web",
      });

      toast.success("Account verified successfully!");

      // 1. Clean up temp token
      localStorage.removeItem("tempToken");

      // 2. Set the real session token (if returned) or use the one we had
      // The backend usually returns the permanent token in this step
      if (res.token) {
        localStorage.setItem("token", res.token);
      } else {
        // Fallback if backend doesn't return it (though it should)
        localStorage.setItem("token", token);
      }

      // 3. Update Auth Context to fetch user data immediately
      await checkAuth();

      // 4. Redirect
      router.push("/restaurants");

    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to your email address.
              <br />Enter it below to confirm your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="flex justify-center py-4">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full" 
              onClick={handleVerify} 
              disabled={isPending || code.length < 6}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Didn't receive code?{" "}
              <Button variant="link" className="p-0 h-auto font-normal text-primary">
                Resend
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpContent />
    </Suspense>
  );
}