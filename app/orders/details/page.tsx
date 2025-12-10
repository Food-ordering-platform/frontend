"use client"

import { useSearchParams } from "next/navigation"
import { useGetOrderByReference } from "@/services/order/order.queries"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react" // ✅ Import Suspense

// Create a component for the content that uses search params
function OrderDetailsContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference") || ""

  const { user } = useAuth()
  const { data: order, isLoading, isError } = useGetOrderByReference(reference, {
    enabled: !!reference && !!user,
  })

  if (isLoading) {
    return (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7b1e3a]"></div>
        </div>
    )
  }

  if (isError || !order) {
    return (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">Order not found</p>
          <Button asChild className="bg-[#7b1e3a] hover:bg-[#66172e]">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
    )
  }

  return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Ref: {order.reference}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Clock className="h-4 w-4" />
                  <span className="uppercase font-medium tracking-wide">
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Info */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="relative h-12 w-12 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                     {/* Use a fallback icon if image is missing */}
                     <span className="font-bold text-gray-400">R</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.restaurant?.name}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items?.map((orderItem: any, i: number) => (
                  <div key={i} className="flex items-center space-x-3 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={orderItem.menuItem?.imageUrl || "/placeholder.svg"}
                        alt={orderItem.menuItemName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{orderItem.menuItemName}</h4>
                      <p className="text-sm text-muted-foreground">
                        ₦{new Intl.NumberFormat("en-NG").format(orderItem.price)} × {orderItem.quantity}
                      </p>
                      {orderItem.specialInstructions && (
                        <p className="text-xs text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded mt-1">
                          Note: {orderItem.specialInstructions}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₦{new Intl.NumberFormat("en-NG").format(orderItem.price * orderItem.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{new Intl.NumberFormat("en-NG").format(order.totalAmount - (order.deliveryFee || 0) - (order.totalAmount * 0.075))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₦{new Intl.NumberFormat("en-NG").format(order.deliveryFee || 500)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7.5%)</span>
                    <span>₦{new Intl.NumberFormat("en-NG").format(order.totalAmount * 0.075)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg text-[#7b1e3a]">
                    <span>Total</span>
                    <span>₦{new Intl.NumberFormat("en-NG").format(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">{order.deliveryAddress}</p>
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container py-8">
          <Suspense fallback={
             <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7b1e3a]"></div>
             </div>
          }>
            <OrderDetailsContent />
          </Suspense>
        </main>
      </div>
    </ProtectedRoute>
  )
}