"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useRegister } from "@/services/auth/auth.queries";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: registerUser, isPending } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signupSchema.safeParse(form);
    
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await registerUser({ ...form, role: "CUSTOMER" });

      if (!response?.token) {
        throw new Error("Signup succeeded but no token returned");
      }

      toast({
        title: "Success",
        description: "Account created! Please verify your OTP.",
      });

      router.push(`/verify-otp?type=register&token=${response.token}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || error?.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border border-gray-200 shadow-2xl rounded-3xl bg-white overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-[#ff5722] to-[#7b1e3a]" />
      <CardHeader className="text-center pt-10 pb-6">
        <CardTitle className="text-3xl font-bold text-[#7b1e3a]">
          Join Choweazy
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign up to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" placeholder="Enter your full name" value={form.name} onChange={handleChange} required className="h-11 rounded-xl bg-gray-50/50 focus:border-[#7b1e3a]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required className="h-11 rounded-xl bg-gray-50/50 focus:border-[#7b1e3a]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required className="h-11 rounded-xl bg-gray-50/50 focus:border-[#7b1e3a]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" name="phone" type="text" placeholder="Enter your phone number" value={form.phone} onChange={handleChange} className="h-11 rounded-xl bg-gray-50/50 focus:border-[#7b1e3a]" />
          </div>
          <Button
            type="submit"
            className="w-full h-12 mt-4 bg-[#7b1e3a] hover:bg-[#66172e] text-white font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98] duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isPending}
          >
             {isPending ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> 
                    Signing up...
                </span>
            ) : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}