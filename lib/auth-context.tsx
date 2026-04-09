"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { useQueryClient } from "@tanstack/react-query";
import { LoginData, RegisterData, User } from "@/types/auth.type"; 
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import { useCurrentUser, useLogin, useRegister, useGoogleLogin } from "@/services/auth/auth.queries"; 
import api from "../services/axios"; // 🟢 Added this to call the logout endpoint

interface AuthContextType {
  user: User | null; 
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  googleLogin: (token: string, mode: "login" | "signup") => Promise<boolean>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>; // 🟢 Changed to Promise<void>
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
  const [hasToken, setHasToken] = useState<boolean>(false);
  
  const router = useRouter();
  const pathname = usePathname(); 
  const queryClient = useQueryClient();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  
  const { 
    data: user, 
    isLoading: isUserLoading, 
    isError, 
    refetch 
  } = useCurrentUser(hasToken);

  useEffect(() => {
    const initializeAuth = () => {
      // 🟢 Switched to "accessToken"
      const token = localStorage.getItem("accessToken");
      if (token) {
        setHasToken(true);
      }
      setIsCheckingToken(false);
    };

    initializeAuth();
  }, []);

  const handlePostLoginNavigation = (userData: User) => {
    if (!userData.address || !userData.latitude || !userData.longitude) {
      toast.info("Please set your delivery location to continue.");
      router.push("/setup-location");
    } else {
      toast.success(`Welcome back, ${userData.name?.split(' ')[0] || 'User'}!`);
      router.push("/restaurants");
    }
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
        // 🟢 Switched to "accessToken" (Backend still returns res.token in the JSON)
        localStorage.setItem("accessToken", res.token);
        setHasToken(true);
        if (res.user) {
          queryClient.setQueryData(["currentUser"], res.user);
          handlePostLoginNavigation(res.user);
        } else {
            await refetch();
            router.push("/restaurants");
        }
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const googleLogin = async (token: string, mode: "login" | "signup"): Promise<boolean> => {
    try {
      const res = await googleLoginMutation.mutateAsync({ 
        token, 
        termsAccepted: mode === "signup" 
      });
      
      if (res.token) {
        //  Switched to "accessToken"
        localStorage.setItem("accessToken", res.token);
        setHasToken(true);
        
        if (res.user) {
          queryClient.setQueryData(["currentUser"], res.user);
          
          if (mode === "signup") {
               toast.success("Account created successfully!");
               router.push("/restaurants");
          } else {
               handlePostLoginNavigation(res.user); 
          }
        } else {
           await refetch();
           router.push("/restaurants");
        }
        return true;
      }
      return false;
    } catch (error: any) {
      if (error?.response?.status === 404 || error.message.includes("Sign Up")) {
         toast.error("Account does not exist.", {
             description: "Please create an account first.",
             action: {
                 label: "Sign Up",
                 onClick: () => router.push("/signup")
             }
         });
      } else {
         toast.error("Login failed", { description: error.message || "Google authentication failed" });
      }
      return false;
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

  //  THE FIX: Ask the backend to destroy the HttpOnly cookie
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // Hits the new logout endpoint
    } catch (error) {
      console.error("Logout API failed, forcing local logout", error);
    } finally {
      localStorage.removeItem("accessToken");
      setHasToken(false);
      queryClient.setQueryData(["currentUser"], null); 
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  const checkAuth = async () => {
    //  Switched to "accessToken"
    const token = localStorage.getItem("accessToken");
    if (token) {
      setHasToken(true);
      await refetch();
    } else {
      setHasToken(false);
      queryClient.setQueryData(["currentUser"], null);
    }
  };

  const setUser = (newUser: User | null) => {
      queryClient.setQueryData(["currentUser"], newUser);
  };

  const isLoading = isCheckingToken || (hasToken && isUserLoading) || (hasToken && !user && !isError);

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, login, googleLogin, register, logout, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};