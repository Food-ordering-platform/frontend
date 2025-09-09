// src/app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/lib/provider"; // QueryClientProvider + AuthProvider

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "FoodOrder - Elevate Your Dining Experience",
  description: "Order from the finest restaurants delivered to your door",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${dmSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <Providers> {/* Includes QueryClientProvider + AuthProvider */}
            <CartProvider>
              {children} {/* Header and pages */}
              <Toaster />
            </CartProvider>
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}