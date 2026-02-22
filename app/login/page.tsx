import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
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
  title: "Login | ChowEazy",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header />
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#7b1e3a]/5 blur-3xl" />
         <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-sm sm:max-w-md border-0 shadow-xl shadow-gray-200/50 bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden ring-1 ring-gray-100">
          
          <div className="h-1.5 w-full bg-[#7b1e3a]" />

          <CardHeader className="space-y-2 text-center pt-6 pb-2 px-6">
            <div className="mx-auto bg-[#7b1e3a]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-1">
                <ShoppingBag className="w-6 h-6 text-[#7b1e3a]" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Sign in to manage your orders
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pt-2 pb-4">
            <LoginForm />
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6 pt-0">
            <p className="text-xs text-center text-gray-500">
              New here?{" "}
              <Link 
                href="/signup" 
                className="font-bold text-[#7b1e3a] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}