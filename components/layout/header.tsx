"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { User, LogOut, MapPin, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-red flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-gradient-red">FoodOrder</span>
            <span className="text-xs text-muted-foreground -mt-1">Premium Delivery</span>
          </div>
        </Link>

        {/* Right section */}
        <div className="flex items-center space-x-6">
          {/* Delivery location */}
          <div className="hidden md:flex items-center space-x-2 text-sm bg-muted/50 px-4 py-2 rounded-full">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">Delivering to</span>
            <span className="text-primary font-semibold">City, State</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <CartDrawer />

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative h-10 w-10 rounded-full cursor-pointer hover:bg-primary/10 flex items-center justify-center">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-red text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end">
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-red-light text-white rounded-t-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-white/20 text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-white/80 text-sm truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
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
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild className="font-semibold">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-red hover:bg-gradient-red-light font-semibold px-6"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
