// src/lib/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { AuthResponse, LoginData } from "@/types/auth.type";
import { loginUser, registerUser } from "@/services/auth/auth";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("auth-user");
    const storedToken = localStorage.getItem("auth-token");
    console.log("AuthProvider - Restoring from localStorage:", { storedUser, storedToken });
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("auth-user");
        localStorage.removeItem("auth-token");
      }
    }
    setIsLoading(false);
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
      console.log("AuthProvider - Setting localStorage:", { user: res.user, token: res.token });
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