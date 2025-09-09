import { useMutation} from "@tanstack/react-query";
import { RegisterData, LoginData, AuthResponse, VerifyOtpResponse, verifyOTPpayload } from "@/types/auth.type";
import { registerUser, loginUser, verifyOtp} from "./auth"

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