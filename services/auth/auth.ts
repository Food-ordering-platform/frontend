// food-ordering-platform/frontend/frontend-wip-staging/services/auth/auth.ts

import { AArrowUp } from "lucide-react";
import api from "../axios";
import { RegisterData, LoginData, AuthResponse, verifyOTPpayload, VerifyOtpResponse, ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyResetOtpPayload,
  VerifyResetOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  GoogleLoginPayload, } from "@/types/auth.type";

//Register new user
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

// Login (HYBRID UPDATE)
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const payload = { ...data, clientType: "web" as const };
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

// --- UPDATED GOOGLE AUTH ---
export const googleAuthenticate = async (
  data: { token: string; termsAccepted?: boolean } // 👈 Updated signature
): Promise<AuthResponse> => {
  const payload = {
    token: data.token,
    termsAccepted: data.termsAccepted, // Pass the flag
    clientType: "web", 
  };

  const response = await api.post<AuthResponse>("/auth/google", payload);
  return response.data;
};


// Get Current User (Session Check)
export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  const response = await api.get<{ user: AuthResponse["user"] }>("/auth/me");
  return response.data.user;
};

// Verify OTP (HYBRID UPDATE)
export const verifyOtp = async (data: verifyOTPpayload): Promise<VerifyOtpResponse> => {
  const payload = { ...data, clientType: "web" as const };
  const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", payload);
  return response.data;
};

// Forgot password - send OTP
export const forgotPassword = async (
  data: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  try {
    const res = await api.post<ForgotPasswordResponse>("/auth/forgot-password", data);
    return res.data;
  } catch (err: any) {
    console.error("Forgot password error:", err.response?.data || err.message);
    throw err;
  }
};

// Verify reset OTP
export const verifyResetOtp = async (
  data: VerifyResetOtpPayload
): Promise<VerifyResetOtpResponse> => {
  try {
    const res = await api.post<VerifyResetOtpResponse>("/auth/verify-reset-otp", data);
    return res.data;
  } catch (err: any) {
    console.error("Verify reset OTP error:", err.response?.data || err.message);
    throw err;
  }
};

// Reset password
export const resetPassword = async (
  data: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  try {
    const res = await api.post<ResetPasswordResponse>("/auth/reset-password", data);
    return res.data;
  } catch (err: any) {
    console.error("Reset password error:", err.response?.data || err.message);
    throw err;
  }
}

export const updateProfile = async (data: {
  name?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}): Promise<AuthResponse> => {
  const response = await api.put("/auth/profile", data);
  return response.data;
};