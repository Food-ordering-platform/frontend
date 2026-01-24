"use client"

import type { Order } from "@/types/order.type"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Package, ArrowRight, ChefHat, Truck, CheckCircle2, XCircle, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface OrderCardProps {
  order: Order
  onRate?: (orderId: string) => void
}

// Helper for Naira
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "bg-blue-100 text-blue-700 border-blue-200" },
  preparing: { label: "Cooking", icon: ChefHat, color: "bg-orange-100 text-orange-700 border-orange-200" },
  out_for_delivery: { label: "On the way", icon: Truck, color: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "Delivered", icon: Package, color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700 border-red-200" },
} as const

export function OrderCard({ order, onRate }: OrderCardProps) {
  const statusKey = (order.status?.toLowerCase().replace(/-/g, "_") || "pending") as keyof typeof statusConfig
  const config = statusConfig[statusKey] || statusConfig.pending
  const StatusIcon = config.icon
  const isDelivered = statusKey === 'delivered';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="block group relative">
        <Link href={`/orders/details?reference=${order.reference}`} className="absolute inset-0 z-0" />
        
        <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white relative z-10">
          
          {/* Decorative side bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isDelivered ? 'bg-green-500' : 'bg-[#7b1e3a]'}`} />

          <CardContent className="p-5 pl-7">
            <div className="flex justify-between items-start mb-4 relative z-20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                  <Badge variant="outline" className="font-mono text-[10px] text-gray-500">
                    #{order.reference?.slice(-6).toUpperCase() || "REF"}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#7b1e3a] transition-colors">
                  {formatMoney(order.totalAmount)}
                </h3>
              </div>
              <Badge className={`${config.color} border shadow-none px-2.5 py-0.5 rounded-full flex items-center gap-1.5`}>
                <StatusIcon className="h-3 w-3" />
                <span className="font-semibold text-[10px] uppercase tracking-wide">{config.label}</span>
              </Badge>
            </div>

            <div className="space-y-3 relative z-20">
              <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50/50 p-2.5 rounded-lg">
                <MapPin className="h-4 w-4 text-[#7b1e3a] mt-0.5 shrink-0" />
                <span className="line-clamp-1 font-medium">{order.deliveryAddress}</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 px-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  <span>{order.items?.length || 0} Items</span>
                </div>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center relative z-20">
               <Link href={`/orders/details?reference=${order.reference}`} className="text-xs font-semibold text-[#7b1e3a] hover:underline flex items-center gap-1">
                  View Details <ArrowRight className="h-3 w-3" />
               </Link>

               {/* RATING SECTION */}
               {isDelivered && (
                 <div className="flex items-center">
                    {order.review ? (
                        <div className="flex flex-col items-end">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        className={`h-3 w-3 ${star <= order.review!.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">You Rated</span>
                        </div>
                    ) : (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs border-[#7b1e3a] text-[#7b1e3a] hover:bg-[#7b1e3a] hover:text-white"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent navigating to details
                                onRate?.(order.id);
                            }}
                        >
                            <Star className="mr-1.5 h-3 w-3" /> Rate Order
                        </Button>
                    )}
                 </div>
               )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}