// src/app/layout.tsx
import type React from "react";
import type { Metadata, Viewport } from "next";
// 1. IMPORT NEW FONTS
import { DM_Sans, Inter, Playfair_Display } from "next/font/google"; 
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/lib/provider";
// import { InstallPrompt } from "../components/pwa/install-prompt";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

// 2. CONFIGURE INTER (For Body Text - High Readability)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 3. CONFIGURE PLAYFAIR DISPLAY (For Headings - Premium/Legal feel)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChowEazy",
  description: "Order from the finest restaurants delivered to your door",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ChowEazy",
  },
  icons: {
    apple: "/official_logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#c72c41",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 4. ADD VARIABLES TO BODY */}
      <body className={`font-sans ${dmSans.variable} ${inter.variable} ${playfair.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <Providers>
            <CartProvider>
              {children}
              {/* <InstallPrompt />  */}
              <Toaster />
            </CartProvider>
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}