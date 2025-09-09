import type { Order } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Package, ArrowRight } from "lucide-react"
import Link from "next/link"

interface OrderCardProps {
  order: Order
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  "out-for-delivery": "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels = {
  pending: "Order Pending",
  confirmed: "Confirmed",
  preparing: "Being Prepared",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

const statusIcons = {
  pending: Clock,
  confirmed: Package,
  preparing: Package,
  "out-for-delivery": Package,
  delivered: Package,
  cancelled: Package,
}

export function OrderCard({ order }: OrderCardProps) {
  const StatusIcon = statusIcons[order.status]

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-red-light rounded-lg flex items-center justify-center">
                <StatusIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Order #{order.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
          <Badge className={`${statusColors[order.status]} font-semibold px-3 py-1 border`}>
            {statusLabels[order.status]}
          </Badge>
        </div>

        <div className="space-y-3 mb-6 bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
              <p className="font-medium truncate">{order.deliveryAddress}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {order.status === "delivered" ? "Delivered At" : "Estimated Delivery"}
              </p>
              <p className="font-medium">
                {order.status === "delivered" && order.actualDeliveryTime
                  ? new Date(order.actualDeliveryTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : order.estimatedDeliveryTime
                    ? new Date(order.estimatedDeliveryTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Calculating..."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""} ordered
            </p>
            <p className="font-bold text-2xl text-primary">${order.totalAmount.toFixed(2)}</p>
          </div>
          <Button
            variant="outline"
            asChild
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 font-semibold bg-transparent"
          >
            <Link href={`/orders/${order.id}`} className="flex items-center gap-2">
              View Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
