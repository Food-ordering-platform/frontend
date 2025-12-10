"use client"

import { useState, useEffect } from "react"
import { useRestaurants } from "@/services/restaurants/restaurants.queries"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Star, Truck, Utensils } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Restaurant } from "@/types/restuarants.type"

export function Restaurants() {
  const { data: restaurantResponse, isLoading, error } = useRestaurants()
  const restaurants = restaurantResponse?.data || []

  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("")

  // Update filtered list when data or filters change
  useEffect(() => {
    let filtered = restaurants

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      )
    }

    if (selectedCuisine) {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine)
    }

    setFilteredRestaurants(filtered)
  }, [restaurants, searchQuery, selectedCuisine])

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)))

  // Naira formatter
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
        <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-600 font-medium">Failed to load restaurants.</p>
            <Button variant="outline" className="mt-4 border-red-200 text-red-700" onClick={() => window.location.reload()}>
                Try Again
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-4 transition-all">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="What are you craving? (e.g. Jollof, Pizza)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#7b1e3a]"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
             <Button
                variant={selectedCuisine === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine("")}
                className={`rounded-full px-4 ${selectedCuisine === "" ? "bg-[#7b1e3a] hover:bg-[#66172e]" : "hover:text-[#7b1e3a] hover:border-[#7b1e3a]/30"}`}
              >
                All
              </Button>
            {cuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine)}
                className={`rounded-full px-4 whitespace-nowrap ${selectedCuisine === cuisine ? "bg-[#7b1e3a] hover:bg-[#66172e]" : "hover:text-[#7b1e3a] hover:border-[#7b1e3a]/30"}`}
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="inline-flex h-16 w-16 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Utensils className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No restaurants found</h3>
          <p className="text-gray-500">We couldn't find any matches for your search.</p>
          <Button 
            variant="link" 
            className="text-[#7b1e3a] mt-2" 
            onClick={() => {setSearchQuery(""); setSelectedCuisine("")}}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`} className="group">
              <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white ring-1 ring-gray-100 rounded-2xl">
                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={restaurant.imageUrl || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className="bg-white/90 text-black backdrop-blur-sm border-0 shadow-sm font-bold flex gap-1 items-center px-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                    </Badge>
                  </div>

                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <Badge variant="secondary" className="bg-white text-black font-bold px-4 py-1.5">
                        Closed
                      </Badge>
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 left-3 text-white">
                     <p className="text-xs font-medium text-white/80 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-md inline-block mb-1">
                        {restaurant.cuisine}
                     </p>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#7b1e3a] transition-colors line-clamp-1">
                        {restaurant.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 leading-relaxed">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-orange-500" />
                      <span>{restaurant.deliveryTime} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-blue-500" />
                      <span>{formatMoney(restaurant.deliveryFee)}</span>
                    </div>
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