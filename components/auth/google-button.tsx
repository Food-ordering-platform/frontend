"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function GoogleLoginBtn() {
  const { googleLogin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="w-full flex justify-center mt-4">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (credentialResponse.credential) {
            const success = await googleLogin(credentialResponse.credential);
            if (success) {
              toast({ title: "Success", description: "Logged in with Google!" });
              router.push("/");
            } else {
              toast({ title: "Error", description: "Google login failed", variant: "destructive" });
            }
          }
        }}
        onError={() => {
          toast({ title: "Error", description: "Google login failed", variant: "destructive" });
        }}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="circle"
      />
    </div>
  );
}