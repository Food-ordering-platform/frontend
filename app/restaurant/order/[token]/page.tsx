"use client"
//Temporal Code

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getOrderByToken, updateOrderStatusByToken } from "@/services/order/order"
import { Order } from "@/types/order.type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Package, CheckCircle, XCircle, ChefHat, Truck } from "lucide-react"

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending", icon: Clock, color: "text-yellow-600" },
  { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "text-blue-600" },
  { value: "PREPARING", label: "Preparing", icon: ChefHat, color: "text-orange-600" },
  { value: "ON_THE_WAY", label: "On the Way", icon: Truck, color: "text-purple-600" },
  { value: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "text-green-600" },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-600" },
]

export default function RestaurantOrderPage() {
  const params = useParams()
  const token = params.token as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrderByToken(token)
      setOrder(data)
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

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true)
      const updatedOrder = await updateOrderStatusByToken(token, newStatus)
      setOrder(updatedOrder)
    } catch (err: any) {
      setError(err.message || "Failed to update status")
    } finally {
      setUpdating(false)
    }
  }

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
              <Button onClick={fetchOrder}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentStatusIndex = ORDER_STATUSES.findIndex((s) => s.value === order.status)
  const StatusIcon = ORDER_STATUSES[currentStatusIndex]?.icon || Clock

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Restaurant Order Dashboard</h1>
          <p className="text-muted-foreground">Order Token: <code className="bg-muted px-2 py-1 rounded">{token}</code></p>
        </div>

        <div className="grid gap-6">
          {/* Order Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Reference</p>
                  <p className="font-semibold">{order.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold">₦{order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <p className="font-semibold capitalize">{order.paymentStatus.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 ${ORDER_STATUSES[currentStatusIndex]?.color || ""}`} />
                    <p className="font-semibold">{ORDER_STATUSES[currentStatusIndex]?.label || order.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>

              {order.restaurant && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Restaurant</p>
                  <p className="font-medium">{order.restaurant.name}</p>
                  {order.restaurant.address && (
                    <p className="text-sm text-muted-foreground">{order.restaurant.address}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.menuItem?.name || "Item"}</p>
                      {item.menuItem?.description && (
                        <p className="text-sm text-muted-foreground">{item.menuItem.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ORDER_STATUSES.map((status) => {
                  const StatusIcon = status.icon
                  const isCurrent = order.status === status.value
                  const isDisabled = updating || isCurrent

                  return (
                    <Button
                      key={status.value}
                      variant={isCurrent ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleStatusUpdate(status.value)}
                      disabled={isDisabled}
                    >
                      <StatusIcon className={`h-4 w-4 ${status.color}`} />
                      <span>{status.label}</span>
                      {isCurrent && <span className="ml-auto text-xs">(Current)</span>}
                    </Button>
                  )
                })}
              </div>
              {updating && (
                <p className="text-sm text-muted-foreground mt-4 text-center">Updating status...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

