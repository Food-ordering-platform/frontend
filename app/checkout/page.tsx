"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useCreateOrder } from "../../services/order/order.queries"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, Clock, CreditCard, Shield, Bike, Utensils } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CreateOrderDto } from "@/types/order.type"

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

  // Pricing Logic (Naira)
  const subtotal = getTotalPrice()
  const deliveryFee = 1500 // ₦1500 flat delivery
  const taxRate = 0.075 // 7.5% VAT
  const tax = subtotal * taxRate
  const total = subtotal + deliveryFee + tax

  // Format Helper
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return

    if (!deliveryAddress.trim()) {
      toast({
        title: "Address Missing",
        description: "Please enter your delivery address to continue.",
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
        description: `Redirecting to payment gateway...`,
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
      <div className="min-h-screen bg-gray-50/50">
        <Header />
        <main className="container py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10">
                  <Link href="/restaurants">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
                  <p className="text-muted-foreground">Review your order and complete payment</p>
                </div>
              </div>
            </div>

            {items.length === 0 ? (
              <Card className="border-dashed border-2 shadow-none bg-transparent">
                <CardContent className="text-center py-20 flex flex-col items-center">
                  <div className="h-24 w-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <Utensils className="h-10 w-10 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any food yet. Browse our restaurants to find something delicious.</p>
                  <Button asChild size="lg" className="bg-[#7b1e3a] hover:bg-[#66172e] rounded-full px-8">
                    <Link href="/restaurants">Start Ordering</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Details */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Delivery Info */}
                  <Card className="shadow-sm border-0 ring-1 ring-gray-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2 text-[#7b1e3a]">
                        <MapPin className="h-5 w-5" />
                        <h2 className="font-bold text-lg">Delivery Details</h2>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-6 space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                          Delivery Address
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Example: 12 Adeola Odeku Street, Victoria Island, Lagos"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="min-h-[100px] resize-none focus:border-[#7b1e3a] focus:ring-[#7b1e3a]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                            <Input
                            id="phone"
                            type="tel"
                            placeholder="0801 234 5678"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Instructions (Optional)</Label>
                            <Input
                            id="notes"
                            placeholder="Gate code, knock loudly..."
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card className="shadow-sm border-0 ring-1 ring-gray-200">
                     <CardHeader className="pb-4">
                      <div className="flex items-center gap-2 text-[#7b1e3a]">
                        <Utensils className="h-5 w-5" />
                        <h2 className="font-bold text-lg">Your Items</h2>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-6 divide-y">
                      {items.map((item, index) => (
                        <div key={`${item.menuItem.id}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                           <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                            <Image
                              src={item.menuItem.image || "/placeholder.svg"}
                              alt={item.menuItem.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{item.menuItem.name}</h4>
                             <p className="text-sm text-gray-500 mt-1">
                              {formatMoney(item.menuItem.price)} × {item.quantity}
                            </p>
                            {item.specialInstructions && (
                              <p className="text-xs text-[#d97706] bg-orange-50 inline-block px-2 py-1 rounded mt-2">
                                "{item.specialInstructions}"
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatMoney(item.menuItem.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-5 space-y-6">
                  <Card className="shadow-lg border-0 ring-1 ring-gray-200 sticky top-24 bg-white/80 backdrop-blur-xl">
                    <CardHeader className="bg-[#7b1e3a] text-white rounded-t-xl py-6">
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatMoney(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span>{formatMoney(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>VAT (7.5%)</span>
                            <span>{formatMoney(tax)}</span>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="flex justify-between items-end">
                            <span className="font-bold text-lg text-gray-900">Total</span>
                            <span className="font-extrabold text-3xl text-[#7b1e3a]">{formatMoney(total)}</span>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-3 flex gap-3 items-start mt-4">
                            <Clock className="h-5 w-5 text-[#d97706] mt-0.5" />
                            <div className="text-sm text-[#92400e]">
                                <p className="font-semibold">Est. Delivery: 35-45 mins</p>
                                <p className="opacity-90">Based on standard Lagos traffic</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Button
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                            className="w-full h-14 bg-[#7b1e3a] hover:bg-[#66172e] font-bold text-lg rounded-xl shadow-lg shadow-red-900/10 transition-all hover:scale-[1.02]"
                        >
                            {isPlacingOrder ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Processing...
                            </div>
                            ) : (
                            `Pay ${formatMoney(total)}`
                            )}
                        </Button>
                    </CardFooter>
                    <div className="pb-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                            <Shield className="h-3 w-3" />
                            <span>Secured by Paystack/Flutterwave</span>
                        </div>
                    </div>
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