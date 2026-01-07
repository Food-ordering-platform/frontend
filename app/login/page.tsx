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
    <div className="min-h-screen flex flex-col bg-[#faf9f6] relative overflow-hidden">
      <Header />

      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] rounded-full bg-[#7b1e3a]/5 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <Card className="w-full max-w-sm sm:max-w-md border-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl ring-1 ring-gray-100 overflow-hidden">

          {/* Top Accent */}
          <div className="h-1.5 sm:h-2 w-full bg-[#7b1e3a]" />

          <CardHeader className="space-y-3 text-center pt-6 sm:pt-8 px-6 sm:px-8">
            <div className="mx-auto bg-[#7b1e3a]/10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-[#7b1e3a]" />
            </div>

            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </CardTitle>

            <CardDescription className="text-sm sm:text-base text-gray-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pt-4">
            <LoginForm />
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4 pb-6 sm:pb-8 bg-gray-50/50 px-6 sm:px-8">
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#7b1e3a] hover:text-[#60152b] hover:underline underline-offset-4 transition"
              >
                Sign up for free
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
