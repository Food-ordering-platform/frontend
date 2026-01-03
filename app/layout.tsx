// src/app/layout.tsx
import type React from "react";
import type { Metadata, Viewport } from "next"; // 1. Import Viewport
import { DM_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/lib/provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "ChowEazy",
  description: "Order from the finest restaurants delivered to your door",
  manifest: "/manifest.json", // 2. LINK THE MANIFEST HERE
};

// 3. ADD VIEWPORT EXPORT
export const viewport: Viewport = {
  themeColor: "#c72c41",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming like a native app
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
          <Providers>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}