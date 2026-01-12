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
import {
  User,
  LogOut,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
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

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  if (pathname.includes("/ride") || pathname.includes("/partner")) {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <div className="relative h-9 w-9 md:h-10 md:w-10 overflow-hidden rounded-lg">
              <Image
                src="/official_logo.svg"
                alt="ChowEazy Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#7b1e3a]">
              Choweazy
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm absolute left-1/2 -translate-x-1/2">
            {[
              { href: "/restaurants", label: "Restaurants" },
              { href: "/orders", label: "Orders" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group font-medium ${
                  pathname === item.href
                    ? "text-[#7b1e3a]"
                    : "text-gray-700 hover:text-[#7b1e3a]"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#7b1e3a] transition-all ${
                    pathname === item.href
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 md:gap-4">
            {isLoading ? (
              <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
            ) : user ? (
              <>
                <CartDrawer />

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <div className="h-9 w-9 md:h-10 md:w-10 rounded-full cursor-pointer hover:bg-[#7b1e3a]/10 flex items-center justify-center">
                      <Avatar className="h-8 w-8 md:h-9 md:w-9">
                        <AvatarFallback className="bg-[#7b1e3a] text-white font-bold text-xs">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64" align="end">
                    <div className="flex items-center gap-3 p-4 bg-[#7b1e3a] text-white">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-white/10">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-white/80">{user.email}</p>
                      </div>
                    </div>

                    <div className="p-2">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-3 h-4 w-4" /> My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">
                          <ShoppingBag className="mr-3 h-4 w-4" /> Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Heart className="mr-3 h-4 w-4" /> Favorites
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600"
                      >
                        <LogOut className="mr-3 h-4 w-4" /> Sign Out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* DESKTOP GUEST */}
                <div className="hidden md:flex items-center gap-3">
                  <CartDrawer />
                  <Button
                    asChild
                    className="rounded-full bg-[#7b1e3a] hover:bg-[#66172e] text-white font-bold px-6"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>

                {/* MOBILE GUEST */}
                <div className="md:hidden flex items-center gap-1">
                  <CartDrawer />
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white z-[70]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="p-5 border-b flex justify-between">
                <span className="font-bold text-[#7b1e3a]">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {["/", "/restaurants", "/orders", "/about", "/contact"].map(
                  (href) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex justify-between text-gray-700"
                    >
                      {href === "/" ? "Home" : href.replace("/", "")}
                      <ChevronRight />
                    </Link>
                  )
                )}
              </div>

              <div className="p-5 border-t">
                <Button
                  asChild
                  className="w-full bg-[#7b1e3a] text-white font-bold"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
