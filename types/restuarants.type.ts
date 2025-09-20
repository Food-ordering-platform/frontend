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
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  categories: MenuCategory[]; // <-- changed from menuCategories
  menuitem: MenuItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface MenuItem {
  category: any;
  id: string
  name: string
  description?: string
  price: number
  available: boolean
  imageUrl?: string
  restaurantId: string
  createdAt: string   // ISO date string from backend
  updatedAt: string
}
