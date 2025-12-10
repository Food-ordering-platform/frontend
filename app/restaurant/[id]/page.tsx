"use client";

import { useState, useEffect } from "react";
import { useRestaurantById } from "../../../services/restaurants/restaurants.queries";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Star, MapPin, ChefHat } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MenuItemCard } from "@/components/menu/menu-item-card";

// API MenuItem type
import type { MenuItem as ApiMenuItem } from "../../../types/restuarants.type";

export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const pathname = usePathname();
  const segments = pathname.split("/");
  const id = segments[2];

  // Fetch restaurant
  const { data: restaurant, isLoading, error } = useRestaurantById(id!);

  // Helper to flatten items for the view
  const allMenuItems: ApiMenuItem[] =
    restaurant?.data?.categories?.flatMap((cat) =>
      cat.menuItems.map((item) => ({ ...item, category: cat.name }))
    ) || [];

  // Get unique categories
  const categories = Array.from(new Set(allMenuItems.map((item) => item.category)));

  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredItems = activeCategory
    ? allMenuItems.filter((item) => item.category === activeCategory)
    : allMenuItems;

  // Format Naira
  const formatNaira = (amount: number) => {
      return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading)
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b1e3a]"></div>
        </div>
      </main>
    );

  if (!restaurant?.data)
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <h2 className="text-2xl font-bold">Restaurant not found</h2>
            <p className="text-muted-foreground">The restaurant you are looking for does not exist or has moved.</p>
        </div>
      </main>
    );

  const r = restaurant.data;

  return (
    <main className="bg-gray-50/50 min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <Image
          src={r.imageUrl || "/placeholder.svg"}
          alt={r.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container pb-8 md:pb-12 pt-20">
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[#f59e0b] hover:bg-[#d97706] text-black border-0 font-bold px-3">
                        <Star className="h-3 w-3 mr-1 fill-current" /> 4.8 (500+)
                    </Badge>
                    {!r.isOpen && (
                        <Badge variant="destructive" className="font-bold">Closed Now</Badge>
                    )}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {r.name}
                </h1>
                
                <p className="text-gray-200 text-lg line-clamp-2 max-w-2xl drop-shadow-sm">
                    {r.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm md:text-base font-medium pt-2">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <ChefHat className="h-4 w-4 text-[#f59e0b]" />
                        <span>{r.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Clock className="h-4 w-4 text-[#f59e0b]" />
                      
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <DollarSign className="h-4 w-4 text-[#f59e0b]" />
                        {/* <span>{formatNaira(r.deliveryFee)} Delivery</span> */}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
            
            {/* Sidebar / Mobile Nav for Categories */}
            <aside className="lg:sticky lg:top-24 z-30">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 overflow-x-auto lg:overflow-visible">
                    <h3 className="font-bold text-gray-900 mb-4 hidden lg:block text-lg">Menu Sections</h3>
                    <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
                        {categories.map((category) => (
                        <Button
                            key={category}
                            variant={category === activeCategory ? "default" : "ghost"}
                            onClick={() => setActiveCategory(category)}
                            className={`justify-start rounded-lg transition-all ${
                                category === activeCategory 
                                ? "bg-[#7b1e3a] text-white shadow-md hover:bg-[#66172e]" 
                                : "hover:bg-orange-50 hover:text-[#7b1e3a]"
                            }`}
                        >
                            {category}
                        </Button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Menu Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{activeCategory}</h2>
                    <span className="text-sm text-gray-500">{filteredItems.length} items</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                        // We map the API item to the expected CartItem shape inside the component
                        <MenuItemCard 
                            key={item.id} 
                            item={{
                                id: item.id,
                                name: item.name,
                                description: item.description || "",
                                price: item.price,
                                image: item.imageUrl || "/placeholder.svg",
                                isAvailable: item.available,
                                restaurantId: item.restaurantId,
                                category: item.category || "",
                                ingredients: [] // API doesn't seem to return ingredients, defaulting
                            }} 
                        />
                    ))}
                </div>
                
                {filteredItems.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No items found in this category.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}