"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useForgotPassword } from "@/services/auth/auth.queries";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          toast({
            title: "OTP Sent",
            description: data?.message || "Check your email for the OTP",
          });

          // Pass type=reset, token (RESET_PASSWORD), email to verify OTP page
          router.push(
            `/verify-otp?type=reset&token=${data.token}&email=${encodeURIComponent(email)}`
          );
        },
        onError: (err: any) => {
          toast({
            title: "Error",
            description: err?.response?.data?.message || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7b1e3a]/10 to-[#66172e]/10 p-4">
      <Card className="w-full max-w-md mx-auto border border-[#7b1e3a]/20 shadow-lg bg-white rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#7b1e3a]">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email and we’ll send you a reset OTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:border-[#7b1e3a] focus:ring-[#7b1e3a]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#7b1e3a] hover:bg-[#66172e] text-white font-semibold rounded-full shadow-md"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
