// app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, WalletCards, LifeBuoy, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminProtectedRoute } from "@/components/auth/admin-protected-route";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/", label: "Analytics", icon: LayoutDashboard },
  { href: "/users", label: "User Management", icon: Users },
  { href: "/payouts", label: "Payouts", icon: WalletCards },
  { href: "/support", label: "Support Tickets", icon: LifeBuoy },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  // 🟢 SECRET PATH: Replace this with your actual chosen secret string
  const isSecretLoginPage = pathname.includes("/access-portal-772");

  if (isSecretLoginPage) {
    return <>{children}</>;
  }

  const currentPath = pathname.replace('/admin', '') || '/';

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-black text-[#7b1e3a] tracking-tight">ChowEazy Admin</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-[#7b1e3a]/10 text-[#7b1e3a]" : "text-gray-600 hover:bg-gray-100"
                  }`}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 md:hidden">
              <h1 className="text-xl font-black text-[#7b1e3a] tracking-tight">ChowEazy Admin</h1>
          </div>
          <div className="flex-1 p-6 md:p-8 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}