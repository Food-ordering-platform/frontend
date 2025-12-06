"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthResponse, LoginData, RegisterData } from "@/types/auth.type";
import { loginUser, registerUser } from "@/services/auth/auth";
import { useCurrentUser } from "@/services/auth/auth.queries"; // ✅ Using the hook

interface AuthContextType {
  user: AuthResponse["user"] | null;
  token: string | null;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  
  // 1. Initialize token from localStorage (lazy initialization)
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth-token");
    }
    return null;
  });

  // 2. React Query hook to validate session
  // This runs immediately if a token exists. If the DB is wiped, this will return an error.
  const { data: user, isError, isLoading: isUserLoading } = useCurrentUser(!!token);

  // 3. Logout function
  const logout = () => {
    setToken(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    
    // Clear the React Query cache so the old user data doesn't persist
    queryClient.setQueryData(["currentUser"], null); 
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  // 4. Automatic Logout on Invalid Token (e.g., DB deleted)
  useEffect(() => {
    if (isError) {
      console.warn("Session invalid or user deleted. Logging out...");
      logout();
    }
  }, [isError]);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const res = await loginUser(data);
      
      if (!res.user || !res.token) return false;
      
      // Update local state and storage
      setToken(res.token);
      localStorage.setItem("auth-token", res.token);
      localStorage.setItem("auth-user", JSON.stringify(res.user));

      // Optimistic update: Tell React Query we have the user data now
      // This makes the UI update instantly without waiting for a refetch
      queryClient.setQueryData(["currentUser"], res.user);
      
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      await registerUser(data);
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    }
  };

  // Global loading state
  const isLoading = !!token && isUserLoading;

  return (
    <AuthContext.Provider 
      value={{ 
        user: user ?? null, // User comes from React Query data
        token, 
        login, 
        register, 
        logout, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}