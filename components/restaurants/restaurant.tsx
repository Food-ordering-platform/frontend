"use client"

import { useState, useEffect } from "react"
import { useRestaurants } from "@/services/restaurants/restaurants.queries"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MapPin, Clock, Star, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Restaurant } from "@/types/restuarants.type"

export function Restaurants() {
  const { data: restaurantResponse, isLoading, error } = useRestaurants()
  const restaurants = restaurantResponse?.data || []

  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("")

  useEffect(() => {
    setFilteredRestaurants(restaurants)
  }, [restaurants])

  useEffect(() => {
    let filtered = restaurants

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by cuisine
    if (selectedCuisine) {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine)
    }

    setFilteredRestaurants(filtered)
  }, [restaurants, searchQuery, selectedCuisine])

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-center py-12">Failed to load restaurants</p>
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Delivering to your location
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-border/50 focus:border-primary/50 rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground flex-shrink-0">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>
            <Button
              variant={selectedCuisine === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCuisine("")}
              className="flex-shrink-0 rounded-full"
            >
              All Cuisines
            </Button>
            {cuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine)}
                className="flex-shrink-0 rounded-full"
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl">
          <div className="max-w-md mx-auto space-y-3">
            <div className="h-16 w-16 bg-gradient-red-light rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold">No restaurants found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find more options.
            </p>
          </div>
        </div>
      ) : (
        <div className="responsive-grid responsive-grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-border/50 hover:border-primary/20 bg-card">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={restaurant.imageUrl || "/placeholder.svg"}
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
                  <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center justify-between mt-4">
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
