"use client"

import { useSearchParams } from "next/navigation"
import { useGetOrderByReference } from "@/services/order/order.queries"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock, Truck, ChefHat, Package, CheckCircle2, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

function OrderDetailsContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference") || ""
  const { toast } = useToast()

  const { user } = useAuth()
  const { data: order, isLoading, isError } = useGetOrderByReference(reference, {
    enabled: !!reference && !!user,
  })

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reference)
    toast({ description: "Order Reference Copied!" })
  }

  // Visual configuration
  const steps = [
    { id: "pending", label: "Placed", icon: Clock },
    { id: "preparing", label: "Preparing", icon: ChefHat },
    { id: "out_for_delivery", label: "En Route", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
  ]

  const getCurrentStep = (status: string) => {
      const map: Record<string, number> = { 
          pending: 0, confirmed: 0, preparing: 1, out_for_delivery: 2, delivered: 3, cancelled: -1 
      }
      return map[status?.toLowerCase().replace(/-/g, "_")] ?? 0
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b1e3a]"></div>
        </div>
    )
  }

  if (isError || !order) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
          <p className="text-gray-500 mt-2 mb-8 max-w-sm">We couldn't locate this order. It might be an invalid reference or a system error.</p>
          <Button asChild className="bg-[#7b1e3a] hover:bg-[#66172e] rounded-full px-8">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
    )
  }

  const currentStep = getCurrentStep(order.status)

  return (
      <div className="max-w-6xl mx-auto pb-12">
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="w-fit pl-0 hover:bg-transparent hover:text-[#7b1e3a] -ml-2">
            <Link href="/orders" className="flex items-center gap-2 font-medium">
              <ArrowLeft className="h-4 w-4" />
              Back to History
            </Link>
          </Button>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Ref:</span>
            <span className="font-mono font-medium text-gray-900">{reference}</span>
            <button onClick={copyToClipboard} className="text-gray-400 hover:text-[#7b1e3a] transition-colors ml-1">
                <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Status Card */}
            <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white">
                <div className="bg-[#7b1e3a] p-8 text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Package className="h-40 w-40" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 uppercase tracking-widest text-[10px]">
                                {order.status.replace(/_/g, " ")}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2">
                            {order.status === 'delivered' ? 'Order Delivered' : 'Order in Progress'}
                        </h1>
                        <p className="text-white/80">
                            {order.status === 'delivered' ? 'Enjoy your meal!' : 'Estimated delivery: 30-45 mins'}
                        </p>
                    </div>
                </div>

                <CardContent className="p-8">
                    {/* Stepper */}
                    <div className="relative flex justify-between items-center w-full">
                        {/* Connecting Line Background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10 rounded-full" />
                        
                        {/* Connecting Line Active */}
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%` }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute top-1/2 left-0 h-1 bg-[#7b1e3a] -translate-y-1/2 -z-10 rounded-full" 
                        />

                        {steps.map((step, index) => {
                            const isActive = index <= currentStep
                            const isCompleted = index < currentStep
                            const StepIcon = step.icon

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-3 bg-white px-2">
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`
                                            h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                            ${isActive ? 'border-[#7b1e3a] text-[#7b1e3a] bg-white' : 'border-gray-100 text-gray-300 bg-white'}
                                            ${isCompleted ? 'bg-[#7b1e3a] text-white !border-[#7b1e3a]' : ''}
                                        `}
                                    >
                                        <StepIcon className="h-5 w-5 md:h-6 md:w-6" />
                                    </motion.div>
                                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${isActive ? 'text-[#7b1e3a]' : 'text-gray-300'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Items List */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#7b1e3a]" />
                    Items in your order
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                    {order.items?.map((orderItem: any, i: number) => (
                      <div key={i} className="flex gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                        <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                          <Image
                            src={orderItem.menuItem?.imageUrl || "/placeholder.svg"}
                            alt={orderItem.menuItemName || "Food Item"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 truncate pr-4">{orderItem.menuItemName}</h4>
                            <span className="font-bold text-gray-900 whitespace-nowrap">
                                ₦{new Intl.NumberFormat("en-NG").format(orderItem.price * orderItem.quantity)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 font-medium mb-1">
                            ₦{new Intl.NumberFormat("en-NG").format(orderItem.price)} × {orderItem.quantity}
                          </p>
                          {orderItem.specialInstructions && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-100 rounded-md">
                                <span className="text-[10px] text-orange-700 font-medium line-clamp-1">Note: {orderItem.specialInstructions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order Summary */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                <CardTitle className="text-lg font-bold text-gray-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                        ₦{new Intl.NumberFormat("en-NG").format(order.totalAmount - (order.deliveryFee || 0) - (order.totalAmount * 0.075))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-gray-900">
                        ₦{new Intl.NumberFormat("en-NG").format(order.deliveryFee || 500)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%)</span>
                    <span className="font-medium text-gray-900">
                        ₦{new Intl.NumberFormat("en-NG").format(order.totalAmount * 0.075)}
                    </span>
                  </div>
                </div>
                <Separator className="bg-gray-100" />
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-extrabold text-2xl text-[#7b1e3a]">
                    ₦{new Intl.NumberFormat("en-NG").format(order.totalAmount)}
                  </span>
                </div>
              </CardContent>
              <div className="bg-[#7b1e3a]/5 p-4 border-t border-[#7b1e3a]/10">
                  <div className="flex items-center gap-2 justify-center text-[#7b1e3a] text-xs font-bold uppercase tracking-wide">
                      <CheckCircle2 className="h-4 w-4" />
                      Payment Successful
                  </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-1">Delivering to</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {order.deliveryAddress}
                    </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}

// Main Page Component with Suspense Boundary
export default function OrderDetailsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#faf9f8]">
        <Header />
        <main className="container py-8 px-4">
          <Suspense fallback={
             <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b1e3a]"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Retrieving your ticket...</p>
                </div>
             </div>
          }>
            <OrderDetailsContent />
          </Suspense>
        </main>
        <div className="hidden md:block">
            {/* Keeping footer mostly for desktop to avoid clutter on mobile detail views if preferred, or keep normally */}
        </div>
      </div>
    </ProtectedRoute>
  )
}