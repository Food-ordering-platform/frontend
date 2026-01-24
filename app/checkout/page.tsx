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
  CreditCard, 
  ShieldCheck, 
  Phone, 
  StickyNote,
  PenLine,
  Navigation,
  Building,
  Home
} from "lucide-react";
import { toast } from "sonner";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import SetupLocationPage from "../setup-location/page"; 
import AddressAutocomplete from "@/components/checkout/address-autocomplete";

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
  
  // Local address state (synced with user initially)
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");

  // Derived State
  const restaurantId = items.length > 0 ? items[0].menuItem.restaurantId : "";
  const hasLocation = !!(user?.address && user?.latitude && user?.longitude);
  const idempotencyKey = useMemo(() => uuidv4(), []);

  // Sync address if user updates it via modal
  useEffect(() => {
    if (user?.address) setDeliveryAddress(user.address);
  }, [user?.address]);

  // 1. Calculate Dynamic Delivery Fee
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

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
  };

  // 2. Handle Order Placement
  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;

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
      const orderData: CreateOrderDto & { idempotencyKey: string } = {
        customerId: user.id,
        restaurantId: items[0].menuItem.restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryAddress, // Use the state address
        deliveryNotes: instructions.trim(),
        deliveryLatitude: user.latitude!,
        deliveryLongitude: user.longitude!,
        name: user.name,
        email: user.email,
        idempotencyKey: idempotencyKey 
      };

      const response = await placeOrder(orderData);
      const { checkoutUrl } = response;

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
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-8">
                        {/* Improved Address Input Section */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">Delivery Address</Label>
                            <div className="flex gap-2">
                                {/* Auto-complete Input */}
                                <div className="flex-1">
                                    <AddressAutocomplete 
                                        defaultValue={deliveryAddress}
                                        onSelect={(addr) => setDeliveryAddress(addr)}
                                    />
                                </div>

                                {/* Map Trigger Button */}
                                <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="shrink-0 aspect-square p-0 border-[#7b1e3a] text-[#7b1e3a] bg-[#7b1e3a]/5 hover:bg-[#7b1e3a]/10">
                                            <Navigation className="h-5 w-5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl p-0 h-[80vh] overflow-hidden rounded-xl">
                                        <SetupLocationPage isModal={true} onComplete={() => setIsLocationModalOpen(false)} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            
                            {/* Address Status Feedback */}
                            {!hasLocation && (
                                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                                    <MapPin className="h-3 w-3" />
                                    <span>Please click the map icon to pinpoint your exact GPS location for accurate delivery fees.</span>
                                </div>
                            )}
                        </div>

                        {/* Phone & Instructions */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                   <Phone className="w-4 h-4 text-[#7b1e3a]" /> Contact Number <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-[90px] flex items-center justify-center bg-gray-50 border-r border-gray-200 rounded-l-md z-10 text-gray-500 text-sm font-medium">
                                        🇳🇬 +234
                                    </div>
                                    <Input
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="80 1234 5678"
                                        className="pl-[105px] h-12 bg-white border-gray-200 focus-visible:ring-[#7b1e3a] focus-visible:border-[#7b1e3a] text-base transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                   <StickyNote className="w-4 h-4 text-[#7b1e3a]" /> Delivery Note <span className="text-gray-400 font-normal text-xs ml-auto">(Optional)</span>
                                </Label>
                                <div className="relative">
                                    <Textarea
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="E.g., Gate code is 1234. Call when you arrive."
                                        className="min-h-[100px] bg-white border-gray-200 focus-visible:ring-[#7b1e3a] focus-visible:border-[#7b1e3a] resize-none p-4 text-sm shadow-sm"
                                    />
                                    <PenLine className="absolute bottom-4 right-4 h-4 w-4 text-gray-300 pointer-events-none" />
                                </div>
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
                                        {/* Placeholder for image */}
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">img</div> 
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