"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { GoogleLoginBtn } from "./google-button";

// Schema handles the logic validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  // Updated to fix the boolean type error from before
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms to continue",
  }),
});

export function SignupForm() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: "CUSTOMER",
        terms: values.terms,
      });
      // Redirect is handled by context/auth logic usually
    } catch (error: any) {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[450px] mx-auto px-1 sm:px-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          
          {/* NAME FIELD */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-gray-700">Full Name</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                        placeholder="John Doe" 
                        className="pl-11 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 rounded-xl text-base sm:text-sm shadow-sm transition-all"
                        {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* EMAIL FIELD */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                        placeholder="name@example.com" 
                        type="email" 
                        // text-base prevents iOS zoom on focus
                        className="pl-11 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 rounded-xl text-base sm:text-sm shadow-sm transition-all"
                        {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* PHONE FIELD */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-gray-700">Phone Number</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                        placeholder="080 1234 5678" 
                        type="tel" 
                        className="pl-11 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 rounded-xl text-base sm:text-sm shadow-sm transition-all"
                        {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* PASSWORD FIELD */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-11 pr-11 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 rounded-xl text-base sm:text-sm shadow-sm transition-all"
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-10 w-10 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle password visibility</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

         {/* RESPONSIVE TERMS CHECKBOX */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    // 1. shrink-0 prevents the box from squashing
                    // 2. mt-1 aligns it with the first line of text
                    className="shrink-0 mt-0.5 border-gray-300 data-[state=checked]:bg-[#7b1e3a] data-[state=checked]:border-[#7b1e3a] w-5 h-5 rounded-md"
                  />
                </FormControl>
                
                {/* 3. flex-1 forces the text to fill remaining space and WRAP */}
                <div className="space-y-1 leading-normal flex-1">
                  <FormLabel className="text-sm text-gray-600 font-normal block leading-tight">
                    I agree to the{" "}
                    <Link 
                      href="/terms" 
                      className="text-[#7b1e3a] font-semibold hover:underline whitespace-nowrap" 
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link 
                      href="/privacy" 
                      className="text-[#7b1e3a] font-semibold hover:underline whitespace-nowrap" 
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage className="text-xs font-medium text-red-500 block mt-1" />
                </div>
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold text-base shadow-lg shadow-[#7b1e3a]/20 rounded-xl transition-all active:scale-[0.98]" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>
      
      {/* DIVIDER */}
      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-medium tracking-wider">
            Or continue with
          </span>
        </div>
      </div>
      
      {/* GOOGLE BUTTON WRAPPER */}
      <div className="w-full [&_button]:w-full [&_button]:h-12 [&_button]:rounded-xl [&_button]:text-base [&_button]:bg-white [&_button]:border [&_button]:border-gray-200 [&_button]:shadow-sm [&_button]:hover:bg-gray-50">
        <GoogleLoginBtn />
      </div>
    </div>
  );
}