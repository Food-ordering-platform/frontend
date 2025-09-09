import type { Order } from "@/lib/types"
import { Check, Clock, ChefHat, Truck, Package } from "lucide-react"

interface OrderStatusTrackerProps {
  status: Order["status"]
}

const steps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "out-for-delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
]

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === status)

  if (status === "cancelled") {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center space-x-2 text-red-600">
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-sm font-medium">✕</span>
          </div>
          <span className="font-medium">Order Cancelled</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = index <= currentStepIndex
        const isCurrent = index === currentStepIndex

        return (
          <div key={step.key} className="flex items-center space-x-3">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                isCompleted
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
            </div>
            {isCompleted && index < currentStepIndex && (
              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
