"use client";

import { useState, useEffect } from "react";
import { useRestaurantById } from "../../../services/restaurants/restaurants.queries";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, ChefHat, Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import type { MenuItem as ApiMenuItem } from "../../../types/restuarants.type";

// --- REUSABLE COMPONENT: Menu Item ---
const RestaurantMenuItem = ({ item }: { item: any }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const totalPrice = item.price * quantity;

  const handleAddToCart = () => {
    addItem({ ...item, quantity });

    toast.success(`${quantity}x ${item.name} added`, {
      icon: <ShoppingBag className="w-4 h-4 text-green-600" />,
      position: "bottom-center", // Better for mobile
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
    }, 2000);
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, 
    }).format(amount);
  };

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3 sm:gap-4 hover:shadow-md transition-all duration-300 group">
      {/* Image - Responsive Size */}
      <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-h-[6rem]">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-900 line-clamp-1 text-base sm:text-lg leading-tight">
              {item.name}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* ACTIONS ROW */}
        <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2">
          
          {/* Quantity Selector - Compact on Mobile */}
          <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-200 h-8 sm:h-9">
            <button 
              onClick={decrement}
              className="h-full w-8 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:bg-gray-100 disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-gray-900">{quantity}</span>
            <button 
              onClick={increment}
              className="h-full w-8 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:bg-gray-100"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Add Button - Responsive Text */}
          <Button
            size="sm"
            onClick={handleAddToCart}
            className={cn(
              "h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm flex-1 sm:flex-none justify-center",
              isAdded 
                ? "bg-green-600 hover:bg-green-700 text-white border-transparent" 
                : "bg-[#7b1e3a] text-white hover:bg-[#60182f]"
            )}
          >
            {isAdded ? (
              <span className="flex items-center gap-1.5 animate-in fade-in zoom-in">
                <Check className="w-3.5 h-3.5" /> 
                <span className="hidden sm:inline">Added</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                 Add {formatNaira(totalPrice)}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const pathname = usePathname();
  const segments = pathname.split("/");
  const id = segments[2];

  // Fetch restaurant
  const { data: restaurant, isLoading } = useRestaurantById(id!);

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

  if (isLoading)
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#7b1e3a]"></div>
                <p className="text-gray-500 text-xs sm:text-sm">Loading Menu...</p>
            </div>
        </div>
      </main>
    );

  if (!restaurant?.data)
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="bg-gray-100 p-4 rounded-full">
                <ChefHat className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Restaurant not found</h2>
            <p className="text-muted-foreground text-sm">The restaurant you are looking for does not exist.</p>
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </main>
    );

  const r = restaurant.data;

  return (
    <main className="bg-gray-50/50 min-h-screen font-sans">
      <Header />
      
      {/* HERO SECTION */}
      <div className="relative h-[35vh] sm:h-[40vh] min-h-[250px] w-full">
        <Image
          src={r.imageUrl || "/placeholder.svg"}
          alt={r.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container px-4 sm:px-6 pb-6 sm:pb-10 pt-20">
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-white text-black border-0 font-bold px-2 py-0.5 text-xs sm:text-sm">
                        <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 fill-yellow-400 text-yellow-400" /> 4.8
                    </Badge>
                    {!r.isOpen ? (
                        <Badge variant="destructive" className="font-bold text-xs sm:text-sm">Closed</Badge>
                    ) : (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 font-bold text-xs sm:text-sm">Open</Badge>
                    )}
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
                    {r.name}
                </h1>
                
                <p className="text-gray-200 text-sm sm:text-lg line-clamp-2 max-w-xl font-medium drop-shadow-md hidden sm:block">
                    {r.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white font-medium pt-1">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 text-xs sm:text-sm">
                        <ChefHat className="h-3.5 w-3.5 text-[#f59e0b]" />
                        <span>{r.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 text-xs sm:text-sm">
                        <Clock className="h-3.5 w-3.5 text-[#f59e0b]" />
                        <span>25-35 min</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 sm:gap-8 items-start">
            
            {/* MOBILE: Sticky Category Navigation */}
            <aside className="sticky top-[60px] z-30 lg:static lg:z-auto -mx-4 sm:mx-0 px-4 sm:px-0 bg-gray-50/95 backdrop-blur-sm lg:bg-transparent py-2 lg:py-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4 overflow-x-auto lg:overflow-visible scrollbar-hide">
                    <h3 className="font-bold text-gray-900 mb-4 hidden lg:block text-lg px-2">Menu</h3>
                    <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
                        {categories.map((category) => (
                        <Button
                            key={category}
                            variant="ghost"
                            onClick={() => {
                                setActiveCategory(category);
                                // Optional: Smooth scroll to top of list on mobile
                                window.scrollTo({ top: 350, behavior: 'smooth' }); 
                            }}
                            className={cn(
                                "justify-start rounded-full lg:rounded-lg px-4 py-1.5 sm:py-2 text-sm font-medium transition-all whitespace-nowrap border lg:border-none",
                                category === activeCategory 
                                ? "bg-[#7b1e3a] text-white shadow-md hover:bg-[#60182f] border-[#7b1e3a]" 
                                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-[#7b1e3a] border-gray-200"
                            )}
                        >
                            {category}
                        </Button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Menu Grid */}
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{activeCategory}</h2>
                    <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-200/50 px-2 py-1 rounded-md">{filteredItems.length} items</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {filteredItems.map((item) => (
                        <RestaurantMenuItem 
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
                            }} 
                        />
                    ))}
                </div>
                
                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-xl border border-dashed border-gray-300 mx-auto w-full">
                        <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300 mb-2 sm:mb-3" />
                        <p className="text-gray-500 font-medium text-sm sm:text-base">No items found in this category.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}