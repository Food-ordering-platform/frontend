"use client"

import { useState, useMemo } from "react"
import { useGetOrders } from "../../services/order/order.queries"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderCard } from "@/components/orders/order-card"
import { ShoppingBag, RefreshCw } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { RatingDialog } from "@/components/orders/rating-dialog"

// 🟢 Define exactly which statuses belong to which tab based on your backend
const ACTIVE_STATUSES = [
  "PENDING", 
  "PREPARING", 
  "READY_FOR_PICKUP", 
  "RIDER_ACCEPTED", 
  "OUT_FOR_DELIVERY"
];

const COMPLETED_STATUSES = [
  "DELIVERED", 
  "CANCELLED", 
  "REFUNDED"
];

export default function OrdersPage() {
  const { user } = useAuth()
  const { data: orders = [], isLoading, refetch, isFetching } = useGetOrders(user?.id!)
  const [filter, setFilter] = useState<string>("all")
  
  // Rating State
  const [orderToRate, setOrderToRate] = useState<string | null>(null);

  // 🟢 Calculate stats using the exact uppercase arrays
  const activeCount = orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length;
  const completedCount = orders.filter(o => COMPLETED_STATUSES.includes(o.status)).length;
  const allCount = orders.length;

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders
    return orders.filter((o) => {
        // 🟢 Filter using the exact uppercase arrays
        if (filter === "active") return ACTIVE_STATUSES.includes(o.status);
        if (filter === "completed") return COMPLETED_STATUSES.includes(o.status);
        return o.status === filter;
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
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
                <p className="text-gray-500 text-lg">Track your current orders and rediscover past favorites.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2 bg-white border-gray-200 text-gray-600 hover:text-[#7b1e3a] hover:border-[#7b1e3a] active:scale-95 transition-transform">
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                {isFetching ? "Refreshing..." : "Refresh List"}
            </Button>
          </div>

          {/* ACTIVE TABS */}
          <div className="flex justify-start mb-8">
            <div className="flex p-1 bg-white border border-gray-200 rounded-xl relative shadow-sm">
                {[
                    { key: "all", label: "All Orders", count: allCount },
                    { key: "active", label: "Active", count: activeCount },
                    { key: "completed", label: "Completed", count: completedCount }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`relative px-6 py-2.5 text-sm font-medium rounded-lg z-10 transition-colors duration-200 flex items-center gap-2 ${
                            filter === tab.key ? "text-[#7b1e3a]" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {filter === tab.key && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-[#7b1e3a]/5 rounded-lg border border-[#7b1e3a]/10 -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {tab.label}
                        <Badge variant="secondary" className={`h-5 min-w-5 px-1.5 rounded-full ${filter === tab.key ? 'bg-[#7b1e3a] text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {tab.count}
                        </Badge>
                    </button>
                ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredOrders.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                    <div className="h-20 w-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="h-10 w-10 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        {filter === "all" ? "Looks like you haven't ordered anything yet." : "No orders match this filter."}
                    </p>
                    {filter === "all" && (
                        <Button asChild size="lg" className="bg-[#7b1e3a] hover:bg-[#66172e] rounded-full px-8 shadow-lg shadow-red-900/20">
                            <Link href="/restaurants">Start Ordering</Link>
                        </Button>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onRate={(id) => setOrderToRate(id)}
                        />
                    ))}
                </div>
            )}
          </AnimatePresence>

          {/* Rating Dialog */}
          {/* <RatingDialog 
             orderId={orderToRate || ""} 
             isOpen={!!orderToRate} 
             onClose={() => {
                setOrderToRate(null);
                refetch(); // Refresh to show the new rating
             }} 
          /> */}
      </main>
      <Footer />
    </div>
  )
}