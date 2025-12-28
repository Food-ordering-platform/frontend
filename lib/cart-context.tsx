"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/types/restuarants.type"; 
import { toast } from "sonner"; 

// Define Cart Item Interface locally if not imported
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null; 
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // 1. Load from LocalStorage on mount (SAFE VERSION)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart-items");
      const savedRestaurantId = localStorage.getItem("cart-restaurant-id");
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setItems(parsedCart);
          } else {
            console.error("Cart data is not an array, resetting.");
            localStorage.removeItem("cart-items");
          }
        } catch (error) {
          console.error("Failed to parse cart from storage, resetting:", error);
          localStorage.removeItem("cart-items");
          setItems([]);
        }
      }
      
      if (savedRestaurantId) {
        setRestaurantId(savedRestaurantId);
      }
    }
  }, []);

  // 2. Save to LocalStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart-items", JSON.stringify(items));
      
      if (restaurantId) {
        localStorage.setItem("cart-restaurant-id", restaurantId);
      } else {
        localStorage.removeItem("cart-restaurant-id");
      }
    }
  }, [items, restaurantId]);

  // 3. Add Item (With Conflict Check)
  const addItem = (menuItem: MenuItem, quantity = 1, specialInstructions?: string) => {
    // A. Check for Restaurant Conflict
    if (restaurantId && restaurantId !== menuItem.restaurantId) {
      const confirmSwitch = window.confirm(
        "You have items from another restaurant. Start a new order?"
      );

      if (confirmSwitch) {
        setItems([]); // Clear old items
        setRestaurantId(menuItem.restaurantId); // Set new restaurant
        // Fall through to add the new item...
      } else {
        return; // User cancelled
      }
    }

    // B. Set Restaurant ID if cart was empty
    if (items.length === 0) {
      setRestaurantId(menuItem.restaurantId);
    }

    // C. Add or Update Item
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.menuItem.id === menuItem.id && item.specialInstructions === specialInstructions
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...currentItems, { menuItem, quantity, specialInstructions }];
      }
    });
    
    toast.success("Added to cart");
  };

  const removeItem = (menuItemId: string) => {
    setItems((currentItems) => {
      const newItems = currentItems.filter((item) => item.menuItem.id !== menuItemId);
      
      // If cart becomes empty, reset restaurantId
      if (newItems.length === 0) setRestaurantId(null);
      
      return newItems;
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.menuItem.id === menuItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null); 
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}