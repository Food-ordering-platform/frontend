"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useGetOrderByReference } from "../../../services/order/order.queries";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, MapPin, Clock, CheckCircle2, ShoppingBag, CreditCard } from "lucide-react";
import Link from "next/link";
// ✅ FIXED: Named import as required
import { OrderStatusTracker } from "@/components/orders/order-status-tracker";

// Fixed Platform Fee for Display
const PLATFORM_FEE = 350; 

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const router = useRouter();

  const { data: order, isLoading, error } = useGetOrderByReference(reference || "");

  // ✅ HELPER: Convert Backend Status (UPPERCASE) to UI Component Status (lowercase)
  const getTrackerStatus = (backendStatus: string) => {
    const statusMap: Record<string, string> = {
      "PENDING": "pending",
      "PAID": "confirmed", // Optional: treat paid as confirmed if you want
      "PREPARING": "preparing",
      "OUT_FOR_DELIVERY": "out-for-delivery",
      "DELIVERED": "delivered",
      "CANCELLED": "cancelled"
    };
    // Default to 'pending' if unknown, and cast to 'any' to silence strict TS check
    return (statusMap[backendStatus] || "pending") as any;
  };

  if (!reference) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center">
            <p className="text-gray-500">No order reference provided.</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#faf9f8]">
            <Header />
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-6">We couldn't locate the order with reference: {reference}</p>
                <Button asChild><Link href="/orders">Back to My Orders</Link></Button>
            </div>
        </div>
      </ProtectedRoute>
    );
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
  };

  // 🧮 Calculate Subtotal from items
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#faf9f8] font-sans">
        <Header />
        
        <main className="container py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6">
            
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[#7b1e3a]" asChild>
                    <Link href="/orders" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> <span>Back to Orders</span>
                    </Link>
                </Button>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Order Ref:</span>
                    <Badge variant="outline" className="text-gray-900 font-mono tracking-wider">{order.reference}</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Status & Details */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* STATUS CARD */}
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#7b1e3a]" /> Order Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* ✅ FIXED: Using helper function to map string -> enum */}
                            <OrderStatusTracker status={getTrackerStatus(order.status)} />
                            
                            {/* PAYMENT PENDING WARNING */}
                            {order.paymentStatus === 'PENDING' && (
                                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                    <div className="bg-amber-100 p-2 rounded-full">
                                        <CreditCard className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-amber-800">Payment Pending</h4>
                                        <p className="text-sm text-amber-700 mt-1">
                                            We haven't received payment for this order yet. The kitchen won't start preparing your food until payment is confirmed.
                                        </p>
                                        
                                        {order.checkoutUrl && (
                                            <Button 
                                                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto"
                                                onClick={() => window.location.href = order.checkoutUrl!}
                                            >
                                                Complete Payment Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ITEMS LIST */}
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white">
                         <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-[#7b1e3a]" /> Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, index) => (
                                    // ✅ FIXED: Using index + name as unique key since 'id' is missing
                                    <div key={`${index}-${item.menuItemName}`} className="flex justify-between items-center p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-100 h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                                                {item.quantity}x
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{item.menuItemName}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900">{formatMoney(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* DELIVERY INFO */}
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white">
                         <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-[#7b1e3a]" /> Delivery Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Delivery Address</p>
                                    <p className="text-gray-600">{order.deliveryAddress}</p>
                                </div>
                            </div>
                            {order.deliveryNotes && (
                                <div className="flex items-start gap-3 pt-2">
                                    <div className="h-5 w-5" /> 
                                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 w-full">
                                        <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Note to Rider</p>
                                        <p className="text-sm text-yellow-700">"{order.deliveryNotes}"</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-1">
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white sticky top-24">
                        <CardHeader className="bg-[#7b1e3a] text-white p-6">
                            <CardTitle className="text-lg font-bold">Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">{formatMoney(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className="font-semibold text-gray-900">{formatMoney(order.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Platform Fee</span>
                                <span className="font-semibold text-gray-900">{formatMoney(PLATFORM_FEE)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-extrabold text-2xl text-[#7b1e3a]">{formatMoney(order.totalAmount)}</span>
                            </div>
                            
                            <div className="pt-4">
                                {order.paymentStatus === 'PAID' ? (
                                    <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-xl font-bold border border-green-100">
                                        <CheckCircle2 className="h-5 w-5" /> Payment Successful
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 py-3 rounded-xl font-bold border border-amber-100">
                                        <CreditCard className="h-5 w-5" /> Payment Pending
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}