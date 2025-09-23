"use client";

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
import { useRegister } from "@/services/auth/auth.queries";

// ✅ schema for signup validation
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: registerUser, isPending } = useRegister();

  // ✅ handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ validate form
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
      // ✅ role explicitly set here
      const response = await registerUser({
        ...form,
        role: "CUSTOMER",
      });

      if (!response?.token) {
        throw new Error("Signup succeeded but no token returned");
      }

      toast({
        title: "Success",
        description: "Account created! Please verify your OTP.",
      });

      // ✅ redirect to OTP verification (not login)
      router.push(`/verify-otp?type=register&token=${response.token}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border border-gray-200 shadow-lg bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#7b1e3a]">
          Create an Account
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign up to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#7b1e3a] hover:bg-[#66172e] text-white font-semibold"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
