// --- INPUT TYPES (Sending Data) ---

// Used inside CreateOrderDto
export interface OrderItemDto {
  menuItemId: string;
  quantity: number;
}

// Payload sent to POST /api/payment/initialize
// FIXED: Renamed totalAmount -> amount to match PaymentController
export interface CreateOrderDto {
  customerId: string;
  restaurantId: string;
  deliveryAddress: string;
  deliveryNotes: string | null
  deliveryLatitude?: number | undefined
  deliveryLongitude?: number | undefined
  items: OrderItemDto[]; 
  name: string;
  email: string;
  idempotencyKey?:string
}

//Payment calculation data sent to the backend
export interface OrderQuote {
    subtotal: number;
    deliveryFee: number;
    platformFee: number;
    totalAmount: number;
    distanceKm: number;
}

// --- OUTPUT TYPES (Receiving Data) ---

// Used inside Order (Displaying History)
export interface OrderItem {
  quantity: number;
  price: number;
  menuItemName: string; // Correct: Matches snapshot logic
}

// The Order object received from GET /api/orders
export interface Order {
  id: string;
  reference: string;
  totalAmount: number;
  deliveryFee: number; // Correct: Matches Order table
  paymentStatus: string;
  status: string;
  deliveryAddress: string;
  deliveryNotes:string | null
  deliveryLatitude?: number | undefined
  deliveryLongitude?: number | undefined
  items: OrderItem[]; 
  checkoutUrl:string,
  createdAt: string;
  restaurant?: {
    name: string;
    imageUrl: string | null;
  };
}

// Response from POST /api/payment/initialize
// FIXED: PaymentController returns this directly, not wrapped in { data: ... }
export interface CreateOrderResponse {
  checkoutUrl: string;
  reference: string;
  orderId: string;
}