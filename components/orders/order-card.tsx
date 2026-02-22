"use client"

import type { Order } from "@/types/order.type"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Clock, MapPin, Package, ArrowRight, ChefHat, Truck, 
  CheckCircle2, XCircle, Star, Store, Receipt, CalendarDays 
} from "lucide-react"
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
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "bg-blue-50 text-blue-700 border-blue-200" },
  preparing: { label: "Cooking", icon: ChefHat, color: "bg-orange-50 text-orange-700 border-orange-200" },
  out_for_delivery: { label: "On the way", icon: Truck, color: "bg-purple-50 text-purple-700 border-purple-200" },
  delivered: { label: "Delivered", icon: Package, color: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-50 text-red-700 border-red-200" },
} as const

export function OrderCard({ order, onRate }: OrderCardProps) {
  const statusKey = (order.status?.toLowerCase().replace(/-/g, "_") || "pending") as keyof typeof statusConfig
  const config = statusConfig[statusKey] || statusConfig.pending
  const StatusIcon = config.icon
  const isDelivered = statusKey === 'delivered';

  // Generate a comma-separated string of items
  const itemsSummary = order.items?.map(item => `${item.quantity}x ${item.menuItemName}`).join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="block group relative">
        {/* Full Card Link Overlay */}
        <Link href={`/orders/details?reference=${order.reference}`} className="absolute inset-0 z-0" />
        
        <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white relative z-10 group-hover:border-[#7b1e3a]/30">
          
          <CardContent className="p-0">
            {/* --- HEADER: Restaurant & Status --- */}
            <div className="p-5 flex justify-between items-start bg-gray-50/50 border-b border-gray-100">
                <div className="flex gap-3">
                    <Avatar className="h-10 w-10 border border-gray-200 rounded-lg">
                        <AvatarImage src={order.restaurant?.imageUrl || ""} alt={order.restaurant?.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-white text-gray-400">
                            <Store className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">
                            {order.restaurant?.name || "ChowEazy Vendor"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-500 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                #{order.reference?.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400">•</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                
                <Badge className={`${config.color} border px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm`}>
                    <StatusIcon className="h-3 w-3" />
                    <span className="font-bold text-[10px] uppercase tracking-wide">{config.label}</span>
                </Badge>
            </div>

            {/* --- BODY: Items & Price --- */}
            <div className="p-5 space-y-4">
                {/* Price Display */}
                <div className="flex justify-between items-end">
                    <div className="space-y-1 flex-1 pr-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <Receipt className="h-3 w-3" /> Order Summary
                        </p>
                        <p className="text-sm text-gray-700 font-medium line-clamp-2 leading-relaxed">
                            {itemsSummary || "No items listed"}
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                         <span className="text-xl font-extrabold text-[#7b1e3a]">
                            {formatMoney(order.totalAmount)}
                        </span>
                    </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Delivery Info */}
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                        <MapPin className="h-3 w-3 text-[#7b1e3a]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Delivering To</p>
                        <p className="text-xs font-semibold text-gray-700 line-clamp-1 mt-0.5">
                            {order.deliveryAddress}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- FOOTER: Actions --- */}
            <div className="px-5 pb-5 pt-0 flex justify-between items-center relative z-20">
               <Link 
                 href={`/orders/details?reference=${order.reference}`} 
                 className="text-xs font-bold text-[#7b1e3a] hover:underline flex items-center gap-1 transition-transform group-hover:translate-x-1"
               >
                  View Full Details <ArrowRight className="h-3 w-3" />
               </Link>

               {/* Conditional Rating Button */}
               {isDelivered && (
                 <div className="flex items-center">
                    {order.review ? (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                             <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                             <span className="text-xs font-bold text-yellow-700">{order.review.rating}.0</span>
                        </div>
                    ) : (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-xs font-semibold border-gray-200 text-gray-600 hover:border-[#7b1e3a] hover:text-[#7b1e3a] bg-white shadow-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                onRate?.(order.id);
                            }}
                        >
                            <Star className="mr-1.5 h-3.5 w-3.5" /> Rate Order
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