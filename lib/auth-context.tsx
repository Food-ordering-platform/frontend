"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { AuthResponse, LoginData } from "@/types/auth.type";
import { loginUser, registerUser, getCurrentUser } from "@/services/auth/auth"; // ✅ Added getCurrentUser

interface AuthContextType {
  user: AuthResponse["user"] | null;
  token: string | null;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ UPDATED: Validate token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("auth-token");
      
      if (storedToken) {
        try {
          // 1. Set token state first so axios interceptor can pick it up
          setToken(storedToken);
          
          // 2. Call backend to verify token and get fresh user data
          // This calls the /auth/me endpoint you just created
          const freshUser = await getCurrentUser();
          
          if (freshUser) {
            setUser(freshUser);
            // Optional: Update the cached user in local storage to keep it fresh
            localStorage.setItem("auth-user", JSON.stringify(freshUser));
          } else {
            // If API returns no user (shouldn't happen if getCurrentUser throws on error), force logout
            throw new Error("User not found");
          }
        } catch (error) {
          console.error("Session verification failed:", error);
          // 3. If any error occurs (401, 403, user deleted), clear everything
          logout();
        }
      } else {
        // No token found, ensure clean state
        logout();
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await loginUser(data);
      console.log("AuthProvider - Login response:", res);
      
      if (!res.user || !res.token) {
        console.error("AuthProvider - Invalid login response:", res);
        return false;
      }
      
      setUser(res.user);
      setToken(res.token);
      
      localStorage.setItem("auth-user", JSON.stringify(res.user));
      localStorage.setItem("auth-token", res.token);
      return true;
    } catch (err) {
      console.error("AuthProvider - Login error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      console.log("AuthProvider - Register response:", res);
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth-user");
    localStorage.removeItem("auth-token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
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