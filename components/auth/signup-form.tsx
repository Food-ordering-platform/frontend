// components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { GoogleLoginBtn } from "./google-button";

export function SignupForm() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm sm:max-w-md mx-auto">
      
      {/* GOOGLE BUTTON */}
      <div className="w-full">
        <GoogleLoginBtn disabled={!agreedToTerms} mode="signup" />
      </div>

      {/* REQUIRED CHECKBOX SECTION */}
      <div className="flex items-start gap-3 px-1 sm:px-0">
        <div className="pt-1">
          <Checkbox
            id="signup-terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="h-5 w-5 border-gray-400 data-[state=checked]:bg-[#7b1e3a] data-[state=checked]:border-[#7b1e3a] transition-all rounded-md"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="signup-terms"
            className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed cursor-pointer select-none"
          >
            I accept the{" "}
            <Link
              href="/terms"
              className="font-semibold text-[#7b1e3a] hover:underline underline-offset-2 whitespace-nowrap"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-[#7b1e3a] hover:underline underline-offset-2 whitespace-nowrap"
            >
              Privacy Policy
            </Link>
          </Label>

          {!agreedToTerms && (
            <p className="text-[11px] sm:text-xs text-[#7b1e3a]/80 font-medium animate-in fade-in slide-in-from-left-1">
              * Required to create account
            </p>
          )}
        </div>
      </div>
    </div>
  );
}