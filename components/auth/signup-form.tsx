"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useRegister } from "@/services/auth/auth.queries";
import { Loader2 } from "lucide-react";
import Link from "next/link";
// [ADD] Import the Google Button
import { GoogleLoginBtn } from "./google-button";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"), // Shortened text
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
      if (!response?.token) throw new Error("No token returned");

      toast({ title: "Success", description: "Account created! Verify OTP." });
      router.push(`/verify-otp?type=register&token=${response.token}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || error?.message || "Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border border-gray-200 shadow-xl rounded-2xl bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#ff5722] to-[#7b1e3a]" />
      
      {/* [CHANGE] Reduced padding here (pt-6 instead of pt-10) */}
      <CardHeader className="text-center pt-6 pb-2">
        <CardTitle className="text-2xl font-bold text-[#7b1e3a]">
          Join Choweazy
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Create an account to start ordering
        </CardDescription>
      </CardHeader>

      {/* [CHANGE] Reduced horizontal/bottom padding (px-6 pb-6) */}
      <CardContent className="px-6 pb-6">
        {/* [CHANGE] Reduced spacing (space-y-3 instead of 4) */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-medium">Name</Label>
            {/* [CHANGE] Reduced input height (h-9) */}
            <Input id="name" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required className="h-9 rounded-lg bg-gray-50/50 focus:border-[#7b1e3a]" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input id="email" name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handleChange} required className="h-9 rounded-lg bg-gray-50/50 focus:border-[#7b1e3a]" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-medium">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••" value={form.password} onChange={handleChange} required className="h-9 rounded-lg bg-gray-50/50 focus:border-[#7b1e3a]" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs font-medium">Phone (Optional)</Label>
            <Input id="phone" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} className="h-9 rounded-lg bg-gray-50/50 focus:border-[#7b1e3a]" />
          </div>

          <Button
            type="submit"
            // [CHANGE] Reduced button height (h-10) and margin (mt-2)
            className="w-full h-10 mt-2 bg-[#7b1e3a] hover:bg-[#66172e] text-white font-semibold rounded-lg shadow-md text-sm"
            disabled={isPending}
          >
             {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
          </Button>
        </form>

        {/* [ADD] Google Button Section */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-gray-500">Or sign up with</span></div>
        </div>
        <div className="mb-4">
            <GoogleLoginBtn />
        </div>

         <div className="text-center text-xs">
             <p className="text-gray-500">Already have an account? <Link href="/login" className="font-bold text-[#7b1e3a] hover:underline">Sign in</Link></p>
        </div>
      </CardContent>
    </Card>
  );
}