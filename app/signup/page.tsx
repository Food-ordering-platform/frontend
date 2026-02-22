import { Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import { Header } from "@/components/layout/header"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign Up | ChowEazy",
  description: "Create your account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header />
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#7b1e3a]/5 blur-3xl" />
         <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 py-8 relative z-10">
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-gray-100">
          
          {/* Brand Header Strip */}
          <div className="h-2 w-full bg-[#7b1e3a]" />

          <CardHeader className="space-y-3 text-center pt-8 pb-6">
            <div className="mx-auto bg-[#7b1e3a]/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-2">
                <ShoppingBag className="w-7 h-7 text-[#7b1e3a]" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-base text-gray-500">
              Join ChowEazy for fast & delicious food delivery
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-4">
            <SignupForm />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 bg-gray-50/50">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="font-bold text-[#7b1e3a] hover:text-[#60152b] transition-colors hover:underline underline-offset-4"
              >
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}