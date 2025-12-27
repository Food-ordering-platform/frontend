// food-ordering-platform/frontend/frontend-wip-staging/app/checkout/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useCreateOrder } from "../../services/order/order.queries";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, ShoppingBag, Loader2, Locate } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CreateOrderDto } from "@/types/order.type"; // Uses the updated type
import { motion } from "framer-motion";

// Pricing Constants (Must match Backend)
const DELIVERY_FEE = 1500;
const PLATFORM_FEE = 350; // 👈 Added Platform Fee
const TAX_RATE = 0.075;

type AddressResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: placeOrder } = useCreateOrder();

  // Form State
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [orderNotes, setOrderNotes] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Location State (Pre-fill from User Profile if available)
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(
    user?.latitude && user?.longitude 
      ? { lat: user.latitude, lng: user.longitude } 
      : null
  );

  // Search State
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 💰 DISPLAY CALCULATION (Visual Only)
  const subtotal = getTotalPrice();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + DELIVERY_FEE + tax + PLATFORM_FEE;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
  };

  // 🔎 1. ADDRESS SEARCH (Debounced)
  useEffect(() => {
    if (!showSuggestions || deliveryAddress.length < 3) return;
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(deliveryAddress)}&countrycodes=ng&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [deliveryAddress, showSuggestions]);

  // 📍 2. SELECT ADDRESS
  const handleSelectAddress = (item: AddressResult) => {
    setDeliveryAddress(item.display_name);
    setCoords({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setShowSuggestions(false);
  };

  // 🛰️ 3. USE GPS
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      return;
    }
    toast({ title: "Locating...", description: "Fetching your current position." });
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.display_name) setDeliveryAddress(data.display_name);
        } catch (error) {
          setDeliveryAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      },
      () => toast({ title: "Error", description: "Could not retrieve location.", variant: "destructive" })
    );
  };

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;

    if (!deliveryAddress.trim()) {
      toast({ title: "Address Required", description: "Please enter your delivery address.", variant: "destructive" });
      return;
    }

    // Optional: Enforce GPS coordinates for accurate delivery
    // if (!coords) { ... }

    if (!phoneNumber.trim()) {
      toast({ title: "Phone Required", description: "We need a number for updates.", variant: "destructive" });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // 👇 CONSTRUCT PAYLOAD (No Total Amount sent)
      const orderData: CreateOrderDto = {
        customerId: user.id,
        restaurantId: items[0].menuItem.restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          // Price is intentionally omitted here
        })),
        // Total Amount omitted
        deliveryAddress: deliveryAddress.trim(),
        deliveryNotes: orderNotes.trim(),
        deliveryLatitude: coords?.lat,
        deliveryLongitude: coords?.lng,
        name: user.name,
        email: user.email,
      };

      const response = await placeOrder(orderData);
      
      // Backend returns the secure checkout URL
      const { checkoutUrl } = response;

      toast({ title: "Order initiated!", description: `Redirecting to payment...` });
      clearCart();
      
      // Redirect to Paystack/Payment Gateway
      window.location.href = checkoutUrl;
      
    } catch (error: any) {
      toast({ title: "Order failed", description: error?.message || "Please try again.", variant: "destructive" });
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
              
              {/* Left Column: Address & Items */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* 1. DELIVERY ADDRESS CARD */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-visible bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center justify-between text-lg font-bold text-gray-800">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-5 w-5 text-[#7b1e3a]" /> Delivery Details
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleUseGPS} className="text-[#7b1e3a] hover:bg-orange-50">
                                  <Locate className="h-4 w-4 mr-1" /> Use GPS
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid gap-6">
                                {/* SMART ADDRESS INPUT */}
                                <div className="space-y-2 relative z-50"> 
                                    <Label className="text-sm font-semibold text-gray-700">Delivery Address</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Start typing address..."
                                            value={deliveryAddress}
                                            onChange={(e) => {
                                                setDeliveryAddress(e.target.value);
                                                setShowSuggestions(true);
                                                if(coords) setCoords(null); 
                                            }}
                                            className="pl-4 border-gray-200 bg-gray-50/50"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-2.5">
                                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* SEARCH RESULTS DROPDOWN */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                            {suggestions.map((item) => (
                                                <button
                                                    key={item.place_id}
                                                    onClick={() => handleSelectAddress(item)}
                                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors flex items-start gap-2"
                                                >
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                                    <span className="truncate">{item.display_name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* COORDS INDICATOR */}
                                    {coords && (
                                        <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                                            <MapPin className="h-3 w-3" /> Exact location pinned for rider!
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
                                        <Label className="text-sm font-semibold text-gray-700">Instructions (Optional)</Label>
                                        <Input
                                            placeholder="Gate code, knock hard..."
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

                {/* 2. ITEMS LIST */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
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

              {/* Right Column: Payment Summary */}
              <div className="lg:col-span-5 relative">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="sticky top-24">
                    <Card className="border-0 shadow-xl shadow-gray-200/50 ring-1 ring-gray-200 rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-[#7b1e3a] text-white p-6"><CardTitle>Payment Summary</CardTitle></CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium text-gray-900">{formatMoney(subtotal)}</span></div>
                                <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span className="font-medium text-gray-900">{formatMoney(DELIVERY_FEE)}</span></div>
                                <div className="flex justify-between text-gray-600"><span>Platform Fee</span><span className="font-medium text-gray-900">{formatMoney(PLATFORM_FEE)}</span></div>
                                <div className="flex justify-between text-gray-600"><span>VAT (7.5%)</span><span className="font-medium text-gray-900">{formatMoney(tax)}</span></div>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-lg text-gray-900">Total</span>
                                <span className="font-extrabold text-3xl text-[#7b1e3a]">{formatMoney(total)}</span>
                            </div>
                            <Button onClick={handlePlaceOrder} disabled={isPlacingOrder} className="w-full h-14 bg-[#7b1e3a] text-white text-lg rounded-xl hover:bg-[#60132a] transition-all">
                                {isPlacingOrder ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                  </>
                                ) : (
                                  `Pay ${formatMoney(total)}`
                                )}
                            </Button>
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