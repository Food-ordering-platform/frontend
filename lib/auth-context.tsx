"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, loginUser, registerUser } from "@/services/auth/auth"; // Ensure imports match
import { LoginData, RegisterData } from "@/types/auth.type";
import { toast } from "sonner";

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Check Auth on Mount (Ask the server "Do you know me?")
  const checkAuth = async () => {
    try {
      const user = await getCurrentUser(); // Calls /auth/me with the Cookie
      setUser(user as User);
    } catch (error) {
      setUser(null); // Session invalid or expired
      // Optional: remove token if you still have legacy tokens
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 2. Login
  const login = async (data: LoginData) => {
    try {
      const res = await loginUser(data);
      
      // If backend requires OTP, handle it (usually UI redirects to /verify-otp)
      if (res.requireOtp) {
         // You might want to return here or handle the redirect in the UI component
         return; 
      }

      // If we got a user back, we are logged in!
      if (res.user) {
        setUser(res.user as User);
        toast.success("Welcome back!");
        router.push("/dashboard"); // or wherever
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    }
  };

  // 3. Register
  const register = async (data: RegisterData) => {
    try {
      await registerUser(data);
      toast.success("Account created! Please verify OTP.");
      router.push("/verify-otp");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
      throw error;
    }
  };

  // 4. Logout
  const logout = async () => {
    try {
      // You should create a logout endpoint in backend to destroy session
      // await api.post("/auth/logout"); 
      setUser(null);
      router.push("/login");
      toast.success("Logged out");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};