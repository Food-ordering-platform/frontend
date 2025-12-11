"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthResponse, LoginData, RegisterData } from "@/types/auth.type";
import { loginUser, registerUser } from "@/services/auth/auth";
import { useCurrentUser } from "@/services/auth/auth.queries";
import api from "@/services/axios"; // Import your axios instance

interface AuthContextType {
  user: AuthResponse["user"] | null;
  token: string | null;
  login: (data: LoginData) => Promise<boolean>;
  googleLogin: (token: string) => Promise<boolean>; // New Method
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isInitializing: boolean; // Useful for showing a splash screen
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Safe Initialization (Fixes Hydration Error)
  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsInitializing(false);
  }, []);

  // 2. Fetch User Data
  const { data: user, error, isLoading: isUserLoading } = useCurrentUser(!!token);

  // 3. Handle Logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    // Optional: Redirect to login
    // window.location.href = "/login"; 
  };

  // 4. Auto-logout specifically on 401 Unauthorized
  useEffect(() => {
    if (error) {
      // @ts-ignore
      if (error?.response?.status === 401) {
        logout();
      }
    }
  }, [error]);

  // 5. Standard Login
  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const res = await loginUser(data);
      handleAuthSuccess(res);
      return true;
    } catch (err) {
      return false;
    }
  };

  // 6. Google Login Handler
  const googleLogin = async (googleToken: string): Promise<boolean> => {
    try {
        // We call the API directly here or create a service function for it
        const res = await api.post("/auth/google", { token: googleToken });
        handleAuthSuccess(res.data.result);
        return true;
    } catch (err) {
        console.error("Google Login Failed", err);
        return false;
    }
  }

  // Helper to centralize state updates
  const handleAuthSuccess = (res: AuthResponse) => {
    if (!res.user || !res.token) return;
    setToken(res.token);
    localStorage.setItem("auth-token", res.token);
    localStorage.setItem("auth-user", JSON.stringify(res.user));
    queryClient.setQueryData(["currentUser"], res.user);
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      await registerUser(data);
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: user ?? null, 
        token, 
        login, 
        googleLogin,
        register, 
        logout, 
        isLoading: isUserLoading,
        isInitializing
      }}
    >
      {!isInitializing && children} 
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}