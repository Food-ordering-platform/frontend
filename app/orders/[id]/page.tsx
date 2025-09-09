"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getOrdersByUserId, getRestaurantById, getMenuItemById } from "@/lib/data-service"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OrderStatusTracker } from "@/components/orders/order-status-tracker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Order, Restaurant, MenuItem } from "@/lib/types"

export default function OrderDetailsPage() {
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!user || !params.id) return

      try {
        const userOrders = await getOrdersByUserId(user.id)
        const foundOrder = userOrders.find((o) => o.id === params.id)

        if (foundOrder) {
          setOrder(foundOrder)

          // Load restaurant details
          const restaurantData = await getRestaurantById(foundOrder.restaurantId)
          setRestaurant(restaurantData)

          // Load menu items
          const itemPromises = foundOrder.items.map((item) => getMenuItemById(item.menuItemId))
          const items = await Promise.all(itemPromises)
          setMenuItems(items.filter((item): item is MenuItem => item !== null))
        }
      } catch (error) {
        console.error("Failed to load order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrderDetails()
  }, [user, params.id])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!order || !restaurant) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Order not found</p>
              <Button asChild className="mt-4">
                <Link href="/orders">Back to Orders</Link>
              </Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
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
                <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                <p className="text-muted-foreground">
                  Placed on {new Date(order.orderDate).toLocaleDateString()} at{" "}
                  {new Date(order.orderDate).toLocaleTimeString()}
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
                    <OrderStatusTracker status={order.status} />
                    <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {order.status === "delivered" && order.actualDeliveryTime
                          ? `Delivered at ${new Date(order.actualDeliveryTime).toLocaleTimeString()}`
                          : order.estimatedDeliveryTime
                            ? `Estimated delivery: ${new Date(order.estimatedDeliveryTime).toLocaleTimeString()}`
                            : "Delivery time will be updated soon"}
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
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={restaurant.image || "/placeholder.svg"}
                          alt={restaurant.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
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
                    {order.items.map((orderItem, index) => {
                      const menuItem = menuItems.find((item) => item.id === orderItem.menuItemId)
                      if (!menuItem) return null

                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="relative h-12 w-12 flex-shrink-0">
                            <Image
                              src={menuItem.image || "/placeholder.svg"}
                              alt={menuItem.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{menuItem.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${orderItem.price.toFixed(2)} × {orderItem.quantity}
                            </p>
                            {orderItem.specialInstructions && (
                              <p className="text-xs text-muted-foreground italic">
                                Note: {orderItem.specialInstructions}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(orderItem.price * orderItem.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      )
                    })}
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
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${(order.totalAmount - 2.99 - order.totalAmount * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>$2.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${(order.totalAmount * 0.08).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
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
                    <p className="text-sm">{order.deliveryAddress}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
