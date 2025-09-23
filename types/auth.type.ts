// types/auth.ts

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "VENDOR"
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface verifyOTPpayload{
  token: string,
  code:string
}

export type VerifyOtpResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    role: "CUSTOMER" | "VENDOR"
  };
};

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
