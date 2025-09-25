import { useMutation, useQuery } from "@tanstack/react-query"
import { getOrders, placeOrder, getOrderByReference } from "../../services/order/order"
import { CreateOrderDto, CreateOrderResponse, Order } from "@/types/order.type"

// ✅ Create a new order
export const useCreateOrder = () => {
  return useMutation<CreateOrderResponse, Error, CreateOrderDto>({
    mutationFn: (orderData: CreateOrderDto) => placeOrder(orderData),
  })
}

// ✅ Get all orders for a specific customer
export const useGetOrders = (customerId: string) => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", customerId],
    queryFn: () => getOrders(customerId),
    enabled: !!customerId, // only run if customerId exists
  })
}

// ✅ Get a single order by reference
export const useGetOrderByReference = (reference: string) => {
  return useQuery<Order, Error>({
    queryKey: ["order", reference],
    queryFn: () => getOrderByReference(reference),
    enabled: !!reference, // only run if reference exists
  })
}
