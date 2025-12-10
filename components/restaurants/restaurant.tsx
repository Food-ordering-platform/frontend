"use client"

import { useState, useEffect } from "react"
import { useRestaurants } from "@/services/restaurants/restaurants.queries"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Star, Truck, Utensils, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Restaurant } from "@/types/restuarants.type"
import { motion, AnimatePresence } from "framer-motion"

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
          (typeof r.cuisine === 'string' && r.cuisine.toLowerCase().includes(q)) ||
          (typeof r.description === 'string' && r.description.toLowerCase().includes(q))
      )
    }

    if (selectedCuisine) {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine)
    }

    setFilteredRestaurants(filtered)
  }, [restaurants, searchQuery, selectedCuisine])

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine as string).filter(Boolean)))

  // Naira formatter
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Helper to handle missing values
  const getRating = (rating?: number) => rating ?? 4.5; 

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[340px] rounded-3xl bg-gray-100 animate-pulse border border-gray-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
        <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-red-900 font-semibold text-lg">Failed to load restaurants.</p>
            <p className="text-red-600/80 mb-6">Something went wrong while fetching the data.</p>
            <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => window.location.reload()}>
                Try Again
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/60 p-4 transition-all supports-[backdrop-filter]:bg-white/60">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-[#7b1e3a] transition-colors" />
            <Input
              placeholder="What are you craving? (e.g. Jollof, Pizza)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#7b1e3a] focus:ring-[#7b1e3a]/20 rounded-xl transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar mask-gradient-r">
             <Button
                variant={selectedCuisine === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine("")}
                className={`rounded-full px-5 h-10 font-medium transition-all ${
                    selectedCuisine === "" 
                    ? "bg-[#7b1e3a] hover:bg-[#66172e] shadow-md shadow-red-900/10" 
                    : "border-gray-200 text-gray-600 hover:text-[#7b1e3a] hover:border-[#7b1e3a]/30 hover:bg-gray-50"
                }`}
              >
                All
              </Button>
            {cuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine)}
                className={`rounded-full px-5 h-10 font-medium whitespace-nowrap transition-all ${
                    selectedCuisine === cuisine 
                    ? "bg-[#7b1e3a] hover:bg-[#66172e] shadow-md shadow-red-900/10" 
                    : "border-gray-200 text-gray-600 hover:text-[#7b1e3a] hover:border-[#7b1e3a]/30 hover:bg-gray-50"
                }`}
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
          <div className="inline-flex h-20 w-20 bg-white rounded-full items-center justify-center mb-6 shadow-sm border border-gray-100">
            <Utensils className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any matches for your search. Try adjusting your filters.</p>
          <Button 
            variant="link" 
            className="text-[#7b1e3a] mt-4 font-semibold" 
            onClick={() => {setSearchQuery(""); setSelectedCuisine("")}}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                    <Link href={`/restaurant/${restaurant.id}`} className="group block h-full">
                    <Card className="h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl flex flex-col hover:-translate-y-1">
                        {/* Image Header */}
                        <div className="relative h-56 w-full overflow-hidden">
                            <Image
                                src={restaurant.imageUrl || "/placeholder.svg"}
                                alt={restaurant.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60" />
                            
                            {/* Status Badge (Top Left) */}
                            <div className="absolute top-4 left-4">
                                {restaurant.isOpen ? (
                                    <Badge className="bg-green-500/90 hover:bg-green-600 text-white backdrop-blur-md border-0 px-3 py-1 text-xs font-bold shadow-sm flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                        Open Now
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="bg-red-500/90 hover:bg-red-600 backdrop-blur-md border-0 px-3 py-1 text-xs font-bold shadow-sm">
                                        Closed
                                    </Badge>
                                )}
                            </div>

                            {/* Rating Badge (Top Right) */}
                            <div className="absolute top-4 right-4">
                                <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-bold text-gray-800">{getRating(restaurant.rating)}</span>
                                </div>
                            </div>
                            
                            {/* Cuisine Tag (Bottom Left) */}
                            {restaurant.cuisine && (
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                        {restaurant.cuisine}
                                    </span>
                                </div>
                            )}
                        </div>

                        <CardContent className="p-5 flex flex-col flex-1">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#7b1e3a] transition-colors line-clamp-1">
                                    {restaurant.name}
                                </h3>
                            </div>
                            
                            {/* Address */}
                            <div className="flex items-start gap-2 mb-4">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                    {restaurant.address}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                {/* Prep Time */}
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Prep Time</p>
                                        <p className="text-sm font-semibold text-gray-700">{restaurant.prepTime} mins</p>
                                    </div>
                                </div>

                                {/* Delivery Fee */}
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <Truck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Delivery</p>
                                        <p className="text-sm font-semibold text-gray-700">
                                            {restaurant.deliveryFee && restaurant.deliveryFee > 0 
                                                ? formatMoney(restaurant.deliveryFee) 
                                                : "Free"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    </Link>
                </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}