"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { GoogleLoginBtn } from "./google-button";

export function SignupForm() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="w-full max-w-[450px] mx-auto px-1 sm:px-0 grid gap-6">
       <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Create an account to start your delivery journey.
        </p>
      </div>

      {/* TERMS CHECKBOX */}
      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <Checkbox 
          id="signup-terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          className="mt-1 data-[state=checked]:bg-[#7b1e3a] data-[state=checked]:border-[#7b1e3a]"
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="signup-terms"
            className="text-sm font-medium text-gray-600 leading-snug cursor-pointer"
          >
             I accept the{" "}
            <Link href="/terms" className="text-[#7b1e3a] hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#7b1e3a] hover:underline">
              Privacy Policy
            </Link>
          </Label>
          <p className="text-xs text-gray-400">
            Required to create your account.
          </p>
        </div>
      </div>

      {/* GOOGLE BUTTON */}
      <div className="w-full">
        <GoogleLoginBtn disabled={!agreedToTerms} />
      </div>

      {/* Commented out manual form
      <Form {...form}> ... </Form>
      */}
    </div>
  );
}