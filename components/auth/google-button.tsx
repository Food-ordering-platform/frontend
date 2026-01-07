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
      className={`w-full transition-all duration-300 ${
        disabled ? "opacity-50 pointer-events-none grayscale" : ""
      }`}
    >
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              await googleLogin(credentialResponse.credential);
            }
          }}
          onError={() => toast.error("Google login failed")}
          theme="outline"
          size="large"
          width={320} // 🔥 IMPORTANT: Use pixel width for mobile reliability
          text="continue_with"
          shape="pill"
        />
      </div>
    </div>
  );
}
