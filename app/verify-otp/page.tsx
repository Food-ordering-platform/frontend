"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // <--- Import useSearchParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useVerifyOtp, useVerifyResetOtp } from "@/services/auth/auth.queries";

// Create a component for the content to wrap in Suspense
function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  // 1. Get params safely using the Hook
  const type = searchParams.get("type") || "register"; // "register" | "reset"
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [code, setCode] = useState("");

  const { mutateAsync: verifyOtp, isPending: isRegisterPending } = useVerifyOtp();
  const { mutateAsync: verifyResetOtp, isPending: isResetPending } = useVerifyResetOtp();

  const isPending = isRegisterPending || isResetPending;

  const otpSchema = z.object({
    token: z.string().min(1, "Missing token"),
    code: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "reset") {
      // RESET PASSWORD FLOW
      if (!token || !email || code.length !== 6) {
        toast({
          title: "Error",
          description: "Email, token, and a valid 6-digit OTP are required",
          variant: "destructive",
        });
        return;
      }

      try {
        const { resetToken } = await verifyResetOtp({ token, code });

        localStorage.setItem("resetTokenFinal", resetToken);

        toast({
          title: "Success",
          description: "OTP verified! You can now reset your password.",
        });

        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to verify OTP",
          variant: "destructive",
        });
      }
    } else {
      // REGISTRATION FLOW
      // This is where you were getting "Missing token" because "type" defaulted here
      const result = otpSchema.safeParse({ token, code });
      
      if (!result.success) {
        toast({
          title: "Error",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      try {
        await verifyOtp({ token, code });
        toast({
          title: "Success",
          description: "Account verified successfully! You can now login.",
        });
        router.push("/login");
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to verify OTP",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <Card className="w-full max-w-md mx-auto border border-[#7b1e3a]/20 shadow-lg bg-white rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#7b1e3a]">
            {type === "reset" ? "Reset Password" : "Verify Account"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter the 6-digit code sent to <b>{email}</b>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="focus:border-[#7b1e3a] focus:ring-[#7b1e3a]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#7b1e3a] hover:bg-[#66172e] text-white font-semibold rounded-full shadow-md"
              disabled={isPending}
            >
              {isPending ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// 2. Wrap in Suspense to prevent build errors with useSearchParams
export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7b1e3a]/10 to-[#66172e]/10 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpContent />
      </Suspense>
    </div>
  );
}