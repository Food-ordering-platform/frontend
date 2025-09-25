import { CreateOrderDto, CreateOrderResponse, Order } from "@/types/order.type"
import api from "../axios"


//Create an order
export const placeOrder = async (
  orderData: CreateOrderDto
): Promise<CreateOrderResponse> => {
  try {
    const response = await api.post<{ data: CreateOrderResponse }>("/orders", orderData)
    // Make sure we return exactly the inner 'data'
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
    return response.data.data // only return the actual orders
  } catch (error: any) {
    console.error("Get orders error", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to fetch orders")
  }
}