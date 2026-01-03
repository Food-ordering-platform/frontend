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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      
      router.push("/restaurants");

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          {/* EMAIL FIELD */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
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
                <FormMessage className="text-red-500 font-medium" />
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
                  <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#7b1e3a] hover:text-[#60152b] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a] transition-colors" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
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
                <FormMessage className="text-red-500 font-medium" />
              </FormItem>
            )}
          />

          {/* SUBMIT BUTTON */}
          <Button 
            type="submit" 
            className="w-full h-11 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold text-base shadow-lg shadow-[#7b1e3a]/25 rounded-xl transition-all active:scale-[0.98]" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Sign In
          </Button>
        </form>
      </Form>
      
      {/* DIVIDER */}
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
      
      {/* GOOGLE BUTTON WRAPPER - You might need to style the button inside this component similarly */}
      <div className="[&>button]:w-full [&>button]:h-11 [&>button]:rounded-xl [&>button]:font-medium [&>button]:border-gray-200 [&>button]:bg-white [&>button]:hover:bg-gray-50 [&>button]:text-gray-700">
        <GoogleLoginBtn />
      </div>
    </div>
  );
}