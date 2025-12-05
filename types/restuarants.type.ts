import { ReactNode } from "react";

export interface MenuCategory {
  id: string;
  name: string;
  restaurantId: string;
  menuItems: MenuItem[];
}

export interface Restaurant {
  id: string;
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
  description?: ReactNode;
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
  categoryId: string; // Ensure this matches backend field
  createdAt: string;
  updatedAt: string;
}