// food-ordering-platform/frontend/frontend-wip-staging/app/orders/details/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useGetOrderByReference } from "../../../services/order/order.queries";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RatingDialog } from "@/components/orders/rating-dialog"; // 🟢 Added Import
import {
  ArrowLeft,
  MapPin,
  Clock,
  Truck,
  ChefHat,
  Package,
  CheckCircle2,
  Copy,
  AlertCircle,
  CreditCard,
  ShoppingBag,
  LockKeyhole,
  Phone,
  Star, // 🟢 Added Star Icon
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { motion } from "framer-motion";

// Fixed Platform Fee for Display
const PLATFORM_FEE = 350;

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || "";
  const { toast } = useToast();

  const { data: order, isLoading, isError } = useGetOrderByReference(reference);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reference);
    toast({ description: "Order Reference Copied!" });
  };

  // ✅ Visual Configuration
  const steps = [
    { id: "pending", label: "Placed", icon: Clock },
    { id: "preparing", label: "Preparing", icon: ChefHat }, // Shortened label for mobile
    { id: "ready_for_pickup", label: "Ready", icon: Package },
    { id: "rider_accepted", label: "Rider Assigned", icon: Truck },
    { id: "out_for_delivery", label: "En Route", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const getCurrentStep = (status: string) => {
    const map: Record<string, number> = {
      PENDING: 0,
      PAID: 0,
      PREPARING: 1,
      READY_FOR_PICKUP: 2,
      RIDER_ACCEPTED: 2,
      OUT_FOR_DELIVERY: 3,
      DELIVERED: 4,
      CANCELLED: -1,
    };
    return map[status?.toUpperCase()] ?? 0;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b1e3a]"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="h-20 w-20 bg-[#7b1e3a]/10 rounded-full flex items-center justify-center mb-6">
          <Package className="h-10 w-10 text-[#7b1e3a]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-sm">
          We couldn't locate this order. It might be an invalid reference.
        </p>
        <Button
          asChild
          className="bg-[#7b1e3a] hover:bg-[#60152b] rounded-full px-8"
        >
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const currentStep = getCurrentStep(order.status);
  const subtotal = order.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const isOrderActive = !["DELIVERED", "CANCELLED", "REFUNDED"].includes(order.status);
  const showDeliveryCode = ["OUT_FOR_DELIVERY", "READY_FOR_PICKUP"].includes(order.status);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-fit pl-0 hover:bg-transparent hover:text-[#7b1e3a] -ml-2"
        >
          <Link href="/orders" className="flex items-center gap-2 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Link>
        </Button>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm w-fit">
          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Ref:
          </span>
          <span className="font-mono font-medium text-gray-900">
            {reference}
          </span>
          <button
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-[#7b1e3a] transition-colors ml-1"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Status Card */}
          <Card className="border-0 shadow-lg shadow-[#7b1e3a]/5 rounded-2xl overflow-hidden bg-white">
            <div className="bg-[#7b1e3a] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Package className="h-40 w-40" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 uppercase tracking-widest text-[10px]">
                        {order.status.replace(/_/g, " ")}
                    </Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
                    {order.status === "DELIVERED"
                        ? "Order Delivered"
                        : "Order in Progress"}
                    </h1>
                    <p className="text-white/80">
                    {order.status === "DELIVERED"
                        ? "Enjoy your meal!"
                        : "Estimated delivery: 30-45 mins"}
                    </p>
                </div>

                {/* 🟢 NEW: RATING BUTTON LOGIC */}
                {order.status === "DELIVERED" && (
                   <RatingDialog 
                     orderId={order.id} 
                     trigger={
                       <Button className="bg-white text-[#7b1e3a] hover:bg-gray-100 font-bold shadow-lg transition-transform hover:scale-105">
                         <Star className="w-4 h-4 mr-2 fill-[#7b1e3a]" /> Rate Order
                       </Button>
                     }
                   />
                )}
              </div>
            </div>

            <CardContent className="p-4 md:p-8">
              {/* Stepper Logic - Optimized for Mobile */}
              <div className="relative flex justify-between items-start w-full mb-8 mt-2">
                
                {/* 1. Background Line */}
                <div className="absolute top-4 md:top-6 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10 rounded-full" />
                
                {/* 2. Active Line (Animated) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max(
                      0,
                      (currentStep / (steps.length - 1)) * 100
                    )}%`,
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute top-4 md:top-6 left-0 h-1 bg-[#7b1e3a] -translate-y-1/2 -z-10 rounded-full"
                />

                {/* 3. Steps */}
                {steps.map((step, index) => {
                  const isActive = index <= currentStep;
                  const isCompleted = index < currentStep;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center gap-2 z-10"
                      style={{ width: '20%' }} // Distribute space evenly
                    >
                      {/* Icon Circle */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`h-8 w-8 md:h-12 md:w-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white ${
                          isActive
                            ? "border-[#7b1e3a] text-[#7b1e3a]"
                            : "border-gray-200 text-gray-300"
                        } ${
                          isCompleted
                            ? "!bg-[#7b1e3a] !text-white !border-[#7b1e3a]"
                            : ""
                        }`}
                      >
                        <StepIcon className="h-3.5 w-3.5 md:h-6 md:w-6" />
                      </motion.div>
                      
                      {/* Text Label */}
                      <span
                        className={`text-[9px] md:text-xs font-bold uppercase tracking-wide text-center leading-tight transition-colors duration-300 ${
                          isActive ? "text-[#7b1e3a]" : "text-gray-300"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Payment Pending Alert */}
              {order.paymentStatus === "PENDING" &&
                order.status !== "CANCELLED" && (
                  <div className="p-4 bg-[#7b1e3a]/5 border border-[#7b1e3a]/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="bg-[#7b1e3a]/10 p-2.5 rounded-full shrink-0">
                      <AlertCircle className="h-6 w-6 text-[#7b1e3a]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#7b1e3a] text-base">
                        Payment Required
                      </h4>
                      <p className="text-sm text-[#7b1e3a]/80 mt-0.5">
                        Your order is pending. Please complete payment to start
                        preparation.
                      </p>
                    </div>

                    {order.checkoutUrl && (
                      <Button
                        className="bg-[#7b1e3a] hover:bg-[#60152b] text-white shadow-md shadow-[#7b1e3a]/20 shrink-0 w-full sm:w-auto"
                        onClick={() =>
                          (window.location.href = order.checkoutUrl!)
                        }
                      >
                        Pay Now {formatMoney(order.totalAmount)}
                      </Button>
                    )}
                  </div>
                )}
            </CardContent>
          </Card>

          {/* 🚀 DELIVERY CODE SECTION */}
          {isOrderActive && (
            <>
              {showDeliveryCode && order.deliveryCode ? (
                // 🟢 SHOW CODE (When Rider is coming)
                <Card className="border-2 border-[#7b1e3a] bg-white shadow-lg shadow-[#7b1e3a]/10 rounded-2xl overflow-hidden">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#7b1e3a]/10">
                      <LockKeyhole className="h-6 w-6 text-[#7b1e3a]" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Secure Delivery Code
                    </h3>
                    <div className="my-3 text-5xl font-black tracking-[0.2em] text-[#7b1e3a]">
                      {order.deliveryCode}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-[#7b1e3a]/5 px-4 py-2 text-xs font-bold text-[#7b1e3a]">
                      <AlertCircle size={14} />
                      Give this code to the rider ONLY upon delivery.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // ℹ️ SHOW INFO MESSAGE (When Preparing)
                <div className="flex items-center gap-3 rounded-xl bg-[#7b1e3a]/5 p-4 border border-[#7b1e3a]/10 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-[#7b1e3a]/10">
                    <LockKeyhole size={18} className="text-[#7b1e3a]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#7b1e3a]">Secure Delivery</p>
                    <p className="text-xs text-[#7b1e3a]/70 leading-relaxed mt-0.5">
                      A delivery code will be sent to you once your order is en route.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Items List */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-[#7b1e3a]" />
                Items in your order
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {order.items?.map((orderItem: any, i: number) => (
                  <div
                    key={`${i}-${orderItem.menuItemName}`}
                    className="flex gap-4 p-5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 truncate pr-4">
                          {orderItem.menuItemName}
                        </h4>
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          {formatMoney(orderItem.price * orderItem.quantity)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        {formatMoney(orderItem.price)} × {orderItem.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Summary */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
              <CardTitle className="text-lg font-bold text-gray-800">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">
                    {formatMoney(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-medium text-gray-900">
                    {formatMoney(PLATFORM_FEE)}
                  </span>
                </div>
              </div>
              <Separator className="bg-gray-100" />
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-extrabold text-2xl text-[#7b1e3a]">
                  {formatMoney(order.totalAmount)}
                </span>
              </div>
            </CardContent>
            
            {/* Payment Status Bar */}
            <div
              className={`p-4 border-t ${
                order.paymentStatus === "PAID"
                  ? "bg-[#7b1e3a]/5 border-[#7b1e3a]/10"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div
                className={`flex items-center gap-2 justify-center text-xs font-bold uppercase tracking-wide ${
                  order.paymentStatus === "PAID"
                    ? "text-[#7b1e3a]"
                    : "text-gray-500"
                }`}
              >
                {order.paymentStatus === "PAID" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Payment Successful
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> Payment Pending
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-[#7b1e3a]/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-[#7b1e3a]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Delivering to
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>
              
              {/* Delivery Note */}
              {order.deliveryNotes && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-4">
                  <div className="h-10 w-10 bg-[#7b1e3a]/10 rounded-full flex items-center justify-center shrink-0">
                    <div className="h-5 w-5 text-[#7b1e3a] font-bold flex items-center justify-center">
                      !
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Instruction
                    </h4>
                    <p className="text-sm text-gray-600 italic">
                      "{order.deliveryNotes}"
                    </p>
                  </div>
                </div>
              )}
              
              {/* Restaurant Contact */}
              <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Vendor</p>
                    <p className="font-bold text-gray-900 text-sm">{order.restaurant?.name}</p>
                </div>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full border-gray-200 hover:border-[#7b1e3a] hover:text-[#7b1e3a]">
                    <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#faf9f8]">
        <Header />
        <main className="container py-8 px-4">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b1e3a]"></div>
                  <p className="text-gray-400 font-medium animate-pulse">
                    Retrieving your ticket...
                  </p>
                </div>
              </div>
            }
          >
            <OrderDetailsContent />
          </Suspense>
        </main>
      </div>
    </ProtectedRoute>
  );
}