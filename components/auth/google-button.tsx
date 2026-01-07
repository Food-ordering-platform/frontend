"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner"; 

interface GoogleLoginBtnProps {
  disabled?: boolean;
  mode?: "login" | "signup"; // 👈 New Prop
}

export function GoogleLoginBtn({ disabled = false, mode = "login" }: GoogleLoginBtnProps) {
  const { googleLogin } = useAuth();

  return (
    <div 
      className={`w-full flex justify-center transition-all duration-300 relative ${
        disabled ? "opacity-50 grayscale pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Container with min-height fixes the "pop up" layout shift issue */}
      <div className="w-full min-h-[44px] sm:min-h-[50px] relative overflow-hidden rounded-full">
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
          width="100%" 
          text={mode === "signup" ? "signup_with" : "continue_with"} 
          shape="pill" 
        />
      </div>
    </div>
  );
}