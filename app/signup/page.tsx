import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <SignupForm />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#7b1e3a] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}