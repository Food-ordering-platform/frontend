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

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // After login, manually push to the dashboard root
      router.push("/");
    } catch (err) {
      toast.error("Access Denied", { description: "Invalid admin credentials." });
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
                className="h-12"
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
                className="h-12"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Authenticate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}