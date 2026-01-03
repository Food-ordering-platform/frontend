import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChowEazy Logistics",
  description: "Partner Dashboard",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents zooming like a native app
  },
};

export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* This layout ensures a clean slate for the PWA */}
      {children}
    </div>
  );
}