"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-9 w-9 rounded-xl bg-[#7b1e3a] flex items-center justify-center shadow-md">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="font-bold text-xl text-[#7b1e3a]">FoodOrder</span>
        </Link>

        {/* Nav links */}
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
              className="relative group font-medium text-gray-700 hover:text-[#7b1e3a] transition-colors"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#7b1e3a] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <CartDrawer />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative h-10 w-10 rounded-full cursor-pointer hover:bg-[#7b1e3a]/10 flex items-center justify-center">
                    <Avatar className="h-10 w-10 border-2 border-[#7b1e3a]/30">
                      <AvatarFallback className="bg-[#7b1e3a] text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end">
                  <div className="flex items-center gap-3 p-4 bg-[#7b1e3a] text-white rounded-t-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-white/20 text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-white/80 text-sm truncate max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="p-2">
                    <DropdownMenuItem className="py-3">
                      <User className="mr-3 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-3">
                      <Link href="/orders">
                        <ShoppingBag className="mr-3 h-4 w-4" />
                        <span>Order History</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3">
                      <Heart className="mr-3 h-4 w-4" />
                      <span>Favorites</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="py-3 text-destructive focus:text-destructive"
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
              <Button variant="ghost" asChild className="font-semibold">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="font-semibold px-6 rounded-full bg-[#7b1e3a] hover:bg-[#66172e] text-white"
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
