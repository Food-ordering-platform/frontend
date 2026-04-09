// components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { GoogleLoginBtn } from "./google-button";

export function SignupForm() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* GOOGLE BUTTON */}
      <GoogleLoginBtn disabled={!agreedToTerms} mode="signup" />

      {/* TERMS CHECKBOX */}
      <div
        className={`
          rounded-xl border px-4 py-3.5 transition-colors duration-200
          ${agreedToTerms
            ? "border-[#7b1e3a]/30 bg-[#7b1e3a]/5"
            : "border-gray-200 bg-gray-50/80"}
        `}
      >
        {/*
          Use a <label> wrapping everything so the whole row is clickable.
          Avoid the shadcn <Label> + separate <Checkbox> pattern here — it
          can cause block-layout collisions with Next.js <Link> children.
        */}
        <label
          htmlFor="signup-terms"
          className="flex items-start gap-3 cursor-pointer select-none"
        >
          <Checkbox
            id="signup-terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border-gray-400
                       data-[state=checked]:bg-[#7b1e3a]
                       data-[state=checked]:border-[#7b1e3a]"
          />

          {/*
            Render as a <span> (inline by default).
            Every child — including the Links — is forced to display:inline
            via the [&>a]:inline class so nothing line-breaks mid-sentence.
          */}
          <span className="text-sm text-gray-600 font-normal leading-relaxed [&>a]:inline [&>a]:font-semibold [&>a]:text-[#7b1e3a] [&>a]:underline [&>a]:underline-offset-2">
            I accept the{" "}
            <Link href="/terms">Terms &amp; Conditions</Link>
            {" "}and{" "}
            <Link href="/privacy">Privacy Policy</Link>
          </span>
        </label>

        {!agreedToTerms && (
          <p className="mt-2 pl-[30px] text-[11px] text-[#7b1e3a]/70 font-medium">
            * Required to continue
          </p>
        )}
      </div>
    </div>
  );
}