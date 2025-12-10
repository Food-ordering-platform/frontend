"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const freeDeliveryThreshold = 15000 // Free delivery at ₦15k

  // Naira Formatter
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (!user) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-700 hover:text-[#7b1e3a] hover:bg-orange-50"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] bg-[#7b1e3a] text-white font-bold animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-gray-50/50 p-0 border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 bg-white border-b sticky top-0 z-10">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#7b1e3a]">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-bold text-xl">My Bag</span>
            </div>
            <Badge variant="outline" className="text-xs font-normal text-gray-500 border-gray-300">
                {totalItems} items
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {items.length > 0 && (
            <div className="px-6 py-3 bg-[#7b1e3a]/5 border-b border-[#7b1e3a]/10">
                <div className="flex items-center gap-3 text-sm text-[#7b1e3a]">
                    <div className="p-1.5 bg-white rounded-full shadow-sm">
                        <Truck className="h-4 w-4" />
                    </div>
                    {totalPrice >= freeDeliveryThreshold ? (
                        <span className="font-medium">You've unlocked <span className="font-bold">Free Delivery!</span> 🎉</span>
                    ) : (
                        <span>
                            Add <span className="font-bold">{formatMoney(freeDeliveryThreshold - totalPrice)}</span> for free delivery
                        </span>
                    )}
                </div>
                {totalPrice < freeDeliveryThreshold && (
                    <div className="h-1.5 w-full bg-[#7b1e3a]/10 rounded-full mt-3 overflow-hidden">
                        <div 
                            className="h-full bg-[#7b1e3a] rounded-full transition-all duration-500" 
                            style={{ width: `${(totalPrice / freeDeliveryThreshold) * 100}%` }} 
                        />
                    </div>
                )}
            </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="h-32 w-32 bg-orange-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                <ShoppingCart className="h-16 w-16 text-orange-500 opacity-50" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
                <p className="text-muted-foreground mt-2 max-w-[200px] mx-auto">
                    Looks like you haven't added anything yet.
                </p>
              </div>
              <SheetClose asChild>
                <Button className="rounded-full px-8 bg-[#7b1e3a] hover:bg-[#66172e]">
                    Start Ordering
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                {items.map((item, index) => (
                  <div key={`${item.menuItem.id}-${index}`} className="flex gap-4 group">
                    {/* Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <Image
                        src={item.menuItem.image || "/placeholder.svg"}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                             <h4 className="font-semibold text-gray-900 line-clamp-1">{item.menuItem.name}</h4>
                             <button 
                                onClick={() => removeItem(item.menuItem.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                             >
                                <Trash2 className="h-4 w-4" />
                             </button>
                        </div>
                        <p className="text-sm font-medium text-gray-500">{formatMoney(item.menuItem.price)}</p>
                        
                        {item.specialInstructions && (
                          <p className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded mt-1.5 inline-block truncate max-w-[180px]">
                            "{item.specialInstructions}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Control */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg h-8 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-l-lg"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-r-lg"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="font-bold text-[#7b1e3a]">
                          {formatMoney(item.menuItem.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="bg-white p-6 border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatMoney(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Fee</span>
                    <span>Calculated at checkout</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
                 <Button
                    variant="outline"
                    className="col-span-1 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={clearCart}
                  >
                    Clear
                  </Button>
                <Button
                    className="col-span-3 h-12 bg-[#7b1e3a] hover:bg-[#66172e] text-white font-bold rounded-xl shadow-lg shadow-red-900/20"
                    asChild
                    onClick={() => setIsOpen(false)}
                >
                    <Link href="/checkout" className="flex items-center justify-center gap-2">
                    Checkout <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}