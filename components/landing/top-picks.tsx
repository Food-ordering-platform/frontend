"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Clock, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRestaurants } from "@/services/restaurants/restaurants.queries";
import { getMenuItems } from "@/services/restaurants/restaurants";
import { useQueries } from "@tanstack/react-query";
import { Restaurant, MenuItem, ApiResponse } from "@/types/restuarants.type";

export function TopPicksSection() {
  // 1. Fetch Restaurants first
  const { data: response, isLoading: isLoadingRestaurants } = useRestaurants();
  const restaurants = response?.data || [];

  // 2. Get IDs of the first 6 restaurants
  const topRestaurants = restaurants.slice(0, 6).filter((r): r is Restaurant & { id: string } => !!r.id);

  // 3. Fetch menus for these restaurants in parallel
  const menuQueries = useQueries({
    queries: topRestaurants.map((restaurant) => ({
      queryKey: ["menuItems", restaurant.id],
      queryFn: () => getMenuItems(restaurant.id),
      enabled: !!restaurant.id,
    })),
  });

  const isLoadingMenus = menuQueries.some((q) => q.isLoading);
  const isLoading = isLoadingRestaurants || isLoadingMenus;

  // 4. Flatten the results into a single list of "Dishes"
  const featuredDishes = menuQueries.flatMap((query, index) => {
    const restaurant = topRestaurants[index];
    const response = query.data as ApiResponse<MenuItem[]> | undefined;
    const items = response?.data || [];

    // Take up to 3 items from each restaurant
    return items.slice(0, 3).map((item) => ({
      id: item.id,
      name: item.name,
      image: item.imageUrl || restaurant.imageUrl, 
      price: item.price,
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
      rating: restaurant.rating || 4.8,
      time: restaurant.deliveryTime || "25-35",
    }));
  }).sort(() => 0.5 - Math.random());

  const hasDishes = featuredDishes.length > 0;

  return (
    <section className="py-16 bg-[#faf9f8]">
      {/* ✅ Fixed: Added container back so content isn't full width */}
      <div className="container px-6 mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Top dishes <span className="text-[#7b1e3a]">near you.</span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 font-medium">
              The most popular meals everyone in Warri is ordering right now.
            </p>
          </div>

          <Button 
            variant="ghost" 
            className="text-[#7b1e3a] hover:text-[#60132a] hover:bg-[#7b1e3a]/5 font-bold text-sm md:text-base hidden md:inline-flex items-center gap-2 transition-colors" 
            asChild
          >
            <Link href="/restaurants">
              See full menu 
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Carousel Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[1, 2, 3].map((i) => (
                 <div key={i} className="space-y-3">
                     <Skeleton className="h-64 w-full rounded-xl" />
                     <Skeleton className="h-4 w-2/3" />
                     <Skeleton className="h-4 w-1/3" />
                 </div>
             ))}
          </div>
        ) : !hasDishes ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            <p>Check back later for top dishes!</p>
            <Button variant="link" asChild className="text-[#7b1e3a] mt-2">
               <Link href="/restaurants">Browse Restaurants</Link>
            </Button>
          </div>
        ) : (
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredDishes.map((dish, index) => (
                <CarouselItem key={`${dish.id}-${index}`} className="pl-4 basis-3/4 md:basis-1/2 lg:basis-1/3">
                  <Link href={`/restaurant/${dish.restaurantId}`}>
                    <div className="group cursor-pointer bg-white p-3 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="relative aspect-video md:aspect-[4/3] overflow-hidden rounded-xl mb-3 bg-gray-100">
                        {dish.image ? (
                           <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                             <ShoppingBag size={32} opacity={0.5} />
                           </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                          <Clock size={12} />
                          {dish.time} min
                        </div>
                      </div>
                      
                      <div className="px-1 flex flex-col flex-grow justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1 pr-2">
                                    {dish.name}
                                </h3>
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 shrink-0">
                                    <span className="text-xs font-bold text-gray-900">{dish.rating}</span>
                                    <Star size={10} className="fill-[#7b1e3a] text-[#7b1e3a]" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 truncate mb-3">
                                by {dish.restaurantName}
                            </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                            <span className="font-bold text-lg text-[#7b1e3a]">₦{dish.price.toLocaleString()}</span>
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#7b1e3a] group-hover:text-white transition-colors">
                                <span className="text-xl leading-none mb-1">+</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 h-12 w-12 border-gray-200" />
              <CarouselNext className="-right-4 h-12 w-12 border-gray-200" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}