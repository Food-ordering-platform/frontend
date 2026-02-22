"use client";

import Link from "next/link";
import { GoogleLoginBtn } from "./google-button";

export function LoginForm() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      
      {/* GOOGLE BUTTON (Always Active, Strict Login Mode) */}
      <div className="w-full">
         <GoogleLoginBtn disabled={false} mode="login" />
      </div>

      {/* PASSIVE DISCLAIMER (No Checkbox) */}
      <p className="px-4 text-center text-xs text-gray-500 leading-relaxed">
        By continuing, you agree to ChowEazy&apos;s{" "}
        <Link href="/terms" className="font-medium text-[#7b1e3a] hover:underline underline-offset-2">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-[#7b1e3a] hover:underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}