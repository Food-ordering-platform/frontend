"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner"; 

interface GoogleLoginBtnProps {
  disabled?: boolean;
}

export function GoogleLoginBtn({ disabled = false }: GoogleLoginBtnProps) {
  const { googleLogin } = useAuth();

  return (
    <div 
      className={`w-full flex justify-center transition-all duration-300 ${
        disabled ? "opacity-50 grayscale pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-full">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              await googleLogin(credentialResponse.credential);
            }
          }}
          onError={() => toast.error("Google login failed")}
          theme="outline"
          size="large"
          width="100%" // Relies on container width
          text="continue_with"
          shape="pill" 
        />
      </div>
    </div>
  );
}