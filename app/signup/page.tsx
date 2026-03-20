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
import { ShoppingBag } from "lucide-react" // Using lucide-react (ensure your import matches)

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

      <main className="flex-1 flex items-center justify-center px-4 py-10 relative z-10">
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-gray-200/50 bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden ring-1 ring-gray-100">
          
          {/* Brand Header Strip */}
          <div className="h-1.5 w-full bg-[#7b1e3a]" />

          <CardHeader className="space-y-3 text-center pt-10 pb-6 px-6">
            <div className="mx-auto bg-[#7b1e3a]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
                <ShoppingBag className="w-8 h-8 text-[#7b1e3a]" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-500 max-w-[280px] mx-auto">
              Join ChowEazy for fast & delicious food delivery
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 sm:px-10 pb-8">
            <SignupForm />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-6 pb-10 bg-gray-50/80 border-t border-gray-100">
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