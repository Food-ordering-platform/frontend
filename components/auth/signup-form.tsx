"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { GoogleLoginBtn } from "./google-button";

export function SignupForm() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      
      {/* GOOGLE BUTTON */}
      <div className="w-full">
         <GoogleLoginBtn disabled={!agreedToTerms} />
      </div>

      {/* REQUIRED CHECKBOX (Explicit Consent for New Accounts) */}
      <div className="flex items-start gap-3 px-2">
        <Checkbox 
          id="signup-terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          className="mt-0.5 border-gray-400 data-[state=checked]:bg-[#7b1e3a] data-[state=checked]:border-[#7b1e3a] transition-all"
        />
        <div className="grid gap-1 leading-none">
          <Label
            htmlFor="signup-terms"
            className="text-xs sm:text-sm text-gray-600 font-normal leading-snug cursor-pointer select-none"
          >
             I accept the{" "}
            <Link href="/terms" className="font-medium text-[#7b1e3a] hover:underline underline-offset-2">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-[#7b1e3a] hover:underline underline-offset-2">
              Privacy Policy
            </Link>
          </Label>
          
          {!agreedToTerms && (
             <p className="text-[10px] text-gray-400 font-medium">
               * Required to create account
             </p>
          )}
        </div>
      </div>
    </div>
  );
}