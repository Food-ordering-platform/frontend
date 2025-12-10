"use client"
import { useState, useMemo } from "react"
import { useGetOrders } from "../../services/order/order.queries"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingBag, Clock, CheckCircle2, Truck, RefreshCw, Package, ChefHat, MapPin } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const { user } = useAuth()
  const customerId = user?.id
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetOrders(customerId!)

  const [filter, setFilter] = useState<string>("all")

  // Helper for Naira
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Helper for Status Colors
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
          case 'preparing': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'out_for_delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
  }

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  const stats = {
    pending: orders.filter((o) => ["pending", "confirmed", "preparing"].includes(o.status)).length,
    delivering: orders.filter((o) => o.status === "out_for_delivery").length,
    completed: orders.filter((o) => o.status === "delivered").length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7b1e3a]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      <main className="container py-8 flex-1">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
                <p className="text-gray-500 mt-1">Track current deliveries and view past meals</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-2 bg-white hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                Refresh List
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <ChefHat className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">In Kitchen</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Truck className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.delivering}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">On the way</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Delivered</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                 {/* Tabs */}
                 <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {["all", "pending", "preparing", "out_for_delivery", "delivered"].map((key) => (
                        <Button
                            key={key}
                            variant={filter === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(key)}
                            className={`rounded-full capitalize ${filter === key ? "bg-[#7b1e3a] hover:bg-[#66172e]" : "text-gray-600"}`}
                        >
                            {key.replace(/_/g, " ")}
                        </Button>
                    ))}
                 </div>

                 {/* List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="inline-flex h-16 w-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                            <ShoppingBag className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="text-gray-500 mb-6">You haven't placed any orders in this category yet.</p>
                        {filter === "all" && (
                            <Button asChild className="bg-[#7b1e3a] hover:bg-[#66172e]">
                            <Link href="/restaurants">Start Ordering</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredOrders.map((order) => (
                            <Link 
                                key={order.id} 
                                href={`/order/${order.id}`}
                                className="block group"
                            >
                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-[#7b1e3a]/30">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-900 group-hover:text-[#7b1e3a] transition-colors">
                                                        Order #{order.reference.slice(-6)}
                                                    </h3>
                                                    <Badge variant="outline" className={`capitalize font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status.replace(/_/g, " ")}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> 
                                                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-[#7b1e3a]">{formatMoney(order.totalAmount)}</p>
                                            <p className="text-xs text-gray-400 font-medium uppercase">{order.paymentStatus}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="truncate max-w-[200px] md:max-w-md">{order.deliveryAddress}</span>
                                        </div>
                                        <span className="text-[#7b1e3a] font-medium text-xs hover:underline">View Details</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
          </div>
      </main>
      <Footer />
    </div>
  )
}