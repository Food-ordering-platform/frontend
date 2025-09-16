import { ReactNode } from "react";

export interface Restaurant {
  rating: ReactNode;
  description: any;
  cuisine: any;
  id: string;
  name: string;
  address: string;
  phone?: string;
  imageUrl?: string;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
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
