// app/admin/access-portal-772/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAdminLogin } from "@/services/admin/admin.queries";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // We only need checkAuth from the context to refresh the global state after login
  const { checkAuth } = useAuth(); 
  const router = useRouter();
  
  // Initialize our new admin-specific query hook
  const loginMutation = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Call the admin-only API
      const res = await loginMutation.mutateAsync({ email, password });
      
      if (res.token) {
        // 2. Save the token exactly where AuthContext expects it
        localStorage.setItem("accessToken", res.token);
        
        // 3. Force AuthContext to reload the user profile with the new token
        await checkAuth();
        
        toast.success("Welcome back to the Command Center.");
        
        // 4. Send them to the main dashboard
        router.push("/");
      }
    } catch (err: any) {
      // Safely catch Axios errors or fallback to a generic message
      const errorMessage = err.response?.data?.message || "Invalid admin credentials.";
      toast.error("Access Denied", { description: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f8] px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto bg-[#7b1e3a]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
            <ShieldCheck className="w-10 h-10 text-[#7b1e3a]" />
          </div>
          <CardTitle className="text-2xl font-black text-gray-900">Admin Access</CardTitle>
          <CardDescription>Enter authorized credentials to manage the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Work Email</label>
              <Input 
                type="email" 
                placeholder="admin@choweazy.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 focus:ring-[#7b1e3a] focus:border-[#7b1e3a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 focus:ring-[#7b1e3a] focus:border-[#7b1e3a]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <Loader2 className="animate-spin" /> : "Authenticate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}