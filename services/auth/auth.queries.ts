// food-ordering-platform/frontend/frontend-wip-staging/services/auth/auth.queries.ts

import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { RegisterData, LoginData, AuthResponse, VerifyOtpResponse, verifyOTPpayload,  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyResetOtpPayload,
  VerifyResetOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse, } from "@/types/auth.type";
import { registerUser, loginUser, verifyOtp, forgotPassword, verifyResetOtp, resetPassword, getCurrentUser, updateProfile, googleAuthenticate} from "./auth"
import { toast } from "sonner";


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

// --- UPDATED ---
export const useGoogleLogin = () => {
  return useMutation<AuthResponse, any, { token: string; termsAccepted: boolean }>({
    mutationFn: (data) => googleAuthenticate(data),
  });
};

export const useCurrentUser = (enabled: boolean) => {
  return useQuery<AuthResponse['user'], Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: enabled, 
    retry: false, 
    staleTime: 1000 * 60 * 5, 
  });
};

export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, any, verifyOTPpayload>({
    mutationFn: verifyOtp
  })
}

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });
};

export const useVerifyResetOtp = () => {
  return useMutation<VerifyResetOtpResponse, Error, VerifyResetOtpPayload>({
    mutationFn: verifyResetOtp,
  });
};

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(["currentUser"], data.user);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || "Failed to update profile";
      toast.error(msg);
    },
  });
};