import { mockRestaurants, mockMenuItems, mockUsers, mockOrders } from "./mock-data"
import type { Restaurant, MenuItem, User, Order, AuthUser } from "./types"

// Restaurant operations
export const getRestaurants = async (): Promise<Restaurant[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockRestaurants
}

export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockRestaurants.find((restaurant) => restaurant.id === id) || null
}

// Menu operations
export const getMenuItemsByRestaurantId = async (restaurantId: string): Promise<MenuItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockMenuItems.filter((item) => item.restaurantId === restaurantId)
}

export const getMenuItemById = async (id: string): Promise<MenuItem | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockMenuItems.find((item) => item.id === id) || null
}

// User operations
export const getUserById = async (id: string): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockUsers.find((user) => user.id === id) || null
}

// Order operations
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockOrders.filter((order) => order.userId === userId)
}

export const createOrder = async (orderData: Omit<Order, "id" | "orderDate">): Promise<Order> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newOrder: Order = {
    ...orderData,
    id: Math.random().toString(36).substr(2, 9),
    orderDate: new Date(),
  }
  mockOrders.push(newOrder)
  return newOrder
}

// Auth operations (mock)
export const authenticateUser = async (email: string, password: string): Promise<AuthUser | null> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password") {
    // Simple mock auth
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
  return null
}

export const registerUser = async (userData: Omit<User, "id" | "createdAt">): Promise<AuthUser> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const newUser: User = {
    ...userData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
  }
  mockUsers.push(newUser)
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  }
}
