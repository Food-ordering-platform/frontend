"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useGetOrderByReference } from "../../../services/order/order.queries";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, MapPin, Clock, CheckCircle2, ShoppingBag, CreditCard, AlertCircle } from "lucide-react"; // Added AlertCircle
import Link from "next/link";
import Image from "next/image"; // Kept for item images if available
// ✅ FIXED: Named import
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
      "PAID": "confirmed", 
      "PREPARING": "preparing",
      "OUT_FOR_DELIVERY": "out-for-delivery",
      "DELIVERED": "delivered",
      "CANCELLED": "cancelled"
    };
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
            
            {/* ✅ RESTORED: Your original Header Design */}
            <div className="mb-8">
                <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[#7b1e3a] mb-4" asChild>
                    <Link href="/orders" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> <span>Back to Orders</span>
                    </Link>
                </Button>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Details</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    
                    <Badge variant="outline" className="text-sm py-1.5 px-4 border-gray-300 bg-white shadow-sm w-fit">
                        Ref: <span className="font-mono font-bold text-gray-900 ml-2 tracking-wider">{order.reference}</span>
                    </Badge>
                </div>
            </div>

            {/* ✅ FIXED: Logic inserted into your original layout structure */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Status & Details */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* STATUS CARD */}
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-white border-b border-gray-100 pb-4 pt-6 px-6">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#7b1e3a]" /> Order Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="py-2">
                                {/* ✅ FIXED: Using helper to fix type error */}
                                <OrderStatusTracker status={getTrackerStatus(order.status)} />
                            </div>
                            
                            {/* ✅ FEATURE: Payment Pending Logic */}
                            {order.paymentStatus === 'PENDING' && order.status !== 'CANCELLED' && (
                                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="bg-amber-100 p-2.5 rounded-full shrink-0">
                                        <AlertCircle className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-amber-900 text-base">Payment Required</h4>
                                        <p className="text-sm text-amber-700 mt-0.5">
                                            Your order is pending. Please complete payment to start preparation.
                                        </p>
                                    </div>
                                    
                                    {order.checkoutUrl && (
                                        <Button 
                                            className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm shrink-0 w-full sm:w-auto"
                                            onClick={() => window.location.href = order.checkoutUrl!}
                                        >
                                            Pay Now {formatMoney(order.totalAmount)}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ITEMS LIST */}
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white">
                         <CardHeader className="bg-white border-b border-gray-100 pb-4 pt-6 px-6">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-[#7b1e3a]" /> Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, index) => (
                                    // ✅ FIXED: Unique key using index + name
                                    <div key={`${index}-${item.menuItemName}`} className="flex justify-between items-start p-6 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex gap-4">
                                            {/* Restored the "nice design" placeholder box */}
                                            <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                                <ShoppingBag className="h-6 w-6 opacity-30" />
                                            </div>
                                            
                                            <div>
                                                <p className="font-bold text-gray-900 text-base mb-1">{item.menuItemName}</p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold mr-2">Qty: {item.quantity}</span>
                                                    <span>x {formatMoney(item.price)}</span>
                                                </div>
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
                         <CardHeader className="bg-white border-b border-gray-100 pb-4 pt-6 px-6">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-[#7b1e3a]" /> Delivery Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#7b1e3a]/10 p-2.5 rounded-full shrink-0">
                                    <MapPin className="h-5 w-5 text-[#7b1e3a]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivery Address</p>
                                    <p className="text-gray-900 font-medium text-base">{order.deliveryAddress}</p>
                                </div>
                            </div>
                            
                            {order.deliveryNotes && (
                                <>
                                    <Separator className="bg-gray-100" />
                                    <div className="flex items-start gap-4">
                                        <div className="bg-amber-100 p-2.5 rounded-full shrink-0">
                                            <div className="h-5 w-5 text-amber-600 flex items-center justify-center font-bold text-xs">!</div> 
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Note to Rider</p>
                                            <p className="text-gray-900 italic">"{order.deliveryNotes}"</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-1">
                    <Card className="border-0 shadow-xl shadow-gray-200/50 ring-1 ring-gray-200 rounded-3xl overflow-hidden bg-white sticky top-24">
                        <CardHeader className="bg-[#7b1e3a] text-white p-6">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-white/80" /> Payment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-900">{formatMoney(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-semibold text-gray-900">{formatMoney(order.deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-gray-600">Platform Fee</span>
                                    <span className="font-semibold text-gray-900">{formatMoney(PLATFORM_FEE)}</span>
                                </div>
                            </div>
                            
                            <Separator className="bg-gray-100" />
                            
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-700 text-lg">Total</span>
                                <span className="font-extrabold text-3xl text-[#7b1e3a] tracking-tight">{formatMoney(order.totalAmount)}</span>
                            </div>
                            
                            <div className="pt-4">
                                {order.paymentStatus === 'PAID' ? (
                                    <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-4 rounded-xl font-bold border border-green-100 shadow-sm">
                                        <CheckCircle2 className="h-5 w-5" /> Payment Successful
                                    </div>
                                ) : order.status === 'CANCELLED' ? (
                                     <div className="flex items-center justify-center gap-2 bg-red-50 text-red-700 py-4 rounded-xl font-bold border border-red-100 shadow-sm">
                                        Order Cancelled
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 py-4 rounded-xl font-bold border border-amber-100 shadow-sm">
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