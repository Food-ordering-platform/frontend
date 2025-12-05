import { ReactNode } from "react";

export interface MenuCategory {
  id: string;
  name: string;
  restaurantId: string;
  menuItems: MenuItem[];
}

export interface Restaurant {
  cuisine: ReactNode;
  description: ReactNode;
  id: string;
  name: string;
  address: string;
  phone?: string;
  imageUrl?: string;
  deliveryTime: string; // Note: Backend uses prepTime (int), frontend might need conversion logic
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  categories: MenuCategory[]; // <-- changed from menuCategories
  menuitem: MenuItem[]; // Note: Usually singular 'menuItem' or plural 'menuItems', kept as requested 'menuitem'
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface MenuItem {
  category: any; // Ideally typed as MenuCategory or string depending on usage
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  restaurantId: string;
  createdAt: string; // ISO date string from backend
  updatedAt: string;
}