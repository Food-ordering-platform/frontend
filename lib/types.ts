export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  createdAt: Date
}

export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  cuisine: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minimumOrder: number
  isOpen: boolean
  address: string
  createdAt: Date
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  ingredients?: string[]
  allergens?: string[]
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  specialInstructions?: string
}

export interface Order {
  id: string
  userId: string
  restaurantId: string
  items: {
    menuItemId: string
    quantity: number
    price: number
    specialInstructions?: string
  }[]
  status: "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"
  totalAmount: number
  deliveryAddress: string
  orderDate: Date
  estimatedDeliveryTime?: Date
  actualDeliveryTime?: Date
}

export interface AuthUser {
  id: string
  email: string
  name: string
}
