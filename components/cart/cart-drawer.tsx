"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  if (!user) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative bg-gradient-red-light hover:bg-gradient-red text-white border-primary/20 hover:border-primary/40"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-secondary hover:bg-secondary font-bold animate-pulse">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-red flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
            Your Cart
          </SheetTitle>
          <SheetDescription className="text-base">
            {totalItems === 0 ? (
              "Your cart is empty"
            ) : (
              <span className="font-medium">
                {totalItems} item{totalItems !== 1 ? "s" : ""} • ${totalPrice.toFixed(2)}
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-sm">
                <div className="h-20 w-20 rounded-full bg-gradient-red-light mx-auto flex items-center justify-center">
                  <ShoppingCart className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Your cart is empty</h3>
                  <p className="text-muted-foreground">Add some delicious items to get started!</p>
                </div>
                <Button onClick={() => setIsOpen(false)} className="bg-gradient-red hover:bg-gradient-red-light">
                  Browse Restaurants
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-2 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.menuItem.id}-${index}`}
                    className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.menuItem.image || "/placeholder.svg"}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base leading-tight">{item.menuItem.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.menuItem.price.toFixed(2)} each</p>
                        {item.specialInstructions && (
                          <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md mt-1 italic">
                            Note: {item.specialInstructions}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 hover:bg-primary hover:text-white"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 hover:bg-primary hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-primary">
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.menuItem.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-border/50 pt-6 space-y-4 bg-muted/30 -mx-6 px-6 pb-6 rounded-t-2xl">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold text-primary text-xl">${totalPrice.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-12 bg-gradient-red hover:bg-gradient-red-light font-semibold text-lg"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 bg-transparent"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
