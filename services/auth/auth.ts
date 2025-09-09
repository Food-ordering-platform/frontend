import { AArrowUp } from "lucide-react";
import api from "../axios";
import { RegisterData, LoginData, AuthResponse, verifyOTPpayload, VerifyOtpResponse } from "@/types/auth.type";


//Register new user
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data; // return only the data
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
