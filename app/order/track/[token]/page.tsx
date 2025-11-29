"use client"

//Temporal Code
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getOrderByToken } from "@/services/order/order"
import { Order } from "@/types/order.type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Package, CheckCircle, XCircle, ChefHat, Truck, RefreshCw } from "lucide-react"

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending", icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "text-blue-600", bgColor: "bg-blue-100" },
  { value: "PREPARING", label: "Preparing", icon: ChefHat, color: "text-orange-600", bgColor: "bg-orange-100" },
  { value: "ON_THE_WAY", label: "On the Way", icon: Truck, color: "text-purple-600", bgColor: "bg-purple-100" },
  { value: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" },
]

export default function TrackOrderPage() {
  const params = useParams()
  const token = params.token as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchOrder = async () => {
    try {
      setError(null)
      const data = await getOrderByToken(token)
      setOrder(data)
      setLastUpdated(new Date())
    } catch (err: any) {
      setError(err.message || "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrder()
    }
  }, [token])

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!token || loading) return

    const interval = setInterval(() => {
      fetchOrder()
    }, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [token, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-4">{error || "The order could not be found."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentStatusIndex = ORDER_STATUSES.findIndex((s) => s.value === order.status)
  const currentStatus = ORDER_STATUSES[currentStatusIndex] || ORDER_STATUSES[0]
  const StatusIcon = currentStatus.icon

  // Calculate progress percentage
  const progressPercentage = ((currentStatusIndex + 1) / ORDER_STATUSES.length) * 100

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Order Reference: {order.reference}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Auto-updating...
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Status Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${currentStatus.color}`} />
                Current Status: {currentStatus.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${currentStatus.bgColor}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Order Placed</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* Status Steps */}
              <div className="space-y-4">
                {ORDER_STATUSES.map((status, index) => {
                  const StatusIcon = status.icon
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex

                  return (
                    <div key={status.value} className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? status.bgColor : "bg-muted"
                        }`}
                      >
                        <StatusIcon
                          className={`h-5 w-5 ${
                            isCompleted ? status.color : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            isCompleted ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {status.label}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-muted-foreground">Current status</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">₦{order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <p className="font-semibold capitalize">{order.paymentStatus.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                {order.restaurant && (
                  <div>
                    <p className="text-sm text-muted-foreground">Restaurant</p>
                    <p className="font-medium">{order.restaurant.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.deliveryAddress}</p>
                {order.restaurant?.phone && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Restaurant Phone: {order.restaurant.phone}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.menuItem?.name || "Item"}</p>
                      {item.menuItem?.description && (
                        <p className="text-sm text-muted-foreground">{item.menuItem.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

