"use client"

import { useState, useMemo } from "react"
import { useGetOrders } from "../../services/order/order.queries"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Clock, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const { user } = useAuth()
  const customerId = user?.id
  const { data: orders = [], isLoading, isError } = useGetOrders(customerId!)

  const [filter, setFilter] = useState<string>("all")

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  const getStatusStats = () => {
    const pending = orders.filter((o) => o.status === "pending").length
    const delivered = orders.filter((o) => o.status === "delivered").length
    const inProgress = orders.filter((o) =>
      ["confirmed", "preparing", "out_for_delivery"].includes(o.status)
    ).length
    return { pending, delivered, inProgress }
  }

  const stats = getStatusStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-500 font-medium">
        Failed to load your orders. Please try again.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gradient-red mb-2">Your Orders</h1>
            <p className="text-muted-foreground text-lg">
              Track and manage your food orders
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-red-light rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-muted-foreground">Pending Orders</p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-muted-foreground">In Progress</p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.delivered}</p>
                <p className="text-muted-foreground">Delivered</p>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Filter by status:
            </span>
            {[
              { key: "all", label: "All Orders" },
              { key: "pending", label: "Pending" },
              { key: "confirmed", label: "Confirmed" },
              { key: "preparing", label: "Preparing" },
              { key: "out_for_delivery", label: "Out for Delivery" },
              { key: "delivered", label: "Delivered" },
            ].map((status) => (
              <Button
                key={status.key}
                variant={filter === status.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status.key)}
                className="whitespace-nowrap rounded-full"
              >
                {status.label}
              </Button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-20 w-20 bg-gradient-red-light rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {filter === "all" ? "No orders yet" : `No ${filter} orders`}
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === "all"
                      ? "Start browsing restaurants to place your first order!"
                      : `You don’t have any ${filter} orders at the moment.`}
                  </p>
                </div>
                {filter === "all" && (
                  <Button asChild className="bg-gradient-red hover:bg-gradient-red-light">
                    <Link href="/">Browse Restaurants</Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/order/${order.id}`}
                  className="block bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-semibold">Ref: {order.reference}</p>
                      <p className="text-sm text-gray-600">₦{order.totalAmount}</p>
                      <p className="text-sm capitalize">Status: {order.status}</p>
                      <p className="text-xs text-gray-500">
                        Payment: {order.paymentStatus}
                      </p>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
