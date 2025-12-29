"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useCreateOrder, useGetOrderQuote } from "../../services/order/order.queries";
import { useRestaurantById } from "@/services/restaurants/restaurants.queries";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, MapPin, ShoppingBag, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CreateOrderDto, OrderQuote } from "@/types/order.type";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import ReactGoogleAutocomplete from "react-google-autocomplete";

const PLATFORM_FEE = 350;

// 🌍 RESTRICTED BOUNDS (Warri, Effurun, Abraka Axis)
// Excludes Asaba (6.7E) and Benin (6.3N)
const DELTA_STATE_BOUNDS = {
  north: 6.00, // Just above Abraka
  south: 5.40, // Just below Warri
  east: 6.30,  // Just East of Abraka
  west: 5.60,  // Just West of Warri/Effurun
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  
  const { mutateAsync: placeOrder } = useCreateOrder();
  const { mutateAsync: calculateQuote, isPending: isQuoting } = useGetOrderQuote();

  const restaurantId = items.length > 0 ? items[0].menuItem.restaurantId : "";

  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [orderNotes, setOrderNotes] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Address State (Internal Logic Only)
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  // ✅ PREFILL VARIABLE (Calculated once)
  const inputAutocompleteValue = user?.address || "";

  const idempotencyKey = useMemo(() => uuidv4(), []);
  const [quote, setQuote] = useState<OrderQuote | null>(null);

  // 🚀 OPTIMIZATION: Pre-fill State from Profile (Logic only, no input manipulation)
  useEffect(() => {
    if (user?.address && user?.latitude && user?.longitude && !deliveryAddress) {
        setDeliveryAddress(user.address);
        setCoords({ lat: user.latitude, lng: user.longitude });
    }
  }, [user]);

  // 🧮 FETCH QUOTE EFFECT
  useEffect(() => {
    const fetchQuote = async () => {
        if (!restaurantId || !coords || items.length === 0) {
            setQuote(null);
            return;
        }

        try {
            const quoteData = await calculateQuote({
                restaurantId,
                deliveryLatitude: coords.lat,
                deliveryLongitude: coords.lng,
                items: items.map(i => ({ price: i.menuItem.price, quantity: i.quantity }))
            });
            setQuote(quoteData);
        } catch (error) {
            console.error("Failed to get quote", error);
            setQuote(null);
        }
    };

    fetchQuote();
  }, [restaurantId, coords, items, calculateQuote]);


  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
  };

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;

    if (!deliveryAddress.trim() || !coords || !quote) {
        toast.error("Address Required", { description: "Please select a valid address from the list." });
        return;
    }

    if (!phoneNumber.trim()) {
      toast.error("Phone Required", { description: "We need a number for updates." });
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
        deliveryAddress: deliveryAddress.trim(),
        deliveryNotes: orderNotes.trim(),
        deliveryLatitude: coords.lat,
        deliveryLongitude: coords.lng,
        name: user.name,
        email: user.email,
        idempotencyKey: idempotencyKey 
      };

      const response = await placeOrder(orderData);
      const { checkoutUrl } = response;

      toast.success("Order initiated!", { description: "Redirecting to payment..." });
      clearCart();
      window.location.href = checkoutUrl;
      
    } catch (error: any) {
      toast.error("Order failed", { description: error?.message || "Please try again." });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#faf9f8] font-sans">
        <Header />
        
        <main className="container py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[#7b1e3a] mb-2" asChild>
                <Link href="/restaurants" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> <span>Continue Shopping</span>
                </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
          </motion.div>

          {items.length === 0 ? (
            <div className="text-center py-24"><p>Your cart is empty</p></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8">
                
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="relative z-20">
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-visible bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center justify-between text-lg font-bold text-gray-800">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-5 w-5 text-[#7b1e3a]" /> Delivery Details
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-2 relative z-50"> 
                                    <Label className="text-sm font-semibold text-gray-700">Delivery Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                        
                                        {/* 🚀 FIXED: UNCONTROLLED COMPONENT with WARRI/ABRAKA BOUNDS */}
                                        <ReactGoogleAutocomplete
                                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                                            onPlaceSelected={(place) => {
                                                if (place.geometry && place.geometry.location) {
                                                    const lat = place.geometry.location.lat();
                                                    const lng = place.geometry.location.lng();
                                                    const address = place.formatted_address || "";
                                                    
                                                    // 🛡️ Strict Client-Side Check for Delta State
                                                    if (!address.toLowerCase().includes("delta")) {
                                                        toast.error("Invalid Location", { description: "We currently only serve Warri, Effurun, and Abraka." });
                                                        setDeliveryAddress("");
                                                        setCoords(null);
                                                        setQuote(null);
                                                        return;
                                                    }

                                                    setDeliveryAddress(address);
                                                    setCoords({ lat, lng });
                                                }
                                            }}
                                            options={{
                                                types: [], // Empty to allow businesses/landmarks
                                                componentRestrictions: { country: "ng" }, 
                                                strictBounds: true, // ✅ FORCE BOUNDS
                                                bounds: DELTA_STATE_BOUNDS, // ✅ WARRI/ABRAKA ONLY
                                            }}
                                            defaultValue={inputAutocompleteValue}
                                            placeholder="Search & Select Address (e.g. PTI Junction)"
                                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 ${coords ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                                            // ❌ NO onChange
                                            // ❌ NO value
                                            // ❌ NO ref
                                        />
                                    </div>

                                    {coords && (
                                        <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                                            <MapPin className="h-3 w-3" /> Address confirmed for delivery!
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
                                        <Input
                                            type="tel"
                                            placeholder="0801 234 5678"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="border-gray-200 bg-gray-50/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Detailed Instructions (Optional)</Label>
                                        <Input
                                            placeholder="Flat number, Gate code, knock hard..."
                                            value={orderNotes}
                                            onChange={(e) => setOrderNotes(e.target.value)}
                                            className="border-gray-200 bg-gray-50/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* ITEMS CARD */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden bg-white">
                         <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                                <ShoppingBag className="h-5 w-5 text-[#7b1e3a]" /> Your Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                             <div className="divide-y divide-gray-100">
                                {items.map((item, index) => (
                                    <div key={`${item.menuItem.id}-${index}`} className="flex gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                                        <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                            <Image src={item.menuItem.image || "/placeholder.svg"} alt={item.menuItem.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-900 truncate pr-4">{item.menuItem.name}</h4>
                                                <p className="font-bold text-gray-900">{formatMoney(item.menuItem.price * item.quantity)}</p>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium mr-2 text-gray-700">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
              </div>

              {/* Right Column - Payment */}
              <div className="lg:col-span-5 relative">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="sticky top-24">
                    <Card className="border-0 shadow-xl shadow-gray-200/50 ring-1 ring-gray-200 rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-[#7b1e3a] text-white p-6">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-white/80" /> Payment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="text-sm font-medium">Subtotal</span>
                                    <span className="font-semibold text-gray-900">{quote ? formatMoney(quote.subtotal) : formatMoney(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="text-sm font-medium">Delivery Fee</span>
                                    {isQuoting ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    ) : (
                                        <span className={`font-semibold ${quote ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                            {quote ? formatMoney(quote.deliveryFee) : "Enter Address..."}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="text-sm font-medium">Platform Fee</span>
                                    <span className="font-semibold text-gray-900">{formatMoney(PLATFORM_FEE)}</span>
                                </div>
                            </div>
                            <Separator className="bg-gray-100" />
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-lg text-gray-900">Total to Pay</span>
                                <span className="font-extrabold text-3xl text-[#7b1e3a] tracking-tight">
                                    {quote ? formatMoney(quote.totalAmount) : "---"}
                                </span>
                            </div>
                            
                            <Button 
                                onClick={handlePlaceOrder} 
                                disabled={isPlacingOrder || !quote} 
                                className="w-full h-14 bg-[#7b1e3a] hover:bg-[#60132a] text-white text-lg font-bold rounded-xl shadow-lg shadow-[#7b1e3a]/20 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {isPlacingOrder ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                  </>
                                ) : (
                                  !quote ? "Select Address from List" : `Secure Checkout ${formatMoney(quote.totalAmount)}`
                                )}
                            </Button>
                            
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium pt-2">
                                <ShieldCheck className="h-3 w-3" /> Secure Payment by Paystack
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
              </div>

            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}