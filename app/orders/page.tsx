"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getOrdersByUserId } from "@/lib/data-service"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OrderCard } from "@/components/orders/order-card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Clock, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return

      try {
        const userOrders = await getOrdersByUserId(user.id)
        setOrders(userOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()))
      } catch (error) {
        console.error("Failed to load orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user])

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true
    return order.status === filter
  })

  const getStatusStats = () => {
    const pending = orders.filter((o) => o.status === "pending").length
    const delivered = orders.filter((o) => o.status === "delivered").length
    const inProgress = orders.filter((o) => ["confirmed", "preparing", "out_for_delivery"].includes(o.status)).length

    return { pending, delivered, inProgress }
  }

  const stats = getStatusStats()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/20">
        <Header />
        <main className="container py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gradient-red mb-2">Your Orders</h1>
              <p className="text-muted-foreground text-lg">Track and manage your food orders</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-red-light rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-muted-foreground">Pending Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                    <p className="text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.delivered}</p>
                    <p className="text-muted-foreground">Delivered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter by status:</span>
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

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
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
                        : `You don't have any ${filter} orders at the moment.`}
                    </p>
                  </div>
                  {filter === "all" && (
                    <Button asChild className="bg-gradient-red hover:bg-gradient-red-light">
                      <Link href="/restaurants">Browse Restaurants</Link>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
