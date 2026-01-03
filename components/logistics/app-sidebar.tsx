"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  Map as MapIcon, 
  Settings, 
  LogOut, 
  Package,
  Wallet // [NEW] Import Wallet Icon
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const menuItems = [
    { title: "Dispatch Board", icon: LayoutDashboard, href: "/logistics/dashboard" },
    { title: "Fleet", icon: Users, href: "/logistics/riders" },
    { title: "Earnings", icon: Wallet, href: "/logistics/earnings" }, // [NEW] Added Earnings
    { title: "Live Map", icon: MapIcon, href: "/logistics/map" },
    { title: "Settings", icon: Settings, href: "/logistics/settings" },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b bg-[#7b1e3a] text-white">
        <div className="flex items-center gap-2 font-black text-xl overflow-hidden px-2 tracking-tighter">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">
            CHOW<span className="font-light opacity-80">LOGISTICS</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.title}
                isActive={pathname === item.href}
                className="hover:text-[#7b1e3a] hover:bg-red-50 data-[active=true]:bg-[#7b1e3a] data-[active=true]:text-white"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}