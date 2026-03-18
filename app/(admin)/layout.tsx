// app/(admin)/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, WalletCards, LifeBuoy, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminProtectedRoute } from "@/components/auth/admin-protected-route";
import { useAuth } from "@/lib/auth-context";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// 🟢 FIX: Removed "/admin" from all the hrefs
const navItems = [
  { href: "/", label: "Analytics", icon: LayoutDashboard },
  { href: "/users", label: "User Management", icon: Users },
  { href: "/payouts", label: "Payouts", icon: WalletCards },
  { href: "/support", label: "Support Tickets", icon: LifeBuoy },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSecretLoginPage = pathname.includes("/access-portal-772");

  if (isSecretLoginPage) {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          // 🟢 FIX: Simplified the active check since paths now match perfectly
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)} 
            >
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
    </>
  );

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-screen top-0 left-0 z-10">
          <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
            <h1 className="text-xl font-black text-[#7b1e3a] tracking-tight">ChowEazy Admin</h1>
          </div>
          <SidebarContent />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 md:pl-64">
          
          {/* Mobile Top Nav */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-20">
              <h1 className="text-xl font-black text-[#7b1e3a] tracking-tight">ChowEazy Admin</h1>
              
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6 text-gray-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 flex flex-col bg-white">
                  <SheetHeader className="h-16 flex items-center justify-center border-b border-gray-200 shrink-0 px-6">
                    <SheetTitle className="text-xl font-black text-[#7b1e3a] tracking-tight">ChowEazy Admin</SheetTitle>
                  </SheetHeader>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
          </div>

          <div className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}