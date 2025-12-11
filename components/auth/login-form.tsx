"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
      toast({
        title: "Error",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border border-[#7b1e3a]/10 shadow-2xl rounded-3xl bg-white overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-[#7b1e3a] to-[#ff5722]" />
      <CardHeader className="text-center space-y-2 pb-8 pt-10">
        <CardTitle className="text-3xl font-extrabold text-[#7b1e3a]">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-500 text-base">
          Sign in to continue your food journey
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 transition-all bg-gray-50/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Link href="/forgot-password" className="text-sm font-semibold text-[#7b1e3a] hover:underline">
                  Forgot?
                </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 transition-all bg-gray-50/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#7b1e3a] hover:bg-[#66172e] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#7b1e3a]/20 transition-all active:scale-[0.98] duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> 
                    Logging in...
                </span>
            ) : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center">
             <p className="text-gray-500">Don't have an account? <Link href="/signup" className="font-bold text-[#7b1e3a] hover:underline">Sign up</Link></p>
        </div>
      </CardContent>
    </Card>
  );
}