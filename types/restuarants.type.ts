import { ReactNode } from "react";

export interface MenuCategory {
  id: string;
  name: string;
  restaurantId: string;
  menuItems: MenuItem[];
}

export interface Restaurant {
  id: string | null;
  name: string;
  address: string;
  phone?: string;
  imageUrl?: string;
  prepTime: number; 
  minimumOrder: number;
  isOpen: boolean;
  categories: MenuCategory[]; 
  menuItems: MenuItem[];
  cuisine?: ReactNode;
  slug?: string
  description?: ReactNode;
  rating?: number;
  deliveryFee?: number;
  deliveryTime?: number;
  latitude?: number; 
  longitude?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  restaurantId: string;
  category: string; // Ensure this matches backend field
  createdAt: string;
  updatedAt: string;
}