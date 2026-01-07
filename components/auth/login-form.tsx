"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; 
import { getErrorMessage } from "@/lib/error-utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react"; 
import { GoogleLoginBtn } from "./google-button";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false); // New state to toggle email form

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password,
        clientType: "web",
      });
      // Navigation is handled in AuthContext now
    } catch (error: any) {
      // toast handled in context usually, but safety check
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      
      {/* 1. GOOGLE BUTTON (Primary Option) */}
      <div className="space-y-4">
        <div className="[&>button]:w-full [&>button]:h-12 [&>button]:rounded-xl [&>button]:font-medium [&>button]:border-gray-200 [&>button]:bg-white [&>button]:hover:bg-gray-50 [&>button]:text-gray-700 [&>button]:shadow-sm">
            <GoogleLoginBtn />
        </div>
        <p className="text-center text-xs text-gray-500">
            The easiest way to order your food.
        </p>
      </div>

      {/* 2. DIVIDER */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400 font-medium tracking-wider">
            Or
          </span>
        </div>
      </div>

      {/* 3. EMAIL/PASSWORD FORM (Secondary/Collapsible) */}
      {!showEmailForm ? (
         <Button 
            variant="outline" 
            className="w-full h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#7b1e3a]"
            onClick={() => setShowEmailForm(true)}
         >
            Continue with Email
         </Button>
      ) : (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            
            {/* EMAIL FIELD */}
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem className="space-y-1.5">
                    <FormLabel className="text-gray-700 font-semibold text-xs uppercase">Email</FormLabel>
                    <FormControl>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                        <Input 
                            placeholder="name@example.com" 
                            type="email" 
                            className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/10 transition-all rounded-lg"
                            {...field} 
                        />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            {/* PASSWORD FIELD */}
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                    <FormLabel className="text-gray-700 font-semibold text-xs uppercase">Password</FormLabel>
                    <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-gray-500 hover:text-[#7b1e3a] transition-colors"
                    >
                        Forgot?
                    </Link>
                    </div>
                    <FormControl>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                        <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-9 pr-9 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/10 transition-all rounded-lg"
                        {...field} 
                        />
                        <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-0.5 h-9 w-9 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            {/* SUBMIT BUTTON */}
            <Button 
                type="submit" 
                className="w-full h-11 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold shadow-md shadow-[#7b1e3a]/20 rounded-xl transition-all active:scale-[0.98] mt-2" 
                disabled={isLoading}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
            </Button>
            </form>
        </Form>
      )}
    </div>
  );
}