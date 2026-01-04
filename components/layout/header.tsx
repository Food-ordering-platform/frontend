"use client"

import { useState, useEffect } from "react"
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
import { User, LogOut, ShoppingBag, Heart, Menu, X, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

export function Header() {
  const { user, logout, isLoading } = useAuth()
  const { clearCart } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    clearCart()
    logout()
    router.push("/")
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isMobileMenuOpen])

  if (pathname.includes("/ride") || pathname.includes("/partner")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="relative h-9 w-9 md:h-10 md:w-10 overflow-hidden rounded-lg">
              <Image 
                  src="/official_logo.png" 
                  alt="ChowEazy Logo" 
                  fill
                  className="object-cover"
              />
            </div>
            <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#7b1e3a]">
              Choweazy
            </span>
          </Link>

          {/* --- DESKTOP NAV (Hidden on Mobile) --- */}
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
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Cart (Visible on Mobile & Desktop) */}
            <CartDrawer />

            {/* Loading State */}
            {isLoading ? (
              <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
            ) : user ? (
              // --- LOGGED IN USER (Desktop & Mobile) ---
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-full cursor-pointer hover:bg-[#7b1e3a]/10 flex items-center justify-center transition-colors">
                    <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-gray-200">
                      <AvatarFallback className="bg-[#7b1e3a] text-white font-bold text-xs">
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
                      <p className="text-white/80 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/profile"><User className="mr-3 h-4 w-4" /> My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/orders"><ShoppingBag className="mr-3 h-4 w-4" /> Order History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2.5 cursor-pointer">
                      <Heart className="mr-3 h-4 w-4" /> Favorites
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="py-2.5 text-red-600 cursor-pointer">
                      <LogOut className="mr-3 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // --- GUEST STATE ---
              <>
                {/* Desktop Buttons (Hidden on Mobile) */}
                <div className="hidden md:flex items-center space-x-3">
                  <Button variant="ghost" asChild className="font-semibold text-gray-700 hover:text-[#7b1e3a] hover:bg-[#7b1e3a]/5">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="font-bold px-6 rounded-full bg-[#7b1e3a] hover:bg-[#66172e] text-white shadow-sm">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>

                {/* Mobile Hamburger (Visible on Mobile Only) */}
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl z-[70] flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="font-extrabold text-xl tracking-tight text-[#7b1e3a]">
                  Menu
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto py-6 px-5 flex flex-col gap-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/restaurants", label: "Restaurants" },
                  { href: "/orders", label: "Orders" },
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact Support" },
                ].map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="flex items-center justify-between py-3 text-base font-medium text-gray-700 border-b border-gray-50 last:border-0 hover:text-[#7b1e3a]"
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </Link>
                ))}
              </div>

              {/* Drawer Footer (Sign In / Sign Up) */}
              {!user && (
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
                  <Button 
                    asChild 
                    className="w-full bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold h-12 text-base shadow-lg shadow-[#7b1e3a]/20"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 font-semibold h-12 text-base hover:bg-white hover:text-[#7b1e3a]"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}