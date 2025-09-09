"use client"

import { useState, useEffect } from "react"
import type { Restaurant } from "@/lib/types"
import { RestaurantCard } from "./restaurant-card"
import { getRestaurants } from "@/lib/data-service"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, MapPin } from "lucide-react"

export function RestaurantGrid() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await getRestaurants()
        setRestaurants(data)
        setFilteredRestaurants(data)
      } catch (error) {
        console.error("Failed to load restaurants:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRestaurants()
  }, [])

  useEffect(() => {
    let filtered = restaurants

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by cuisine
    if (selectedCuisine) {
      filtered = filtered.filter((restaurant) => restaurant.cuisine === selectedCuisine)
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

  return (
    <div className="space-y-8" id="restaurants">
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Delivering to your location</span>
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

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {selectedCuisine ? (
              <>
                <span className="text-gradient-red">{selectedCuisine}</span> Restaurants
              </>
            ) : (
              "Featured Restaurants"
            )}
          </h2>
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""} available
          </span>
        </div>

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
          <div className="responsive-grid responsive-grid-cols-3">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
