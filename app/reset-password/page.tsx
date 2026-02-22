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
import { useResetPassword } from "@/services/auth/auth.queries";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const resetPasswordMutation = useResetPassword();

  // ✅ Get final reset token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("resetTokenFinal") : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Error",
        description: "Reset token missing. Please restart the flow.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    resetPasswordMutation.mutate(
      { token, newPassword, confirmPassword },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Password reset successful! Please log in.",
          });

          localStorage.removeItem("resetTokenFinal"); // clean up
          router.push("/login");
        },
        onError: (err: any) => {
          toast({
            title: "Error",
            description: err.message || "Something went wrong",
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="focus:border-[#7b1e3a] focus:ring-[#7b1e3a]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus:border-[#7b1e3a] focus:ring-[#7b1e3a]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#7b1e3a] hover:bg-[#66172e] text-white font-semibold rounded-full shadow-md"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
