"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useCreateOrder } from "../../services/order/order.queries"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, Clock, CreditCard, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CreateOrderDto, CreateOrderResponse } from "@/types/order.type"

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const { mutateAsync: placeOrder } = useCreateOrder()

  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const subtotal = getTotalPrice()
  const deliveryFee = 2.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return

    if (!deliveryAddress.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address",
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
  const orderData: CreateOrderDto = {
    customerId: user.id,
    restaurantId: items[0].menuItem.restaurantId,
    items: items.map((item) => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      price: item.menuItem.price,
      specialInstructions: item.specialInstructions,
    })),
    totalAmount: total,
    deliveryAddress: deliveryAddress.trim(),
    name: user.name,
    email: user.email,
  }

  const response = await placeOrder(orderData)
  const { checkoutUrl } = response

  toast({
    title: "Order placed successfully!",
    description: `Redirecting to payment...`,
  })

  clearCart()
  window.location.href = checkoutUrl
} catch (error: any) {
  console.error("Failed to place order:", error)
  toast({
    title: "Order failed",
    description: error?.message || "Failed to place your order. Please try again.",
    variant: "destructive",
  })
} finally {
  setIsPlacingOrder(false)
}
  }



  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/20">
        <Header />
        <main className="container py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Shopping
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gradient-red">Checkout</h1>
                <p className="text-muted-foreground">Complete your order and get it delivered</p>
              </div>
            </div>

            {items.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="text-center py-16">
                  <div className="h-16 w-16 bg-gradient-red-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-6">Add some delicious items to get started</p>
                  <Button asChild className="bg-gradient-red hover:bg-gradient-red-light">
                    <Link href="/">Browse Restaurants</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Delivery Information */}
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="bg-gradient-red-light text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-3">
                        <MapPin className="h-6 w-6" />
                        <span className="text-xl">Delivery Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="address" className="text-base font-semibold">
                          Delivery Address *
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your full delivery address including apartment/unit number..."
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          rows={3}
                          className="border-border/50 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-base font-semibold">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Your phone number for delivery updates"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="border-border/50 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="notes" className="text-base font-semibold">
                          Order Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special instructions for your order or delivery..."
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          rows={2}
                          className="border-border/50 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl">Order Items ({items.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {items.map((item, index) => (
                        <div
                          key={`${item.menuItem.id}-${index}`}
                          className="flex items-center space-x-4 p-4 bg-muted/30 rounded-xl"
                        >
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={item.menuItem.image || "/placeholder.svg"}
                              alt={item.menuItem.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{item.menuItem.name}</h4>
                            <p className="text-muted-foreground">
                              ${item.menuItem.price.toFixed(2)} × {item.quantity}
                            </p>
                            {item.specialInstructions && (
                              <p className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md mt-1 italic">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-primary">
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                  <Card className="border-border/50 shadow-lg sticky top-24">
                    <CardHeader className="bg-gradient-red text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6" />
                        <span className="text-xl">Order Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-base">
                          <span>Subtotal</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span>Delivery Fee</span>
                          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span>Tax & Fees</span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-xl">
                          <span>Total</span>
                          <span className="text-primary">${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3 text-sm">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Estimated delivery</p>
                            <p className="text-muted-foreground">25-35 minutes</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                        className="w-full h-14 bg-gradient-red hover:bg-gradient-red-light font-bold text-lg"
                        size="lg"
                      >
                        {isPlacingOrder ? (
                          <div className="flex items-center gap-2 justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Placing Order...
                          </div>
                        ) : (
                          `Place Order • $${total.toFixed(2)}`
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                        <Shield className="h-4 w-4" />
                        <span>Secure checkout protected by SSL</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
