"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { useQueryClient } from "@tanstack/react-query";
import { LoginData, RegisterData, User } from "@/types/auth.type"; 
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import { useCurrentUser, useLogin, useRegister, useGoogleLogin } from "@/services/auth/auth.queries"; 

interface AuthContextType {
  user: User | null; 
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  googleLogin: (token: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
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

  // --- FIX: Initialization Effect ---
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setHasToken(true);
        // We do NOT await refetch() here. 
        // Setting hasToken(true) automatically triggers useCurrentUser to fetch.
      }
      // Immediately stop the "Checking Token" phase so the UI can update
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
        localStorage.setItem("token", res.token);
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

  const googleLogin = async (token: string): Promise<boolean> => {
    try {
      const res = await googleLoginMutation.mutateAsync(token);
      
      if (res.token) {
        localStorage.setItem("token", res.token);
        setHasToken(true);
        
        if (res.user) {
          queryClient.setQueryData(["currentUser"], res.user);
          handlePostLoginNavigation(res.user); 
        } else {
           await refetch();
           router.push("/restaurants");
        }
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(getErrorMessage(error));
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
      // We can await here if called manually, but it's often safer to let the query handle it
      await refetch();
    } else {
      setHasToken(false);
      queryClient.setQueryData(["currentUser"], null);
    }
  };

  const setUser = (newUser: User | null) => {
      queryClient.setQueryData(["currentUser"], newUser);
  };

  // Logic: Loading if checking localStorage OR (we have a token AND query is loading)
  // The (hasToken && !user && !isError) catches the edge case where fetching has started but loading state hasn't flipped
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