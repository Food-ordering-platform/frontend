"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { useQueryClient } from "@tanstack/react-query";
import { LoginData, RegisterData, User } from "@/types/auth.type"; 
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import { useCurrentUser, useLogin, useRegister, useGoogleLogin } from "@/services/auth/auth.queries"; // Import useGoogleLogin

interface AuthContextType {
  user: User | null; 
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  googleLogin: (token: string) => Promise<boolean>; // Add googleLogin to interface
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ... existing state and hooks
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
  const [hasToken, setHasToken] = useState<boolean>(false);
  
  const router = useRouter();
  const pathname = usePathname(); 
  const queryClient = useQueryClient();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin(); // Initialize hook
  
  const { 
    data: user, 
    isLoading: isUserLoading, 
    isError, 
    refetch 
  } = useCurrentUser(hasToken);

  // ... existing useEffects

  // Helper to handle navigation after successful login
  const handlePostLoginNavigation = (userData: User) => {
    // Logic: If user has no address/coordinates, go to setup. Else go to restaurants.
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
        localStorage.setItem("token", res.token);
        setHasToken(true);
        if (res.user) {
          queryClient.setQueryData(["currentUser"], res.user);
          handlePostLoginNavigation(res.user); // Use helper
        } else {
            // Fallback if user object isn't in response immediately
            await refetch();
            router.push("/restaurants");
        }
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  // Implement Google Login
  const googleLogin = async (token: string): Promise<boolean> => {
    try {
      // The hook handles the payload construction
      const res = await googleLoginMutation.mutateAsync(token);
      
      if (res.token) {
        localStorage.setItem("token", res.token);
        setHasToken(true);
        
        if (res.user) {
          queryClient.setQueryData(["currentUser"], res.user);
          handlePostLoginNavigation(res.user); 
        } else {
           await refetch();
           router.push("/restaurants"); // Fallback
        }
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };
  // ... register, logout, checkAuth implementation (keep existing)
  
  const register = async (data: RegisterData) => {
      // ... existing implementation
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
    // ... existing implementation
    localStorage.removeItem("token");
    setHasToken(false);
    queryClient.setQueryData(["currentUser"], null); 
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const checkAuth = async () => {
     // ... existing implementation
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
      await refetch();
    } else {
      setHasToken(false);
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