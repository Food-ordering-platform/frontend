"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LoginData, RegisterData } from "@/types/auth.type";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import { useCurrentUser, useLogin, useRegister } from "@/services/auth/auth.queries";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 👇 1. Add 'isCheckingToken' and start it as TRUE
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
  const [hasToken, setHasToken] = useState<boolean>(false);
  
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  
  const { 
    data: user, 
    isLoading: isUserLoading, 
    refetch 
  } = useCurrentUser(hasToken);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    // 👇 2. Only turn off checking AFTER we've looked at localStorage
    setIsCheckingToken(false); 
  }, []);

  const login = async (data: LoginData) => {
    try {
      const res = await loginMutation.mutateAsync(data);
      
      if (res.requireOtp) {
        toast.info("Please verify your account.");
        if (res.token) localStorage.setItem("tempToken", res.token);
        router.push("/verify-otp");
        return;
      }

      if (res.token) {
        localStorage.setItem("token", res.token);
        setHasToken(true);
        
        if (res.user) {
          queryClient.setQueryData(["currentUser"], res.user);
        }

        await refetch();
        
        toast.success("Welcome back!");
        router.push("/restaurants");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await registerMutation.mutateAsync(data);
      toast.success("Registration successful! Please verify your email.");
      if (res.token) localStorage.setItem("tempToken", res.token);
      router.push("/verify-otp");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setHasToken(false);
    queryClient.setQueryData(["currentUser"], null); 
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
      await refetch();
    } else {
      setHasToken(false);
    }
  };

  // 👇 3. Fix the Loading Logic
  // We are loading if:
  // - We are still checking localStorage (isCheckingToken) OR
  // - React Query is fetching the user (isUserLoading && hasToken) OR
  // - We have a token but user data hasn't arrived yet (hasToken && !user)
  const isLoading = 
    isCheckingToken || 
    (isUserLoading && hasToken) || 
    (hasToken && !user);

  return (
    <AuthContext.Provider value={{ user: (user as User) || null, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};