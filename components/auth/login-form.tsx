"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { GoogleLoginBtn } from "./google-button";

export function LoginForm() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      
      {/* Google Button */}
      <div className="w-full">
        <GoogleLoginBtn disabled={!agreedToTerms} />
      </div>

      {/* Terms Checkbox */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
        <div className="flex items-start sm:items-center gap-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-0.5 scale-105 sm:mt-0 border-gray-300 data-[state=checked]:bg-[#7b1e3a] data-[state=checked]:border-[#7b1e3a]"
          />
          <Label htmlFor="terms" className="cursor-pointer leading-snug">
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-[#7b1e3a] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#7b1e3a] hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        {/* Error Message */}
        {!agreedToTerms && (
          <p className="text-[11px] text-red-500 font-medium mt-1 sm:mt-0 sm:ml-1">
            * Required to sign in
          </p>
        )}
      </div>
    </div>
  );
}
