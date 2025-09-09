"use client"

import { useState } from "react"
import type { MenuItem } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Minus } from "lucide-react"
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
        description: "You can only order from one restaurant at a time. Clear your cart to order from this restaurant.",
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
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Item Image */}
          <div className="relative h-32 md:h-24 md:w-24 flex-shrink-0">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-xs">
                  Unavailable
                </Badge>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>

                {item.ingredients && (
                  <p className="text-xs text-muted-foreground">Ingredients: {item.ingredients.join(", ")}</p>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Add to Cart Section */}
            {item.isAvailable && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button variant="link" size="sm" onClick={() => setShowDetails(!showDetails)} className="text-xs">
                    {showDetails ? "Hide" : "Add"} special instructions
                  </Button>
                </div>

                {showDetails && (
                  <div className="space-y-2">
                    <Label htmlFor={`instructions-${item.id}`} className="text-sm">
                      Special Instructions (optional)
                    </Label>
                    <Textarea
                      id={`instructions-${item.id}`}
                      placeholder="e.g., No onions, extra sauce..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                )}

                <Button onClick={handleAddToCart} className="w-full">
                  Add to Cart • ${(item.price * quantity).toFixed(2)}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
