"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, MapPin, ShoppingBag, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import SetupLocationPage from "../setup-location/page"; // Import the map component

// Hooks & Services
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useCreateOrder, useGetOrderQuote } from "@/services/order/order.queries";
import { CreateOrderDto, OrderQuote } from "@/types/order.type";

const PLATFORM_FEE = 350;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  
  // API Mutations
  const { mutateAsync: placeOrder } = useCreateOrder();
  const { mutateAsync: calculateQuote, isPending: isQuoting } = useGetOrderQuote();

  // State
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [instructions, setInstructions] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [quote, setQuote] = useState<OrderQuote | null>(null);

  // Derived State
  const restaurantId = items.length > 0 ? items[0].menuItem.restaurantId : "";
  const hasLocation = !!(user?.address && user?.latitude && user?.longitude);
  const idempotencyKey = useMemo(() => uuidv4(), []);

  // 1. Calculate Dynamic Delivery Fee
  useEffect(() => {
    const fetchQuote = async () => {
        if (!restaurantId || !hasLocation || items.length === 0) {
            setQuote(null);
            return;
        }

        try {
            // Only calculate if we have coordinates
            if (user?.latitude && user?.longitude) {
                const quoteData = await calculateQuote({
                    restaurantId,
                    deliveryLatitude: user.latitude,
                    deliveryLongitude: user.longitude,
                    items: items.map(i => ({ price: i.menuItem.price, quantity: i.quantity }))
                });
                setQuote(quoteData);
            }
        } catch (error) {
            console.error("Failed to get quote", error);
            setQuote(null);
        }
    };

    fetchQuote();
  }, [restaurantId, user?.latitude, user?.longitude, items, calculateQuote, hasLocation]);

  // Helper to format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
  };

  // 2. Handle Order Placement
  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;

    // Validation
    if (!hasLocation || !quote) {
        setIsLocationModalOpen(true);
        toast.error("Location Required", { description: "Please set your delivery location first." });
        return;
    }

    if (!phoneNumber.trim()) {
      toast.error("Phone Required", { description: "We need a number to contact you." });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Prepare Payload
      const orderData: CreateOrderDto & { idempotencyKey: string } = {
        customerId: user.id,
        restaurantId: items[0].menuItem.restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
        deliveryAddress: user.address!,
        deliveryNotes: instructions.trim(), // <--- Sending Instructions
        deliveryLatitude: user.latitude!,
        deliveryLongitude: user.longitude!,
        name: user.name,
        email: user.email,
        idempotencyKey: idempotencyKey 
      };

      // Call API
      const response = await placeOrder(orderData);
      const { checkoutUrl } = response;

      // Redirect to Payment
      toast.success("Order initiated!", { description: "Redirecting to secure payment..." });
      clearCart();
      window.location.href = checkoutUrl;
      
    } catch (error: any) {
      toast.error("Order failed", { description: error?.message || "Please try again." });
      setIsPlacingOrder(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#faf9f8] pb-20">
        <Header />
        
        <main className="container max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[#7b1e3a]" asChild>
                <Link href="/restaurants" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> <span>Back to Menu</span>
                </Link>
            </Button>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Checkout</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
                <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added anything yet.</p>
                <Button asChild className="bg-[#7b1e3a] hover:bg-[#60132a]">
                    <Link href="/restaurants">Start Shopping</Link>
                </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: DETAILS */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Delivery Details */}
                <Card className="border-0 shadow-sm ring-1 ring-gray-200">
                    <CardHeader className="border-b bg-gray-50/50 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-[#7b1e3a]" /> Delivery Details
                            </CardTitle>
                            
                            {/* LOCATION MODAL TRIGGER */}
                            <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-[#7b1e3a] border-[#7b1e3a]/30 hover:bg-[#7b1e3a]/5">
                                        {hasLocation ? "Change Location" : "Set Location"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl p-0 h-[80vh] overflow-hidden rounded-xl">
                                    <SetupLocationPage isModal={true} onComplete={() => setIsLocationModalOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-5">
                        {/* Address Status */}
                        <div className={`p-4 rounded-lg border ${hasLocation ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            {hasLocation ? (
                                <div className="flex gap-3">
                                    <MapPin className="h-5 w-5 text-green-700 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-green-900 text-sm">Delivery Address</p>
                                        <p className="text-green-800 text-sm mt-1">{user?.address}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-red-800 text-sm font-medium">
                                    <MapPin className="h-5 w-5" />
                                    <span>No address set. Please click "Set Location".</span>
                                </div>
                            )}
                        </div>

                        {/* Phone & Instructions */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="080..."
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Delivery Instructions (Optional)</Label>
                                <Textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="E.g. Call when outside, leave at gate, extra spicy..."
                                    className="bg-gray-50 min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Order Items */}
                <Card className="border-0 shadow-sm ring-1 ring-gray-200">
                    <CardHeader className="border-b bg-gray-50/50 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-[#7b1e3a]" /> Your Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-5">
                                    <div className="h-16 w-16 bg-gray-100 rounded-md shrink-0 overflow-hidden border">
                                        {/* Ideally use item.menuItem.image here */}
                                        <div className="w-full h-full bg-gray-200" /> 
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <h4 className="font-semibold text-gray-900 line-clamp-1">{item.menuItem.name}</h4>
                                            <span className="font-bold text-gray-900">{formatMoney(item.menuItem.price * item.quantity)}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} x {formatMoney(item.menuItem.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
              </div>

              {/* RIGHT COLUMN: PAYMENT SUMMARY */}
              <div className="lg:col-span-5">
                <div className="sticky top-24">
                    <Card className="border-0 shadow-xl shadow-gray-200/50 ring-1 ring-gray-200 rounded-2xl overflow-hidden">
                        <CardHeader className="bg-[#7b1e3a] text-white p-6">
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-white/90" /> Payment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            
                            {/* Breakdown */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-900">
                                        {quote ? formatMoney(quote.subtotal) : formatMoney(getTotalPrice())}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    {isQuoting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <span className={`font-semibold ${quote ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {quote ? formatMoney(quote.deliveryFee) : "---"}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Service Fee</span>
                                    <span className="font-semibold text-gray-900">{formatMoney(PLATFORM_FEE)}</span>
                                </div>
                            </div>

                            <Separator />

                            {/* Total */}
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-extrabold text-[#7b1e3a]">
                                    {quote ? formatMoney(quote.totalAmount) : "---"}
                                </span>
                            </div>

                            {/* Pay Button */}
                            <Button 
                                onClick={handlePlaceOrder} 
                                disabled={isPlacingOrder || !quote}
                                className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60132a] text-lg font-bold shadow-lg shadow-[#7b1e3a]/20"
                            >
                                {isPlacingOrder ? (
                                    <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing... </>
                                ) : (
                                    !quote ? "Set Location to Pay" : `Pay ${formatMoney(quote.totalAmount)}`
                                )}
                            </Button>

                            <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
                                <ShieldCheck className="h-3 w-3" /> Secure Payment via Paystack
                            </div>
                        </CardContent>
                    </Card>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}