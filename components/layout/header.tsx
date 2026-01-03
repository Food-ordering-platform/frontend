"use client"

import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { User, LogOut, ShoppingBag, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

export function Header() {
  const { user, logout, isLoading } = useAuth()
  const { clearCart } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    clearCart()
    logout()
    router.push("/")
  }

  // 🛑 STOP: If we are on a Rider or Partner page, DO NOT show this header.
  if (pathname.includes("/ride") || pathname.includes("/partner")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        
        {/* --- LOGO SECTION (Designed as requested) --- */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <Image 
                src="/official_logo.png" 
                alt="ChowEazy Logo" 
                fill
                className="object-cover"
            />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#7b1e3a]">
            Choweazy
          </span>
        </Link>

        {/* --- NAV MENU (Reverted to Absolute Center) --- */}
        <nav className="hidden md:flex items-center gap-8 text-sm absolute left-1/2 transform -translate-x-1/2">
          {[
            { href: "/restaurants", label: "Restaurants" },
            { href: "/orders", label: "Orders" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative group font-medium transition-colors ${
                pathname === item.href ? "text-[#7b1e3a]" : "text-gray-700 hover:text-[#7b1e3a]"
              }`}
            >
              {item.label}
              <span className={`absolute left-0 -bottom-1 h-[2px] bg-[#7b1e3a] transition-all ${
                 pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          ))}
        </nav>

        {/* --- RIGHT ACTIONS --- */}
        <div className="flex items-center space-x-4">
            {/* Cart is always visible */}
            <CartDrawer />

          {isLoading ? (
            // ✅ SKELETON LOADING
            <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
            </div>
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative h-10 w-10 rounded-full cursor-pointer hover:bg-[#7b1e3a]/10 flex items-center justify-center transition-colors">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarFallback className="bg-[#7b1e3a] text-white font-bold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end">
                  <div className="flex items-center gap-3 p-4 bg-[#7b1e3a] text-white rounded-t-sm">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarFallback className="bg-white/10 text-white font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none overflow-hidden">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-white/80 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="p-2">
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/profile">
                        <User className="mr-3 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/orders">
                        <ShoppingBag className="mr-3 h-4 w-4" />
                        <span>Order History</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="py-2.5 cursor-pointer">
                      <Heart className="mr-3 h-4 w-4" />
                      <span>Favorites</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild className="font-semibold text-gray-700 hover:text-[#7b1e3a] hover:bg-[#7b1e3a]/5">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="font-bold px-6 rounded-full bg-[#7b1e3a] hover:bg-[#66172e] text-white shadow-sm transition-transform active:scale-95"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}