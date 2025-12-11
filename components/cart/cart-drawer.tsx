"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const freeDeliveryThreshold = 15000 

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)
  }

  if (!user) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-[#7b1e3a] hover:bg-orange-50 active:scale-90 transition-transform">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] bg-[#7b1e3a] text-white font-bold animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-gray-50/50 p-0 border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 bg-white border-b sticky top-0 z-10 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-[#7b1e3a] text-xl font-bold">
             <ShoppingBag className="h-5 w-5" /> My Bag 
             <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100 ml-2">{totalItems}</Badge>
          </SheetTitle>
          {/* Custom Close Button in Header */}
          <SheetClose asChild>
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <X className="h-4 w-4" />
             </Button>
          </SheetClose>
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
                        <span>Add <span className="font-bold">{formatMoney(freeDeliveryThreshold - totalPrice)}</span> for free delivery</span>
                    )}
                </div>
                {totalPrice < freeDeliveryThreshold && (
                    <div className="h-1.5 w-full bg-[#7b1e3a]/10 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-[#7b1e3a] rounded-full transition-all duration-500" style={{ width: `${(totalPrice / freeDeliveryThreshold) * 100}%` }} />
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
                <p className="text-muted-foreground mt-2 max-w-[200px] mx-auto">Looks like you haven't added anything yet.</p>
              </div>
              <SheetClose asChild>
                <Button className="rounded-full px-8 bg-[#7b1e3a] hover:bg-[#66172e] h-12 text-lg shadow-lg active:scale-95 transition-transform">
                    Start Ordering
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                {items.map((item, index) => (
                  <div key={`${item.menuItem.id}-${index}`} className="flex gap-4 group bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <Image src={item.menuItem.image || "/placeholder.svg"} alt={item.menuItem.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                             <h4 className="font-semibold text-gray-900 line-clamp-1">{item.menuItem.name}</h4>
                             <button onClick={() => removeItem(item.menuItem.id)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full p-1.5 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                             </button>
                        </div>
                        <p className="text-sm font-medium text-gray-500">{formatMoney(item.menuItem.price)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8">
                          <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-l-lg active:bg-gray-300"><Minus className="h-3 w-3" /></button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-r-lg active:bg-gray-300"><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="font-bold text-[#7b1e3a]">{formatMoney(item.menuItem.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="bg-white p-6 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatMoney(totalPrice)}</span>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                 <Button className="w-full h-12 bg-[#7b1e3a] hover:bg-[#66172e] text-white font-bold rounded-xl shadow-lg shadow-red-900/20 text-lg active:scale-[0.98] transition-all" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/checkout" className="flex items-center justify-center gap-2">
                    Checkout <ArrowRight className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="grid grid-cols-2 gap-3">
                     <SheetClose asChild>
                        <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">
                            Continue Shopping
                        </Button>
                     </SheetClose>
                     <Button variant="outline" className="w-full border-red-100 text-red-600 hover:bg-red-50" onClick={clearCart}>
                        Empty Cart
                     </Button>
                </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}