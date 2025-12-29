"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useCreateOrder } from "../../services/order/order.queries";
import { useRestaurantById } from "@/services/restaurants/restaurants.queries";
import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, ShoppingBag, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CreateOrderDto } from "@/types/order.type";
import { motion } from "framer-motion";
import { calculateDistance, calculateDeliveryFee } from "@/lib/utils"; 
import { v4 as uuidv4 } from "uuid"; 

const PLATFORM_FEE = 350;

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

  const restaurantId = items.length > 0 ? items[0].menuItem.restaurantId : "";
  const { data: restaurant } = useRestaurantById(restaurantId);

  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [orderNotes, setOrderNotes] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Address State
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 🛡️ IDEMPOTENCY: Generate a unique key when the component mounts
  const idempotencyKey = useMemo(() => uuidv4(), []);

  // 💰 DYNAMIC DELIVERY FEE STATE
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null); 

  // 🧮 CALCULATE FEE EFFECT
  useEffect(() => {
    if (restaurant && coords && restaurant.data?.latitude && restaurant.data?.longitude) {
      const dist = calculateDistance(
        restaurant.data.latitude,
        restaurant.data?.longitude,
        coords.lat,
        coords.lng
      );
      const fee = calculateDeliveryFee(dist);
      setDeliveryFee(fee);
    } else {
      setDeliveryFee(null);
    }
  }, [restaurant, coords]);

  const subtotal = getTotalPrice();
  const total = subtotal + (deliveryFee || 0) + PLATFORM_FEE;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
  };

  // 🔎 STRICT DELTA SEARCH
  useEffect(() => {
    if (!showSuggestions || deliveryAddress.length < 3) return;
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // ✅ Corrected Logic: 
        // We append "Delta State" to the query string 'q'.
        // We REMOVED '&state=Delta' because Nominatim forbids combining 'q' with structured params.
        const searchQuery = `${deliveryAddress}, Delta State`;
        
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1&countrycodes=ng`,
            { headers: { "Accept-Language": "en-US,en;q=0.9" } }
        );

        if (!res.ok) throw new Error("Failed to fetch addresses");

        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Address fetch error:", err);
        // Optional: clear suggestions on error so old ones don't stick
        setSuggestions([]); 
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [deliveryAddress, showSuggestions]);

  const handleSelectAddress = (item: AddressResult) => {
    const fullAddress = item.display_name.toLowerCase();
    
    // 🛑 STRICT REGION CHECK
    // Even if the search is biased, we double-check the result here.
    if (!fullAddress.includes("delta") && !fullAddress.includes("warri")) {
        toast({
            title: "Out of Service Area",
            description: "Please enter an address in Warri or Delta State. We do not deliver outside this region.",
            variant: "destructive"
        });
        setDeliveryAddress("");
        setCoords(null);
        setShowSuggestions(false);
        return;
    }

    setDeliveryAddress(item.display_name);
    setCoords({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setShowSuggestions(false);
  };

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;

    if (!deliveryAddress.trim()) {
      toast({ title: "Address Required", description: "Please enter your delivery address.", variant: "destructive" });
      return;
    }

    // 🛑 ENFORCE DROPDOWN SELECTION
    if (!coords || deliveryFee === null) {
        toast({ 
            title: "Select Address from List", 
            description: "You must click one of the address suggestions to confirm your location.", 
            variant: "destructive" 
        });
        return;
    }

    if (!phoneNumber.trim()) {
      toast({ title: "Phone Required", description: "We need a number for updates.", variant: "destructive" });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // 🛡️ Pass idempotencyKey here. 
      const orderData: CreateOrderDto & { idempotencyKey: string } = {
        customerId: user.id,
        restaurantId: items[0].menuItem.restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryAddress.trim(),
        deliveryNotes: orderNotes.trim(),
        deliveryLatitude: coords?.lat,
        deliveryLongitude: coords?.lng,
        name: user.name,
        email: user.email,
        idempotencyKey: idempotencyKey 
      };

      const response = await placeOrder(orderData);
      const { checkoutUrl } = response;

      toast({ title: "Order initiated!", description: `Redirecting to payment...` });
      clearCart();
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
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* ✅ FIX: Z-Index Stacking
                   Added 'relative z-20' to ensure this card (and its dropdown) 
                   floats ABOVE the items card below it.
                */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.1 }}
                    className="relative z-20"
                >
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
                                    <Label className="text-sm font-semibold text-gray-700">Delivery Address (Delta State Only)</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Search & Select Address (e.g. Airport Road)"
                                            value={deliveryAddress}
                                            onChange={(e) => {
                                                setDeliveryAddress(e.target.value);
                                                setShowSuggestions(true);
                                                
                                                // 🛑 KEY LOGIC: If they type manually, wipe coordinates.
                                                if(coords) setCoords(null); 
                                                setDeliveryFee(null); 
                                            }}
                                            className={`pl-4 border-gray-200 bg-gray-50/50 ${coords ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-2.5">
                                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            </div>
                                        )}
                                    </div>

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
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="relative z-10" // Lower z-index so it stays behind delivery dropdown
                >
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
                                    <span className="font-semibold text-gray-900">{formatMoney(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="text-sm font-medium">Delivery Fee</span>
                                    <span className={`font-semibold ${deliveryFee === null ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                                        {deliveryFee === null ? "Enter Address..." : formatMoney(deliveryFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="text-sm font-medium">Platform Fee</span>
                                    <span className="font-semibold text-gray-900">{formatMoney(PLATFORM_FEE)}</span>
                                </div>
                            </div>
                            <Separator className="bg-gray-100" />
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-lg text-gray-900">Total to Pay</span>
                                <span className="font-extrabold text-3xl text-[#7b1e3a] tracking-tight">{formatMoney(total)}</span>
                            </div>
                            
                            <Button 
                                onClick={handlePlaceOrder} 
                                disabled={isPlacingOrder || deliveryFee === null} 
                                className="w-full h-14 bg-[#7b1e3a] hover:bg-[#60132a] text-white text-lg font-bold rounded-xl shadow-lg shadow-[#7b1e3a]/20 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {isPlacingOrder ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                  </>
                                ) : (
                                  deliveryFee === null ? "Select Address from List" : `Secure Checkout ${formatMoney(total)}`
                                )}
                            </Button>
                            
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium pt-2">
                                <ShieldCheck className="h-3 w-3" /> Secure Payment by Korapay
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