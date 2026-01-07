import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { RegisterData, LoginData, AuthResponse, VerifyOtpResponse, verifyOTPpayload,  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyResetOtpPayload,
  VerifyResetOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse, } from "@/types/auth.type";
import { registerUser, loginUser, verifyOtp, forgotPassword, verifyResetOtp, resetPassword, getCurrentUser, updateProfile, googleAuthenticate} from "./auth"
import { toast } from "sonner";


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

export const useGoogleLogin = () => {
  return useMutation<AuthResponse, any, string>({
    // The mutation expects a string (the token), and passes it to the service
    mutationFn: (token) => googleAuthenticate({ token }),
  });
};

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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // 1. Update the cache immediately with the new user data
      if (data.user) {
        queryClient.setQueryData(["currentUser"], data.user);
      }
      
      // 2. Force a refetch to be safe (syncs with backend)
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || "Failed to update profile";
      toast.error(msg);
    },
  });
};