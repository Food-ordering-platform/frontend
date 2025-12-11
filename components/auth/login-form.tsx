"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { GoogleLoginBtn } from "./google-button";

const loginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      toast({ title: "Error", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    try {
      const success = await login({ email, password });
      if (success) {
        toast({ title: "Success", description: "Logged in successfully!" });
        router.push("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to log in", variant: "destructive" });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border border-[#7b1e3a]/10 shadow-xl rounded-2xl bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#7b1e3a] to-[#ff5722]" />
      
      {/* [CHANGE] Reduced padding (pt-8 instead of 10) */}
      <CardHeader className="text-center space-y-1 pb-4 pt-8">
        <CardTitle className="text-2xl font-bold text-[#7b1e3a]">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Sign in to continue your food journey
        </CardDescription>
      </CardHeader>

      {/* [CHANGE] Reduced padding (px-6 pb-8) */}
      <CardContent className="px-6 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-gray-700">Email Address</Label>
            {/* [CHANGE] Reduced input height (h-10) */}
            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10 rounded-lg border-gray-200 focus:border-[#7b1e3a] bg-gray-50/50" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-xs font-medium text-gray-700">Password</Label>
              <Link href="/forgot-password" className="text-xs font-semibold text-[#7b1e3a] hover:underline">Forgot?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-10 rounded-lg border-gray-200 focus:border-[#7b1e3a] bg-gray-50/50" />
          </div>

          <Button type="submit" className="w-full h-10 bg-[#7b1e3a] hover:bg-[#66172e] text-white font-bold text-sm rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70" disabled={isLoading}>
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing in...</> : "Sign In"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
        </div>

        <div className="mb-6">
            <GoogleLoginBtn />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Don't have an account? <Link href="/signup" className="font-bold text-[#7b1e3a] hover:underline">Sign up</Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}