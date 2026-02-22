"use client"

import { useState, useEffect } from "react"
import { useRestaurants } from "@/services/restaurants/restaurants.queries"
import { MapPin, Clock, Star, Truck, Utensils, Info, Heart, TrendingUp, ChefHat } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Restaurant } from "@/types/restuarants.type"

export function Restaurants() {
  const { data: restaurantResponse, isLoading, error } = useRestaurants()
  const restaurants = restaurantResponse?.data || []

  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState<string>("")

  useEffect(() => {
    if (selectedCuisine) {
      setFilteredRestaurants(restaurants.filter((r) => r.cuisine === selectedCuisine))
    } else {
      setFilteredRestaurants(restaurants)
    }
  }, [restaurants, selectedCuisine])

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine as string).filter(Boolean)))

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // const getRating = (rating?: number) => rating ?? 4.5

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-lg">
            <Info className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-3">Something went wrong</h3>
        <p className="text-gray-600 mb-8 max-w-md text-lg">We couldn't load the restaurants. Please refresh and try again.</p>
        <button
          className="px-8 py-3.5 bg-gradient-to-r from-[#7b1e3a] to-[#a62b50] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#7b1e3a]/30 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Modern Filter Tabs */}
      {cuisines.length > 0 && (
        <div className="sticky top-20 z-40 -mx-4 px-4 md:mx-0 md:px-0 pb-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg p-2">
            <div className="flex overflow-x-auto no-scrollbar gap-2">
              <button
                onClick={() => setSelectedCuisine("")}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  selectedCuisine === ""
                    ? "bg-gradient-to-r from-[#7b1e3a] to-[#a62b50] text-white shadow-lg shadow-[#7b1e3a]/30"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  All Restaurants
                </span>
              </button>
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCuisine === cuisine
                      ? "bg-gradient-to-r from-[#7b1e3a] to-[#a62b50] text-white shadow-lg shadow-[#7b1e3a]/30"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredRestaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg">
              <ChefHat className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3">No restaurants found</h3>
          <p className="text-gray-600 mb-8 text-lg">Try adjusting your filters or browse all options</p>
          <button
            onClick={() => setSelectedCuisine("")}
            className="px-8 py-3.5 bg-gradient-to-r from-[#7b1e3a] to-[#a62b50] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#7b1e3a]/30 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant, index) => (
            <Link
              key={restaurant.id}
              href={`/restaurant/${restaurant.id}`}
              className="group"
              style={{
                animation: `slideUp 0.5s ease-out ${index * 0.05}s both`,
              }}
            >
              <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#7b1e3a]/20 transition-all duration-500 hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={restaurant.imageUrl || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top Badges Row */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    {/* Status Badge */}
                    {restaurant.isOpen ? (
                      <div className="px-3 py-1.5 bg-green-500/95 backdrop-blur-sm text-white text-xs font-black uppercase tracking-wide rounded-full shadow-lg flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Open
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-lg">
                        Closed
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button 
                      className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                      onClick={(e) => {
                        e.preventDefault()
                        // Add to favorites logic
                      }}
                    >
                      <Heart className="h-4.5 w-4.5 text-gray-700 hover:text-[#7b1e3a] hover:fill-[#7b1e3a] transition-colors" />
                    </button>
                  </div>

                  {/* Rating Badge - Bottom Right */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {/* <span className="text-sm font-black text-gray-900">{getRating(restaurant.rating)}</span> */}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-4">
                  {/* Restaurant Name & Cuisine */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-[#7b1e3a] transition-colors line-clamp-1">
                      {restaurant.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm">
                      {restaurant.cuisine && (
                        <span className="px-3 py-1 bg-[#7b1e3a]/10 text-[#7b1e3a] rounded-full font-bold text-xs">
                          {restaurant.cuisine}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-bold text-xs">Prep Time {restaurant.prepTime} min </span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1 font-medium">{restaurant.address}</span>
                  </div>

                  {/* Delivery Info & CTA */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* <div className="w-10 h-10 bg-gradient-to-br from-[#7b1e3a]/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                        <Truck className="h-5 w-5 text-[#7b1e3a]" />
                      </div> */}
                      {/* <div>
                        {restaurant.deliveryFee && restaurant.deliveryFee > 0 ? (
                          <div className="text-sm font-black text-gray-900">{formatMoney(restaurant.deliveryFee)}</div>
                        ) : (
                          <div className="text-sm font-black text-green-600">Free</div>
                        )}
                        <div className="text-xs text-gray-500 font-medium">Delivery</div>
                      </div> */}
                    </div>
                    
                    {/* <button className="px-5 py-2.5 bg-gradient-to-r from-[#7b1e3a] to-[#a62b50] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#7b1e3a]/30 transition-all duration-300 group-hover:scale-105 active:scale-95">
                      Order
                    </button> */}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}