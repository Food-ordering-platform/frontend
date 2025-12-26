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

export const metadata: Metadata = {
  title: "Login | ChowEazy",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-none sm:border bg-background">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription>
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <LoginForm />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link 
                href="/signup" 
                className="font-semibold text-primary hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}