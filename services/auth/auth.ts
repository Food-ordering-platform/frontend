import { AArrowUp } from "lucide-react";
import api from "../axios";
import { RegisterData, LoginData, AuthResponse, verifyOTPpayload, VerifyOtpResponse, ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyResetOtpPayload,
  VerifyResetOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse, } from "@/types/auth.type";


//Register new user
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data; // return only the data
    console.log(response)
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};


//login a user
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", data);
    const { result } = response.data; // Destructure result
    if (!result || !result.user || !result.token) {
      throw new Error("Invalid login response");
    }
    return {
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    };
  } catch (error: any) {
    console.log("Login error:", error.response?.data || error.message);
    throw error;
  }
};

//verify otp
export const verifyOtp = async (data: verifyOTPpayload ) : Promise<VerifyOtpResponse> => {
  try{
    const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", data)
    return response.data
  }
  catch(err: any) {
    console.log("OTP Verfication Failed", err.response.data || err.message)
    throw err;
  }
}


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