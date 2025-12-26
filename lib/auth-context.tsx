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
  // We use local state to track the presence of a token to enable/disable the query
  const [hasToken, setHasToken] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Setup Mutations and Queries
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  
  // The query automatically runs if 'hasToken' is true. 
  // It fetches the user profile using the token in localStorage (handled by axios interceptor/utils)
  const { 
    data: user, 
    isLoading: isUserLoading, 
    refetch 
  } = useCurrentUser(hasToken);

  // 2. Initialize: Check for token on mount to enable the query
  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  // 3. Login Action
  const login = async (data: LoginData) => {
    try {
      const res = await loginMutation.mutateAsync(data);
      
      // [CRITICAL FIX] Handle Unverified Users
      if (res.requireOtp) {
        toast.info("Please verify your account.");
        if (res.token) {
          localStorage.setItem("tempToken", res.token);
        }
        router.push("/verify-otp");
        return;
      }

      // [Standard Login]
      if (res.token) {
        localStorage.setItem("token", res.token);
        setHasToken(true); // Enable the user query
        await refetch();   // Ensure we get fresh data immediately
        toast.success("Welcome back!");
        router.push("/restaurants");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  // 4. Register Action
  const register = async (data: RegisterData) => {
    try {
      const res = await registerMutation.mutateAsync(data);
      
      toast.success("Registration successful! Please verify your email.");
      
      // [CRITICAL FIX] Store temp token for the Verify OTP page
      if (res.token) {
        localStorage.setItem("tempToken", res.token);
      }
      
      router.push("/verify-otp");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  // 5. Logout Action
  const logout = () => {
    localStorage.removeItem("token");
    setHasToken(false);
    queryClient.setQueryData(["currentUser"], null); // Clear React Query cache
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // 6. Manual Check Auth
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
      await refetch();
    } else {
      setHasToken(false);
    }
  };

  // derived state
  const isLoading = isUserLoading && hasToken; // Only loading if we have a token and are fetching

  return (
    <AuthContext.Provider 
      value={{ 
        user: (user as User) || null, 
        isLoading, 
        login, 
        register, 
        logout, 
        checkAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};