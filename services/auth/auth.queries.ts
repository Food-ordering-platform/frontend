import { useMutation, useQuery} from "@tanstack/react-query";
import { RegisterData, LoginData, AuthResponse, VerifyOtpResponse, verifyOTPpayload,  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyResetOtpPayload,
  VerifyResetOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse, } from "@/types/auth.type";
import { registerUser, loginUser, verifyOtp, forgotPassword, verifyResetOtp, resetPassword, getCurrentUser} from "./auth"


//Register User
export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: registerUser,
  });
};

//Login user
export const useLogin =  () => {
    return useMutation<AuthResponse, any, LoginData>({
        mutationFn: loginUser
    })
}

//Get currentUser
export const useCurrentUser = (enabled: boolean) => {
  return useQuery<AuthResponse['user'], Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: enabled, // Only run if we have a token
    retry: false, // Don't retry if 401/403
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });
};

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