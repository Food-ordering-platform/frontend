import { useMutation} from "@tanstack/react-query";
import { RegisterData, LoginData, AuthResponse, VerifyOtpResponse, verifyOTPpayload,  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyResetOtpPayload,
  VerifyResetOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse, } from "@/types/auth.type";
import { registerUser, loginUser, verifyOtp, forgotPassword, verifyResetOtp, resetPassword} from "./auth"

export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: registerUser,
  });
};

export const useLogin =  () => {
    return useMutation<AuthResponse, any, LoginData>({
        mutationFn: loginUser
    })
}

export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, any, verifyOTPpayload>({
    mutationFn: verifyOtp
  })
}

// Forgot password - send OTP
export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });
};

// Verify reset OTP
export const useVerifyResetOtp = () => {
  return useMutation<VerifyResetOtpResponse, Error, VerifyResetOtpPayload>({
    mutationFn: verifyResetOtp,
  });
};

// Reset password
export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });
};