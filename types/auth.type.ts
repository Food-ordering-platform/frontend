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