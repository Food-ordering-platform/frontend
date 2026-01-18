import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getOrders, placeOrder, getOrderByReference, getQuote, rateOrder } from "../../services/order/order"
import { CreateOrderDto, CreateOrderResponse, Order } from "@/types/order.type"
import { toast } from "sonner"

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
export const useGetOrderByReference = (reference: string, options?: { enabled?: boolean }) => {
  return useQuery<Order, Error>({
    queryKey: ["order", reference],
    queryFn: () => getOrderByReference(reference),
    // Use passed enabled option, fallback to !!reference if not provided
    enabled: options?.enabled ?? !!reference, 
  })
}

export const useGetOrderQuote = () => {
  return useMutation({
    mutationFn: (data: { 
      restaurantId: string; 
      deliveryLatitude: number; 
      deliveryLongitude: number; 
      items: { price: number; quantity: number }[] 
    }) => getQuote(data),
  });
};

export const useRateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, rating, comment }: { orderId: string; rating: number; comment: string }) =>
      rateOrder(orderId, rating, comment),
      
    onSuccess: () => {
      toast.success("Review submitted successfully!", {
        description: "Thank you for your feedback."
      });
      // Invalidate orders so the UI updates (e.g. hides the "Rate" button if you add logic for that)
      queryClient.invalidateQueries({ queryKey: ["orders"] }); 
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    },
  });
};
