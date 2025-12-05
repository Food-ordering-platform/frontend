// --- INPUT TYPES (Sending Data) ---

// Used inside CreateOrderDto
export interface OrderItemDto {
  menuItemId: string;
  quantity: number;
  price: number;
}

// Payload sent to POST /api/orders
export interface CreateOrderDto {
  customerId: string;
  restaurantId: string;
  totalAmount: number;
  deliveryAddress: string;
  items: OrderItemDto[]; // Uses the DTO
  name: string;
  email: string;
}

// --- OUTPUT TYPES (Receiving Data) ---

// Used inside Order (Displaying History)
export interface OrderItem {
  quantity: number;
  price: number;
  menuItemName: string; // UPDATED: Now uses the snapshot name, not an ID
}

// The Order object received from GET /api/orders
export interface Order {
  id: string;
  reference: string;
  totalAmount: number;
  deliveryFee: number; // NEW: Added to match backend changes
  paymentStatus: string;
  status: string;
  deliveryAddress: string;
  items: OrderItem[]; // Uses the Output shape
  createdAt: string;
  // Backend also returns restaurant details, good to have here:
  restaurant?: {
    name: string;
    imageUrl: string | null;
  };
}

// Response from the Create Order API call
export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    reference: string;
    checkoutUrl: string;
  };
}
