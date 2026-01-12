"use client"

import { useState, useEffect } from "react"
import { useRestaurants } from "@/services/restaurants/restaurants.queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Truck, Utensils, Info, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Restaurant } from "@/types/restuarants.type"
import { motion, AnimatePresence } from "framer-motion"

export function Restaurants() {
  const { data: restaurantResponse, isLoading, error } = useRestaurants()
  const restaurants = restaurantResponse?.data || []

  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState<string>("")

  // Update filtered list when cuisine changes
  useEffect(() => {
    if (selectedCuisine) {
      setFilteredRestaurants(restaurants.filter((r) => r.cuisine === selectedCuisine))
    } else {
      setFilteredRestaurants(restaurants)
    }
  }, [restaurants, selectedCuisine])

  // Extract unique cuisines
  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine as string).filter(Boolean)))

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getRating = (rating?: number) => rating ?? 4.5; 

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[400px] rounded-[32px] bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
        <div className="text-center py-20 bg-red-50/50 rounded-3xl border border-red-100">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Info className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Unable to load restaurants</h3>
            <p className="text-gray-500 mb-6 mt-2">We encountered an issue fetching the data.</p>
            <Button className="bg-[#7b1e3a] hover:bg-[#60152b] rounded-full px-8" onClick={() => window.location.reload()}>
                Try Again
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-12">
      
      {/* 🟢 REDESIGNED CATEGORY PILLS (Centered, no search bar) */}
      {cuisines.length > 0 && (
        <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 overflow-x-auto p-2 bg-gray-100/80 backdrop-blur-md rounded-full border border-gray-200/50 max-w-full no-scrollbar">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCuisine("")}
                    className={`rounded-full px-6 h-9 font-medium transition-all ${
                        selectedCuisine === "" 
                        ? "bg-white text-[#7b1e3a] shadow-sm font-bold" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                    }`}
                >
                    All
                </Button>
                {cuisines.map((cuisine) => (
                <Button
                    key={cuisine}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`rounded-full px-6 h-9 font-medium whitespace-nowrap transition-all ${
                        selectedCuisine === cuisine 
                        ? "bg-white text-[#7b1e3a] shadow-sm font-bold" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                    }`}
                >
                    {cuisine}
                </Button>
                ))}
            </div>
        </div>
      )}

      {/* 🟡 RESTAURANT GRID */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-32">
          <div className="inline-flex h-24 w-24 bg-gray-50 rounded-full items-center justify-center mb-6">
            <Utensils className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">No restaurants found</h3>
          <p className="text-gray-500 mt-2">Try selecting "All" to see everything available.</p>
          <Button 
            variant="link" 
            className="text-[#7b1e3a] mt-4 font-semibold" 
            onClick={() => setSelectedCuisine("")}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          <AnimatePresence mode="popLayout">
            {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                    <Link href={`/restaurant/${restaurant.id}`} className="group block h-full">
                        <Card className="h-full border-0 shadow-none bg-transparent flex flex-col group">
                            
                            {/* IMAGE CARD */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] shadow-sm group-hover:shadow-xl transition-all duration-500">
                                <Image
                                    src={restaurant.imageUrl || "/placeholder.svg"}
                                    alt={restaurant.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                
                                {/* Top Badges */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                    <Badge className={`backdrop-blur-md border-0 px-3 py-1.5 text-xs font-bold shadow-sm ${
                                        restaurant.isOpen 
                                        ? "bg-white/90 text-green-700" 
                                        : "bg-black/60 text-white"
                                    }`}>
                                        {restaurant.isOpen ? "Open Now" : "Closed"}
                                    </Badge>

                                    <div className="bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-[#7b1e3a] text-[#7b1e3a]" />
                                        <span className="text-xs font-extrabold text-gray-900">{getRating(restaurant.rating)}</span>
                                    </div>
                                </div>

                                {/* Delivery Time Pill (Bottom Right) */}
                                <div className="absolute bottom-4 right-4">
                                     <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                                        <span className="text-xs font-bold text-gray-800">{restaurant.prepTime} mins</span>
                                    </div>
                                </div>
                            </div>

                            {/* CONTENT BELOW IMAGE */}
                            <CardContent className="px-2 py-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#7b1e3a] transition-colors leading-tight">
                                        {restaurant.name}
                                    </h3>
                                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                        <ArrowRight className="h-4 w-4 text-[#7b1e3a]" />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    <span className="line-clamp-1">{restaurant.address}</span>
                                </div>

                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                                        <Truck className="h-3.5 w-3.5" />
                                        {restaurant.deliveryFee && restaurant.deliveryFee > 0 
                                            ? formatMoney(restaurant.deliveryFee)
                                            : "Free Delivery"}
                                    </div>
                                    {restaurant.cuisine && (
                                        <div className="text-xs font-medium text-gray-500 border border-gray-200 px-2.5 py-1 rounded-md">
                                            {restaurant.cuisine}
                                        </div>
                                    )}
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