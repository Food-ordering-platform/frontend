"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner"; // Use sonner consistently if you changed to it in login-form
// import { useToast } from "@/hooks/use-toast"; // Remove if using sonner

export function GoogleLoginBtn() {
  const { googleLogin } = useAuth();

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (credentialResponse.credential) {
            // Logic is now inside context (including redirect)
            const success = await googleLogin(credentialResponse.credential);
            if (!success) {
               // Error toast already handled in context, but can add fallback here
            }
          }
        }}
        onError={() => {
          toast.error("Google login failed");
        }}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="pill" // Changed to pill/circle for modern look
      />
    </div>
  );
}