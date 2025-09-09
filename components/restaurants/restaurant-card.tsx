import type { Restaurant } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-border/50 hover:border-primary/20 bg-card">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Badge variant="secondary" className="bg-white text-black font-semibold px-4 py-2">
                Currently Closed
              </Badge>
            </div>
          )}

          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{restaurant.rating}</span>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                {restaurant.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{restaurant.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-medium border-primary/20 text-primary bg-primary/5">
                {restaurant.cuisine}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{restaurant.deliveryTime} min</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-1 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">${restaurant.deliveryFee} delivery</span>
              </div>
              <div className="text-sm text-muted-foreground">${restaurant.minimumOrder} minimum</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
