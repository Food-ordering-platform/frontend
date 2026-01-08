"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner"; 

interface GoogleLoginBtnProps {
  disabled?: boolean;
  mode?: "login" | "signup";
}

export function GoogleLoginBtn({ disabled = false, mode = "login" }: GoogleLoginBtnProps) {
  const { googleLogin } = useAuth();

  return (
    <div 
      className={`w-full flex justify-center transition-all duration-300 ${
        disabled ? "opacity-50 grayscale pointer-events-none" : "opacity-100"
      }`}
    >
      {/* FIX: Removed 'overflow-hidden' so the Google popup/shadow isn't clipped.
         Kept min-height to prevent layout shift during loading.
      */}
      <div className="w-full min-h-[44px] sm:min-h-[50px] flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              await googleLogin(credentialResponse.credential, mode);
            }
          }}
          onError={() => {
            toast.error("Google login failed");
          }}
          theme="outline"
          size="large"
          // FIX: Removing specific width="100%" can sometimes help Google's 
          // internal responsive logic, but if you need it full width, 
          // ensure the parent container provides enough padding.
          width={undefined} 
          // automatic width often handles "Continue as..." better
          text={mode === "signup" ? "signup_with" : "continue_with"} 
          shape="pill" 
        />
      </div>
    </div>
  );
}