import { useMutation } from "@tanstack/react-query"
import { placeOrder } from "../../services/order/order" // updated function
import { CreateOrderDto, CreateOrderResponse } from "@/types/order.type"

export const useCreateOrder = () => {
  return useMutation<CreateOrderResponse, Error, CreateOrderDto>({
    mutationFn: (orderData: CreateOrderDto) => placeOrder(orderData)
  })
}
