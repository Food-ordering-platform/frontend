"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowLeft,
  MapPin,
  ShoppingBag,
  Loader2,
  Navigation,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import SetupLocationPage from "../setup-location/page";
import { cn, phoneSchema } from "@/lib/utils"; // Make sure to import cn

import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import {
  useCreateOrder,
  useGetOrderQuote,
} from "@/services/order/order.queries";
import { CreateOrderDto, OrderQuote } from "@/types/order.type";

const PLATFORM_FEE = 350;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();

  const { mutateAsync: placeOrder } = useCreateOrder();
  const { mutateAsync: calculateQuote, isPending: isQuoting } =
    useGetOrderQuote();

  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [phoneError, setPhoneError] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [quote, setQuote] = useState<OrderQuote | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");

  const restaurantId = items.length > 0 ? items[0].menuItem.restaurantId : "";
  const hasLocation = !!(user?.address && user?.latitude && user?.longitude);
  const idempotencyKey = useMemo(() => uuidv4(), []);

  // Update local state when user updates location in the modal
  useEffect(() => {
    if (user?.address) setDeliveryAddress(user.address);
  }, [user?.address]);

  // Calculate Quote Logic
  useEffect(() => {
    const fetchQuote = async () => {
      if (!restaurantId || !hasLocation || items.length === 0) {
        setQuote(null);
        return;
      }
      try {
        if (user?.latitude && user?.longitude) {
          const quoteData = await calculateQuote({
            restaurantId,
            deliveryLatitude: user.latitude,
            deliveryLongitude: user.longitude,
            items: items.map((i) => ({
              price: i.menuItem.price,
              quantity: i.quantity,
            })),
          });
          setQuote(quoteData);
        }
      } catch (error) {
        console.error("Failed to get quote", error);
        setQuote(null);
      }
    };
    fetchQuote();
  }, [
    restaurantId,
    user?.latitude,
    user?.longitude,
    items,
    calculateQuote,
    hasLocation,
  ]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;

    if (!hasLocation || !quote) {
      setIsLocationModalOpen(true);
      toast.error("Location Required", {
        description: "Please set your delivery location first.",
      });
      return;
    }
    const phoneValidation = phoneSchema.safeParse(phoneNumber);
    if (!phoneValidation.success) {
      // Extract the first error message and set it to state
      const errorMessage = phoneValidation.error.errors[0].message;
      setPhoneError(errorMessage);

      // Optionally toast it as well so the user really notices
      toast.error("Invalid Phone", { description: errorMessage });
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData: CreateOrderDto & { idempotencyKey: string } = {
        customerId: user.id,
        restaurantId: items[0].menuItem.restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryAddress,
        deliveryPhoneNumber: phoneNumber,
        deliveryNotes: instructions.trim(),
        deliveryLatitude: user.latitude!,
        deliveryLongitude: user.longitude!,
        name: user.name,
        email: user.email,
        idempotencyKey: idempotencyKey,
      };

      const response = await placeOrder(orderData);
      const { checkoutUrl } = response;

      toast.success("Order initiated!", {
        description: "Redirecting to secure payment...",
      });
      clearCart();
      window.location.href = checkoutUrl;
    } catch (error: any) {
      toast.error("Order failed", {
        description: error?.message || "Please try again.",
      });
      setIsPlacingOrder(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#faf9f8] pb-20">
        <Header />

        <main className="container max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="pl-0 hover:bg-transparent hover:text-[#7b1e3a]"
              asChild
            >
              <Link href="/restaurants" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> <span>Back to Menu</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
              Checkout
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">
                Your cart is empty
              </h2>
              <Button asChild className="bg-[#7b1e3a] hover:bg-[#60132a] mt-4">
                <Link href="/restaurants">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-0 shadow-sm ring-1 ring-gray-200">
                  <CardHeader className="border-b bg-gray-50/50 pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#7b1e3a]" /> Delivery
                      Details
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 space-y-8">
                    {/* 1. ADDRESS SECTION (Modified - No Input Field) */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Delivery Address
                      </Label>

                      <Dialog
                        open={isLocationModalOpen}
                        onOpenChange={setIsLocationModalOpen}
                      >
                        <DialogTrigger asChild>
                          <div
                            className={cn(
                              "flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer transition-all group",
                              "hover:border-[#7b1e3a] hover:bg-gray-50",
                              !deliveryAddress
                                ? "bg-amber-50 border-amber-200"
                                : "bg-white",
                            )}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="h-10 w-10 rounded-full bg-[#7b1e3a]/10 flex items-center justify-center shrink-0">
                                <MapPin className="h-5 w-5 text-[#7b1e3a]" />
                              </div>
                              <div className="flex flex-col truncate">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                  {deliveryAddress
                                    ? "Selected Location"
                                    : "Action Required"}
                                </span>
                                <span
                                  className={cn(
                                    "text-sm font-medium truncate",
                                    deliveryAddress
                                      ? "text-gray-900"
                                      : "text-amber-700",
                                  )}
                                >
                                  {deliveryAddress ||
                                    "Tap here to select delivery location on map"}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#7b1e3a]" />
                          </div>
                        </DialogTrigger>

                        <DialogContent className="max-w-3xl p-0 h-[85vh] overflow-hidden rounded-xl border-none">
                          <SetupLocationPage
                            isModal={true}
                            onComplete={() => setIsLocationModalOpen(false)}
                          />
                        </DialogContent>
                      </Dialog>

                      {!hasLocation && (
                        <p className="text-xs text-amber-600 pl-1">
                          * We need your exact location to calculate delivery
                          fees.
                        </p>
                      )}
                    </div>

                    {/* Phone & Note */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>
                          Contact Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="080 1234 5678"
                          className="h-12 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Delivery Note{" "}
                          <span className="text-gray-400 font-normal">
                            (Optional)
                          </span>
                        </Label>
                        <Textarea
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Gate code, landmark, etc."
                          className="resize-none bg-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ITEMS CARD */}
                <Card className="border-0 shadow-sm ring-1 ring-gray-200">
                  <CardHeader className="border-b bg-gray-50/50 pb-4">
                    <CardTitle className="text-lg font-bold">
                      Your Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-5">
                          {/* Placeholder for Item Image */}
                          <div className="h-14 w-14 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-xs text-gray-400 font-medium">
                            IMG
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-900 line-clamp-2">
                                {item.menuItem.name}
                              </h4>
                              <span className="font-bold text-gray-900 whitespace-nowrap ml-2">
                                {formatMoney(
                                  item.menuItem.price * item.quantity,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT COLUMN (Payment Summary) */}
              <div className="lg:col-span-5">
                <Card className="sticky top-24 border-0 shadow-xl shadow-gray-200/50 ring-1 ring-gray-200 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-[#7b1e3a] text-white p-6">
                    <CardTitle className="flex items-center gap-2">
                      Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-900">
                          {quote
                            ? formatMoney(quote.subtotal)
                            : formatMoney(getTotalPrice())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        {isQuoting ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#7b1e3a]" />
                        ) : (
                          <span className="font-semibold text-gray-900">
                            {quote ? formatMoney(quote.deliveryFee) : "---"}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-semibold text-gray-900">
                          {formatMoney(PLATFORM_FEE)}
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-extrabold text-[#7b1e3a]">
                        {quote ? formatMoney(quote.totalAmount) : "---"}
                      </span>
                    </div>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || !quote}
                      className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60132a] text-lg font-bold shadow-lg shadow-[#7b1e3a]/20"
                    >
                      {isPlacingOrder ? (
                        <Loader2 className="animate-spin" />
                      ) : !quote ? (
                        "Select Location to Continue"
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
