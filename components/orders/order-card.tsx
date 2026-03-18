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
            <div className="p-4 sm:p-5 flex justify-between items-start gap-3 bg-gray-50/50 border-b border-gray-100">
                <div className="flex gap-3 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 border border-gray-200 rounded-lg shrink-0">
                        <AvatarImage src={order.restaurant?.imageUrl || ""} alt={order.restaurant?.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-white text-gray-400">
                            <Store className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    
                    {/* min-w-0 allows the truncate to work properly inside flex */}
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 leading-tight truncate">
                            {order.restaurant?.name || "ChowEazy Vendor"}
                        </h3>
                        {/* flex-wrap ensures it breaks to the next line on tiny screens if ref is long */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                            <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 truncate max-w-[100px] sm:max-w-[150px]">
                                Ref: {order.reference}
                            </span>
                            <span className="text-[10px] text-gray-400 hidden sm:inline">•</span>
                            <span className="text-[9px] sm:text-xs text-gray-500 flex items-center gap-1 shrink-0">
                                <CalendarDays className="h-3 w-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* shrink-0 prevents the badge from being squished by long restaurant names */}
                <Badge className={`${config.color} shrink-0 border px-2 py-1 sm:px-2.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-sm`}>
                    <StatusIcon className="h-3 w-3 hidden sm:block" />
                    <span className="font-bold text-[9px] sm:text-[10px] uppercase tracking-wide">{config.label}</span>
                </Badge>
            </div>

            {/* --- BODY: Items & Price --- */}
            <div className="p-4 sm:p-5 space-y-4">
                {/* Changes to col on mobile, row on tablet/desktop */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0">
                    <div className="space-y-1 flex-1 pr-0 sm:pr-4 w-full">
                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <Receipt className="h-3 w-3" /> Order Summary
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 font-medium line-clamp-2 leading-relaxed">
                            {itemsSummary || "No items listed"}
                        </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                         <span className="text-lg sm:text-xl font-extrabold text-[#7b1e3a]">
                            {formatMoney(order.totalAmount)}
                        </span>
                    </div>
                </div>

                <Separator className="bg-gray-100" />
            </div>

            {/* --- FOOTER: Actions --- */}
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 flex justify-between items-center relative z-20">
               <Link 
                 href={`/orders/details?reference=${order.reference}`} 
                 className="text-[10px] sm:text-xs font-bold text-[#7b1e3a] hover:underline flex items-center gap-1 transition-transform group-hover:translate-x-1"
               >
                 View Full Details <ArrowRight className="h-3 w-3" />
               </Link>

               {/* Conditional Rating Button */}
               {isDelivered && (
                 <div className="flex items-center">
                    {order.review ? (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                             <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                             <span className="text-[10px] sm:text-xs font-bold text-yellow-700">{order.review.rating}.0</span>
                        </div>
                    ) : (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold border-gray-200 text-gray-600 hover:border-[#7b1e3a] hover:text-[#7b1e3a] bg-white shadow-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                onRate?.(order.id);
                            }}
                        >
                            <Star className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" /> Rate Order
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