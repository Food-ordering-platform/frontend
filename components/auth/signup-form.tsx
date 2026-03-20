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
    <div className="flex flex-col gap-6 w-full mx-auto">

      {/* GOOGLE BUTTON */}
      <div className="w-full">
        <GoogleLoginBtn disabled={!agreedToTerms} mode="signup" />
      </div>

      {/* REQUIRED CHECKBOX SECTION */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          {/*
            Use mt-0.5 on the checkbox wrapper so it sits flush with
            the cap-height of the first line of label text on every screen size,
            without relying on a hardcoded pt-1 that breaks on mobile.
          */}
          <Checkbox
            id="signup-terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-0.5 h-5 w-5 shrink-0 border-gray-400
                       data-[state=checked]:bg-[#7b1e3a]
                       data-[state=checked]:border-[#7b1e3a]
                       transition-all rounded-md"
          />

          <Label
            htmlFor="signup-terms"
            className="text-sm sm:text-base text-gray-600 font-normal
                       leading-relaxed cursor-pointer select-none"
          >
            I accept the{" "}
            <Link
              href="/terms"
              className="font-semibold text-[#7b1e3a] hover:underline underline-offset-2"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-[#7b1e3a] hover:underline underline-offset-2"
            >
              Privacy Policy
            </Link>
          </Label>
        </div>

        {/* Helper text lives outside the flex row so it never pushes the checkbox */}
        {!agreedToTerms && (
          <p
            className="pl-8 text-[11px] sm:text-xs text-[#7b1e3a]/80 font-medium
                       animate-in fade-in slide-in-from-left-1"
          >
            * Required to create account
          </p>
        )}
      </div>
    </div>
  );
}