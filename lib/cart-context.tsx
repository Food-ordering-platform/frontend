"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/types/restuarants.type"; // Ensure this import matches your file structure
import { toast } from "sonner"; // Or your preferred toast

// Define Cart Item
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

// Define Context Shape
interface CartContextType {
  items: CartItem[];
  restaurantId: string | null // 👈 NEW: Explicitly track this
  addToCart: (item: MenuItem, quantity: number, instructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null); // 👈 State for it

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedRestaurantId = localStorage.getItem("cart_restaurant_id");
    if (savedCart) setItems(JSON.parse(savedCart));
    if (savedRestaurantId) setRestaurantId(savedRestaurantId);
  }, []);

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
    if (restaurantId) {
      localStorage.setItem("cart_restaurant_id", restaurantId);
    } else {
      localStorage.removeItem("cart_restaurant_id");
    }
  }, [items, restaurantId]);

  const addToCart = (menuItem: MenuItem, quantity: number, specialInstructions?: string) => {
    // 1. CHECK RESTAURANT CONFLICT
    if (restaurantId && restaurantId !== menuItem.restaurantId) {
      // Logic: Ask user to clear cart or just reject
      // For simplicity, we'll just reject/alert here, but you can trigger a modal
      if (confirm("Start a new order? You have items from another restaurant.")) {
        clearCart(); // Clear old items
        setRestaurantId(menuItem.restaurantId); // Set new restaurant
        // Continue adding...
      } else {
        return; // Cancel
      }
    }

    // 2. SET RESTAURANT IF EMPTY
    if (items.length === 0) {
      setRestaurantId(menuItem.restaurantId);
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { menuItem, quantity, specialInstructions }];
    });
    
    toast.success("Added to cart");
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.menuItem.id !== itemId);
      // If cart becomes empty, clear restaurantId
      if (newItems.length === 0) setRestaurantId(null); 
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null); // 👈 Clear it here
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.menuItem.id === itemId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(i => i.quantity > 0); // Remove if 0
    });
    
    // Safety check if cart becomes empty after update
    if (items.length === 1 && items[0].quantity + delta <= 0) {
        setRestaurantId(null);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
};