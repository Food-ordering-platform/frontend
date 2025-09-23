"use client";

import type React from "react";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useVerifyOtp } from "@/services/auth/auth.queries";

export default function VerifyOtpPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token || "";
  const [code, setCode] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: verifyOtp, isPending } = useVerifyOtp();

  const otpSchema = z.object({
    token: z.string().min(1, "Missing token"),
    code: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const res = await verifyOtp({ token, code });

      toast({ title: "Success", description: "Account verified successfully!" });

      // 👇 Redirect based on role
      if (res.user?.role === "VENDOR") {
        router.push("/dashboard/login"); // or vendor signup completion page
      } else {
        router.push("/login"); // default for customers
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to verify OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="w-full max-w-md mx-auto border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gradient-red">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email/phone
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
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-red hover:bg-gradient-red-light" disabled={isPending}>
                {isPending ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
