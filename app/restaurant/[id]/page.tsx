"use client";

import { useState } from "react";
import { useRestaurantById, useMenuItemsByRestaurantId } from "../../../services/restaurants/restaurants.queries";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Clock, DollarSign } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// API MenuItem type
import type { MenuItem as ApiMenuItem } from "../../../types/restuarants.type";
// Cart MenuItem type
import type { MenuItem as CartMenuItem } from "@/lib/types";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function RestaurantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addItem, getRestaurantId } = useCart();

  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [instructionsMap, setInstructionsMap] = useState<Record<string, string>>({});
  const [showDetailsMap, setShowDetailsMap] = useState<Record<string, boolean>>({});

  const pathname = usePathname(); // e.g., "/restaurant/123"
  const segments = pathname.split("/");
  const id = segments[2];

  const { data: restaurant, isLoading: isRestaurantLoading, error: restaurantError } = useRestaurantById(id!);
  const { data: menuItemsResponse, isLoading: isMenuLoading, error: menuError } = useMenuItemsByRestaurantId(id!);

  if (isRestaurantLoading || isMenuLoading) return <p>Loading...</p>;
  if (restaurantError || menuError) return <p>Failed to load restaurant or menu</p>;
  if (!restaurant?.data) return <p>Restaurant not found</p>;

  const menuItems: ApiMenuItem[] = menuItemsResponse?.data || [];

  const handleAddToCart = (item: ApiMenuItem) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    const currentRestaurantId = getRestaurantId();
    if (currentRestaurantId && currentRestaurantId !== item.restaurantId) {
      toast({
        title: "Different restaurant",
        description: "You can only order from one restaurant at a time. Clear your cart to order from this restaurant.",
        variant: "destructive",
      });
      return;
    }

    const quantity = quantityMap[item.id] || 1;
    const instructions = instructionsMap[item.id] || "";

    // Map API MenuItem to CartMenuItem
    const cartItem: CartMenuItem = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: item.price,
      image: item.imageUrl || "/placeholder.svg",
      isAvailable: item.available,
      restaurantId: item.restaurantId,
      category: ""
    };

    addItem(cartItem, quantity, instructions || undefined);

    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name} added to your cart`,
    });

    setQuantityMap({ ...quantityMap, [item.id]: 1 });
    setInstructionsMap({ ...instructionsMap, [item.id]: "" });
    setShowDetailsMap({ ...showDetailsMap, [item.id]: false });
  };

  const categories = Array.from(new Set(menuItems.map((i) => i.category)));

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-background container py-8 space-y-8">
        {/* Restaurant Header */}
        <div className="relative h-64 md:h-80">
          <Image
            src={restaurant.data.imageUrl || "/placeholder.svg"}
            alt={restaurant.data.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          {!restaurant.data.isOpen && (
            <Badge className="absolute inset-0 m-auto bg-white text-black p-2">Closed</Badge>
          )}
        </div>
  
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{restaurant.data.name}</h1>
          <p className="text-muted-foreground">{restaurant.data.description}</p>
          <div className="flex items-center gap-4">
            <Badge>{restaurant.data.cuisine}</Badge>
            <div className="flex items-center gap-1">
              <Clock /> {restaurant.data.deliveryTime} min
            </div>
            <div className="flex items-center gap-1">
              <DollarSign /> ${restaurant.data.deliveryFee} delivery
            </div>
          </div>
        </div>
  
        {/* Menu Sections */}
        {categories.map((category) => {
          const items = menuItems.filter((i) => i.category === category);
          return (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold">{category}</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative h-32 md:h-24 md:w-24 flex-shrink-0">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {!item.available && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="secondary" className="text-xs">Unavailable</Badge>
                            </div>
                          )}
                        </div>
  
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{item.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
  
                          {item.available && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setQuantityMap({
                                        ...quantityMap,
                                        [item.id]: Math.max(1, (quantityMap[item.id] || 1) - 1),
                                      })
                                    }
                                    disabled={(quantityMap[item.id] || 1) <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="font-medium w-8 text-center">{quantityMap[item.id] || 1}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setQuantityMap({
                                        ...quantityMap,
                                        [item.id]: (quantityMap[item.id] || 1) + 1,
                                      })
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
  
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() =>
                                    setShowDetailsMap({
                                      ...showDetailsMap,
                                      [item.id]: !(showDetailsMap[item.id] || false),
                                    })
                                  }
                                  className="text-xs"
                                >
                                  {showDetailsMap[item.id] ? "Hide" : "Add"} special instructions
                                </Button>
                              </div>
  
                              {showDetailsMap[item.id] && (
                                <div className="space-y-2">
                                  <Label htmlFor={`instructions-${item.id}`} className="text-sm">Special Instructions (optional)</Label>
                                  <Textarea
                                    id={`instructions-${item.id}`}
                                    placeholder="e.g., No onions, extra sauce..."
                                    value={instructionsMap[item.id] || ""}
                                    onChange={(e) => setInstructionsMap({ ...instructionsMap, [item.id]: e.target.value })}
                                    className="text-sm"
                                    rows={2}
                                  />
                                </div>
                              )}
  
                              <Button onClick={() => handleAddToCart(item)} className="w-full">
                                Add to Cart • ${(item.price * (quantityMap[item.id] || 1)).toFixed(2)}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
</main>
  )}