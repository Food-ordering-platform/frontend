// types/auth.ts

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: "CUSTOMER" | "VENDOR" | "RIDER";
}

export interface LoginData {
  email: string;
  password: string;
  clientType?: "web" | "mobile"; // <--- ADDED
}

// 👇 UPDATED USER INTERFACE
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;      // Added
  address?: string;    // Added
  latitude?: number;   // Added
  longitude?: number;  // Added
  isVerified?: boolean;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: User; // Uses the updated interface above
  requireOtp?: boolean;
}

export interface verifyOTPpayload {
  token: string;
  code: string;
  clientType?: "web" | "mobile"; // <--- ADDED
}
export interface VerifyOtpResponse {
  message: string;
  user?: AuthResponse["user"];
  token?: string;
}

// Forgot Password
export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  token: string; // short-lived reset token
}

// Verify Reset OTP
export interface VerifyResetOtpPayload {
  token: string;
  code: string;
}

export interface VerifyResetOtpResponse {
  message: string;
  resetToken: string; // new token for reset step
}

// Reset Password
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword:string
}

export interface ResetPasswordResponse {
  message: string;
}
