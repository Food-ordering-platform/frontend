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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import Link from "next/link"; // Import Link
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  // Add Validation for Terms
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
});

export function SignupForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth(); // This calls your context's register function
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      terms: false, // Default unchecked
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Pass 'terms: true' to your existing register function
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: "CUSTOMER",
        terms: values.terms, // <--- Passing the value to context
      });
      // Context handles redirection/toast on success
    } catch (error: any) {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* ... (Keep Name, Email, Phone, Password Fields EXACTLY as they are) ... */}

          {/* NAME FIELD */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-gray-700 font-semibold">Full Name</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                        placeholder="John Doe" 
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 transition-all rounded-xl"
                        {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 font-medium text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-gray-700 font-semibold">Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                        placeholder="name@example.com" 
                        type="email" 
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 transition-all rounded-xl"
                        {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 font-medium text-xs" />
              </FormItem>
            )}
          />

           <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-gray-700 font-semibold">Phone Number</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                        placeholder="08012345678" 
                        type="tel" 
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 transition-all rounded-xl"
                        {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 font-medium text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password" 
                      className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 transition-all rounded-xl"
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 font-medium text-xs" />
              </FormItem>
            )}
          />

          {/* 👇 NEW TERMS CHECKBOX FIELD */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-gray-300 data-[state=checked]:bg-[#7b1e3a] data-[state=checked]:border-[#7b1e3a]"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#7b1e3a] hover:underline font-bold" target="_blank">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#7b1e3a] hover:underline font-bold" target="_blank">
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-11 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold text-base shadow-lg shadow-[#7b1e3a]/25 rounded-xl transition-all active:scale-[0.98] mt-2" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>
      
      {/* ... (Keep Divider and Google Button) ... */}
       <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500 font-medium tracking-wider">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="[&>button]:w-full [&>button]:h-11 [&>button]:rounded-xl [&>button]:font-medium [&>button]:border-gray-200 [&>button]:bg-white [&>button]:hover:bg-gray-50 [&>button]:text-gray-700">
        <GoogleLoginBtn />
      </div>

    </div>
  );
}