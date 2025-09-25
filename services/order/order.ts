import { CreateOrderDto, CreateOrderResponse, Order } from "@/types/order.type"
import api from "../axios"

// Create an order
export const placeOrder = async (
  orderData: CreateOrderDto
): Promise<CreateOrderResponse> => {
  try {
    const response = await api.post<{ data: CreateOrderResponse }>("/orders", orderData)
    return response.data.data
  } catch (error: any) {
    console.error("Create order error", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to create order")
  }
}

// Get order history for a specific customer
export const getOrders = async (customerId: string): Promise<Order[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Order[] }>(
      `/orders/customer/${customerId}`
    )
    return response.data.data
  } catch (error: any) {
    console.error("Get orders error", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to fetch orders")
  }
}

// ✅ Get a single order by reference
export const getOrderByReference = async (reference: string): Promise<Order> => {
  try {
    const response = await api.get<{ success: boolean; data: Order }>(
      `/orders/single/${reference}`
    )
    return response.data.data
  } catch (error: any) {
    console.error("Get order by reference error", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to fetch order")
  }
}
