"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { useQueryClient } from "@tanstack/react-query";
import { LoginData, RegisterData, User } from "@/types/auth.type"; 
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import { useCurrentUser, useLogin, useRegister } from "@/services/auth/auth.queries";

interface AuthContextType {
  user: User | null; 
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start true to prevent "Logged Out" flash on initial load
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
  const [hasToken, setHasToken] = useState<boolean>(false);
  
  const router = useRouter();
  const pathname = usePathname(); 
  const queryClient = useQueryClient();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  
  const { 
    data: user, 
    isLoading: isUserLoading, 
    refetch 
  } = useCurrentUser(hasToken);

  // Initial Token Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    setIsCheckingToken(false); 
  }, []);

  // Check if Address is missing (Prompt user)
  useEffect(() => {
    if (user && !isUserLoading) {
      const isAddressMissing = !user.address || !user.latitude || !user.longitude;
      if (isAddressMissing && pathname !== '/profile') {
        const timer = setTimeout(() => {
            toast.message("Action Required", {
                description: "Please setup your delivery address in your profile to checkout faster.",
                action: {
                    label: "Setup Now",
                    onClick: () => router.push("/profile")
                },
                duration: 8000,
            });
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, isUserLoading, pathname, router]);

  const setUser = (newUser: User | null) => {
      queryClient.setQueryData(["currentUser"], newUser);
  };

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

  // ✅ Combined Loading State:
  // 1. Checking localStorage (isCheckingToken)
  // 2. Fetching User from Backend (isUserLoading && hasToken)
  // 3. Token exists but User data is not yet in (hasToken && !user)
  const isLoading = isCheckingToken || (isUserLoading && hasToken) || (hasToken && !user);

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, login, register, logout, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};