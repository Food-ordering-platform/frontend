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
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, MapPin, Clock, CreditCard, ShieldCheck, ShoppingBag, Phone, StickyNote, Wallet } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CreateOrderDto } from "@/types/order.type"
import { motion } from "framer-motion"

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
  const deliveryFee = 1500
  const taxRate = 0.075 
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
        title: "Address Required",
        description: "Please enter your delivery address to continue.",
        variant: "destructive",
      })
      return
    }

    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "We need your phone number for delivery updates.",
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
        title: "Order initiated!",
        description: `Redirecting to secure payment...`,
      })

      clearCart()
      window.location.href = checkoutUrl
    } catch (error: any) {
      console.error("Failed to place order:", error)
      toast({
        title: "Order failed",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#faf9f8] font-sans">
        <Header />
        
        <main className="container py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[#7b1e3a] mb-2" asChild>
                <Link href="/restaurants" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> 
                    <span>Continue Shopping</span>
                </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
          </motion.div>

          {items.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200"
            >
              <div className="h-24 w-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any delicious food yet.</p>
              <Button asChild size="lg" className="bg-[#7b1e3a] hover:bg-[#66172e] rounded-full px-8 shadow-lg shadow-red-900/20">
                <Link href="/restaurants">Browse Restaurants</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left Column - Forms */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Delivery Information */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                                <MapPin className="h-5 w-5 text-[#7b1e3a]" />
                                Delivery Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Delivery Address</Label>
                                    <div className="relative">
                                        <Textarea
                                            id="address"
                                            placeholder="Street address, apartment, suite, etc."
                                            value={deliveryAddress}
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            className="min-h-[100px] resize-none pl-4 focus-visible:ring-[#7b1e3a] border-gray-200 bg-gray-50/50"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="0801 234 5678"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="pl-9 focus-visible:ring-[#7b1e3a] border-gray-200 bg-gray-50/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Instructions (Optional)</Label>
                                        <div className="relative">
                                            <StickyNote className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="notes"
                                                placeholder="Gate code, knock hard..."
                                                value={orderNotes}
                                                onChange={(e) => setOrderNotes(e.target.value)}
                                                className="pl-9 focus-visible:ring-[#7b1e3a] border-gray-200 bg-gray-50/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Order Items Review */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                                <ShoppingBag className="h-5 w-5 text-[#7b1e3a]" />
                                Your Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {items.map((item, index) => (
                                    <div key={`${item.menuItem.id}-${index}`} className="flex gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                                        <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                            <Image
                                                src={item.menuItem.image || "/placeholder.svg"}
                                                alt={item.menuItem.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-900 truncate pr-4">{item.menuItem.name}</h4>
                                                <p className="font-bold text-gray-900 whitespace-nowrap">
                                                    {formatMoney(item.menuItem.price * item.quantity)}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium mr-2 text-gray-700">
                                                    Qty: {item.quantity}
                                                </span>
                                                <span>{formatMoney(item.menuItem.price)} each</span>
                                            </div>
                                            {item.specialInstructions && (
                                                <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-orange-600" />
                                                    {item.specialInstructions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
              </div>

              {/* Right Column - Payment Summary */}
              <div className="lg:col-span-5 relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sticky top-24"
                >
                    <Card className="border-0 shadow-xl shadow-gray-200/50 ring-1 ring-gray-200 rounded-3xl overflow-hidden bg-white">
                        <div className="bg-[#7b1e3a] p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Wallet className="h-24 w-24 transform rotate-12" />
                            </div>
                            <h2 className="text-xl font-bold relative z-10 flex items-center gap-2">
                                <CreditCard className="h-5 w-5" /> Payment Summary
                            </h2>
                            <p className="text-white/80 text-sm mt-1 relative z-10">Complete your purchase securely</p>
                        </div>

                        <CardContent className="p-6 md:p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatMoney(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-medium text-gray-900">{formatMoney(deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>VAT (7.5%)</span>
                                    <span className="font-medium text-gray-900">{formatMoney(tax)}</span>
                                </div>
                            </div>

                            <Separator className="bg-gray-100" />

                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-gray-900">Total to Pay</span>
                                <div className="text-right">
                                    <span className="text-3xl font-extrabold text-[#7b1e3a] leading-none">
                                        {formatMoney(total)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 items-start">
                                <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                                    <Clock className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-orange-800">Estimated Delivery</p>
                                    <p className="text-xs text-orange-700/80 mt-0.5">30-45 minutes from order confirmation</p>
                                </div>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full h-14 bg-[#7b1e3a] hover:bg-[#66172e] text-white font-bold text-lg rounded-xl shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium pt-2">
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                <span>Payments are secure and encrypted</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}