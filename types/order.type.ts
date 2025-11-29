export interface OrderItem {
  menuItemId: string
  quantity: number
  price: number
}

export interface CreateOrderDto {
  customerId: string
  restaurantId: string
  totalAmount: number
  deliveryAddress: string
  items: OrderItem[]
  name: string
  email: string
}

export interface Order {
  id: string
  reference: string
  //Temporal code
  token?: string
  totalAmount: number
  paymentStatus: string
  status: string
  deliveryAddress: string
  items: OrderItem[]
  createdAt: string
  //Temporal code
  restaurant?: { name: string; address?: string; phone?: string }
}
// What the backend actually returns when creating an order
export interface CreateOrderResponse {
  data: { checkoutUrl: any }
  orderId: string
  reference: string
  checkoutUrl: string
}
