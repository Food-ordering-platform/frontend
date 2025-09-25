import { useMutation, useQuery } from "@tanstack/react-query"
import { getOrders, placeOrder } from "../../services/order/order" // updated function
import { CreateOrderDto, CreateOrderResponse, Order } from "@/types/order.type"

export const useCreateOrder = () => {
  return useMutation<CreateOrderResponse, Error, CreateOrderDto>({
    mutationFn: (orderData: CreateOrderDto) => placeOrder(orderData)
  })
}

export const useGetOrders = (customerId: string) => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", customerId], // cache key
    queryFn: () => getOrders(customerId),
    enabled: !!customerId // only run if customerId exists
  })
}