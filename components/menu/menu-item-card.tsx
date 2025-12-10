"use client"

import { useState } from "react"
import type { MenuItem } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const { addItem, getRestaurantId } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Helper to format currency to Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const currentRestaurantId = getRestaurantId()
    if (currentRestaurantId && currentRestaurantId !== item.restaurantId) {
      toast({
        title: "Different restaurant",
        description: "You can only order from one restaurant at a time. Clear your cart first.",
        variant: "destructive",
      })
      return
    }

    addItem(item, quantity, specialInstructions || undefined)
    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name} added to your cart`,
    })

    // Reset form
    setQuantity(1)
    setSpecialInstructions("")
    setShowDetails(false)
  }

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Item Image - Mobile: Full width, Desktop: Left side */}
          <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0 overflow-hidden">
            <Image 
              src={item.image || "/placeholder.svg"} 
              alt={item.name} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="secondary" className="text-xs font-bold px-3 py-1">
                  Sold Out
                </Badge>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 group-hover:text-[#7b1e3a] transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-lg text-[#7b1e3a]">{formatPrice(item.price)}</p>
                </div>
              </div>

              {item.ingredients && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.ingredients.slice(0, 3).map((ing, i) => (
                    <span key={i} className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-100">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            {item.isAvailable && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-semibold w-8 text-center text-sm tabular-nums">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Add Button */}
                  <div className="flex-1 flex justify-end gap-2">
                     <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowDetails(!showDetails)} 
                      className="text-xs text-gray-500 hover:text-[#7b1e3a]"
                    >
                      {showDetails ? "Cancel Note" : "+ Note"}
                    </Button>
                    
                    <Button onClick={handleAddToCart} size="sm" className="bg-[#7b1e3a] hover:bg-[#66172e] text-white shadow-md hover:shadow-lg transition-all rounded-lg px-4">
                      Add <span className="hidden sm:inline ml-1">• {formatPrice(item.price * quantity)}</span>
                    </Button>
                  </div>
                </div>

                {/* Special Instructions Input */}
                {showDetails && (
                  <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                    <Label htmlFor={`instructions-${item.id}`} className="text-xs font-medium text-gray-600 mb-1.5 block">
                      Special Requests (e.g. no onions)
                    </Label>
                    <Textarea
                      id={`instructions-${item.id}`}
                      placeholder="Add a note for the kitchen..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="text-sm min-h-[60px] bg-gray-50 border-gray-200 focus:border-[#7b1e3a]/30 focus:ring-[#7b1e3a]/10 resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}