"use client"

import { useState, useMemo } from "react"
import { useGetOrders } from "../../services/order/order.queries"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderCard } from "@/components/orders/order-card"
import { ShoppingBag, RefreshCw, Filter } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function OrdersPage() {
  const { user } = useAuth()
  const customerId = user?.id
  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetOrders(customerId!)

  const [filter, setFilter] = useState<string>("all")

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders
    return orders.filter((o) => {
        if (filter === "active") return ["pending", "preparing", "out_for_delivery", "confirmed"].includes(o.status);
        if (filter === "completed") return ["delivered", "cancelled"].includes(o.status);
        return o.status === filter
    })
  }, [orders, filter])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/30">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b1e3a]"></div>
            <p className="text-gray-500 animate-pulse font-medium">Loading your history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans">
      <Header />
      <main className="container py-8 md:py-12 flex-1 max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Order History
                </h1>
                <p className="text-gray-500 text-lg">
                    Track your current orders and rediscover past favorites.
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-2 bg-white border-gray-200 text-gray-600 hover:text-[#7b1e3a] hover:border-[#7b1e3a]"
            >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                {isFetching ? "Refreshing..." : "Refresh List"}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {["all", "active", "completed"].map((key) => (
                <Button
                    key={key}
                    variant={filter === key ? "default" : "outline"}
                    onClick={() => setFilter(key)}
                    className={`rounded-full px-6 capitalize transition-all duration-300 ${
                        filter === key 
                        ? "bg-[#7b1e3a] hover:bg-[#66172e] text-white shadow-md shadow-red-900/10" 
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                >
                    {key}
                </Button>
            ))}
          </div>

          {/* Orders Grid */}
          <AnimatePresence mode="wait">
            {filteredOrders.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm"
                >
                    <div className="h-20 w-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="h-10 w-10 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        {filter === "all" 
                            ? "Looks like you haven't ordered anything yet. Time to change that!" 
                            : "No orders match the selected filter."}
                    </p>
                    {filter === "all" && (
                        <Button asChild size="lg" className="bg-[#7b1e3a] hover:bg-[#66172e] rounded-full px-8 shadow-lg shadow-red-900/20">
                            <Link href="/restaurants">Start Ordering</Link>
                        </Button>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order, index) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
          </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}