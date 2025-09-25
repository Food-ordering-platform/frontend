"use client"

import { useGetOrders } from "../../services/order/order.queries" // your hook
import { useAuth } from "@/lib/auth-context" // assuming you have auth context
import Link from "next/link"

export default function OrdersPage() {
  const { user } = useAuth() // get logged-in user
  const customerId = user?.id

  const { data: orders, isLoading, isError } = useGetOrders(customerId!)

  if (isLoading) {
    return <div className="p-4">Loading your orders...</div>
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load orders. Please try again.</div>
  }

  if (!orders || orders.length === 0) {
    return <div className="p-4">You haven’t placed any orders yet.</div>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/order/${order.id}`}
            className="block p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Ref: {order.reference}</p>
                <p className="text-sm text-gray-600">₦{order.totalAmount}</p>
                <p className="text-sm">Status: {order.status}</p>
                <p className="text-xs text-gray-500">Payment: {order.paymentStatus}</p>
              </div>
              <span className="text-blue-600 text-sm">View Details →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
