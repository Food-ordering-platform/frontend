"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useVerifyOtp, useVerifyResetOtp } from "@/services/auth/auth.queries"; 
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
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
  
  // 1. Check if we are in "Reset Password" mode or "Signup Verification" mode
  const type = searchParams.get("type");
  const isResetMode = type === "reset";

  const { mutateAsync: verifyOtpMutate, isPending: isVerifyPending } = useVerifyOtp();
  const { mutateAsync: verifyResetOtpMutate, isPending: isResetPending } = useVerifyResetOtp();

  const isPending = isVerifyPending || isResetPending;

  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 2. Decide where to get the token from
    if (isResetMode) {
      // Case A: Forgot Password (Token is in URL)
      const urlToken = searchParams.get("token");
      if (!urlToken) {
        toast.error("Invalid reset link. Please try again.");
        router.push("/forgot-password");
      } else {
        setToken(urlToken);
      }
    } else {
      // Case B: Signup (Token is in LocalStorage)
      const storedToken = localStorage.getItem("tempToken");
      if (!storedToken) {
        toast.error("No verification session found. Please login or register again.");
        router.push("/login");
      } else {
        setToken(storedToken);
      }
    }
  }, [router, isResetMode, searchParams]);

  const handleVerify = async () => {
    if (!token) return;

    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    try {
      if (isResetMode) {
        // ----------------- RESET PASSWORD FLOW -----------------
        const res = await verifyResetOtpMutate({
          token: token,
          code,
        });

        toast.success("OTP Verified! Please set your new password.");
        
        // Redirect to Reset Password page with the NEW token (resetToken)
        router.push(`/reset-password?token=${res.resetToken}`);

      } else {
        // ----------------- SIGNUP FLOW -----------------
        const res = await verifyOtpMutate({
          token: token,
          code,
          clientType: "web",
        });

        toast.success("Account verified successfully!");
        localStorage.removeItem("tempToken");

        if (res.token) {
          localStorage.setItem("token", res.token);
        } else {
          localStorage.setItem("token", token);
        }

        await checkAuth();
        router.push("/restaurants");
      }

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
            <CardTitle className="text-2xl font-bold">
              {isResetMode ? "Reset Password" : "Verify your email"}
            </CardTitle>
            <CardDescription>
              We've sent a 6-digit code to your email.
              <br />Enter it below to continue.
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
                "Verify Code"
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