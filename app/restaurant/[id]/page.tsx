"use client";

import { useState, useEffect } from "react";
import { useRestaurantById } from "../../../services/restaurants/restaurants.queries";
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
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

// API MenuItem type
import type { MenuItem as ApiMenuItem } from "../../../types/restuarants.type";
// Cart MenuItem type
import type { MenuItem as CartMenuItem } from "@/lib/types";

export default function RestaurantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addItem, getRestaurantId } = useCart();

  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [instructionsMap, setInstructionsMap] = useState<Record<string, string>>({});
  const [showDetailsMap, setShowDetailsMap] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const pathname = usePathname();
  const segments = pathname.split("/");
  const id = segments[2];

  // Fetch restaurant (includes menuCategories)
  const { data: restaurant, isLoading, error } = useRestaurantById(id!);

  // Flatten all menu items from categories and attach category name
 // Replace menuCategories with categories
const allMenuItems: ApiMenuItem[] =
  restaurant?.data?.categories?.flatMap((cat) =>
    cat.menuItems.map((item) => ({ ...item, category: cat.name }))
  ) || [];


  // Get all unique categories
  const categories = Array.from(new Set(allMenuItems.map((item) => item.category)));

  // Set default active category
  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Filter items based on active category
  const filteredItems = activeCategory
    ? allMenuItems.filter((item) => item.category === activeCategory)
    : allMenuItems;

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
        description:
          "You can only order from one restaurant at a time. Clear your cart to order from this restaurant.",
        variant: "destructive",
      });
      return;
    }

    const quantity = quantityMap[item.id] || 1;
    const instructions = instructionsMap[item.id] || "";

    const cartItem: CartMenuItem = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: item.price,
      image: item.imageUrl || "/placeholder.svg",
      isAvailable: item.available,
      restaurantId: item.restaurantId,
      category: item.category || "",
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

  if (isLoading)
    return (
      <main>
        <Header />
        <div className="container py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </main>
    );
  if (error)
    return (
      <main>
        <Header />
        <div className="container py-16 text-center text-red-500">Failed to load restaurant</div>
        <Footer />
      </main>
    );
  if (!restaurant?.data)
    return (
      <main>
        <Header />
        <div className="container py-16 text-center">Restaurant not found</div>
        <Footer />
      </main>
    );

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-background container py-0 md:py-8 space-y-8">
        {/* Restaurant Header */}
        <div className="relative h-64 md:h-80 rounded-b-3xl overflow-hidden">
          <Image
            src={restaurant.data.imageUrl || "/placeholder.svg"}
            alt={restaurant.data.name}
            fill
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {!restaurant.data.isOpen && (
            <Badge className="absolute inset-0 m-auto bg-white text-black p-2">Closed</Badge>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{restaurant.data.name}</h1>
            <p className="text-white/85 max-w-3xl mt-2">{restaurant.data.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="bg-white text-black">{restaurant.data.cuisine}</Badge>
              <div className="flex items-center gap-1 text-white/90">
                <Clock className="h-4 w-4" /> {restaurant.data.deliveryTime} min
              </div>
              <div className="flex items-center gap-1 text-white/90">
                <DollarSign className="h-4 w-4" /> ${restaurant.data.deliveryFee} delivery
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="sticky top-20 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            {/* Category Tabs */}
            <div className="container px-0 py-3 overflow-x-auto">
              <div className="flex gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === activeCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="responsive-grid responsive-grid-cols-2 mt-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/50">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-40 md:h-28 md:w-28 flex-shrink-0">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-xs">
                          Unavailable
                        </Badge>
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
                            <Label htmlFor={`instructions-${item.id}`} className="text-sm">
                              Special Instructions (optional)
                            </Label>
                            <Textarea
                              id={`instructions-${item.id}`}
                              placeholder="e.g., No onions, extra sauce..."
                              value={instructionsMap[item.id] || ""}
                              onChange={(e) =>
                                setInstructionsMap({ ...instructionsMap, [item.id]: e.target.value })
                              }
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        )}

                        <Button onClick={() => handleAddToCart(item)} className="w-full bg-gradient-red hover:bg-gradient-red-light">
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
      <Footer />
    </main>
  );
}
