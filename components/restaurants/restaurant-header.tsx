import type { Restaurant } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, DollarSign, MapPin } from "lucide-react"
import Image from "next/image"

interface RestaurantHeaderProps {
  restaurant: Restaurant
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <div className="relative">
      <div className="h-64 md:h-80 relative">
        <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white/90 text-black text-lg px-4 py-2">
              Currently Closed
            </Badge>
          </div>
        )}
      </div>

      <div className="container relative -mt-16 md:-mt-20">
        <div className="bg-background rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
              <p className="text-muted-foreground text-lg">{restaurant.description}</p>
            </div>
            <div className="flex items-center space-x-1 bg-primary/10 px-3 py-1 rounded-full">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">{restaurant.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {restaurant.cuisine}
            </Badge>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>${restaurant.deliveryFee} delivery fee</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <span>${restaurant.minimumOrder} minimum order</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{restaurant.address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
