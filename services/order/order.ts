import { CreateOrderDto, CreateOrderResponse } from "@/types/order.type"
import api from "../axios"

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
