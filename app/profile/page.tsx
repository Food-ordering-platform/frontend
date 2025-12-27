"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useGetOrders } from "@/services/order/order.queries";
import { useUpdateProfile } from "@/services/auth/auth.queries"; // 👈 Import the Hook
import { useToast } from "@/hooks/use-toast";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Heart, MapPin, LogOut, Loader2, Locate } from "lucide-react";

// Type for OpenStreetMap results
type AddressResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  
  // 👇 Use the Mutation Hook (Handles API + Loading State)
  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();

  // 1. Form States
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  
  // 2. Location States
  const [address, setAddress] = useState(user?.address || "");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(
    user?.latitude && user?.longitude 
      ? { lat: user.latitude, lng: user.longitude } 
      : null
  );
  
  // 3. Search States
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch orders for stats
  const { data: orders = [] } = useGetOrders(user?.id || "");
  const totalOrders = orders.length;

  // 🔎 Address Search Logic
  useEffect(() => {
    if (!showSuggestions || address.length < 3) return;
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=ng&limit=5`
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
  }, [address, showSuggestions]);

  const handleSelectAddress = (item: AddressResult) => {
    setAddress(item.display_name);
    setCoords({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setShowSuggestions(false);
  };

  // 📍 GPS Logic
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
          if (data.display_name) setAddress(data.display_name);
        } catch (error) {
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      },
      () => toast({ title: "Error", description: "Could not retrieve location.", variant: "destructive" })
    );
  };

  const handleLogout = () => {
    toast({ title: "Signed Out", description: "See you next time!" });
    clearCart();
    logout();
    router.push("/");
  };

  const handleSave = async () => {
    try {
      // 👇 Call Mutation
      await updateProfile({
        name,
        phone,
        address,
        latitude: coords?.lat,
        longitude: coords?.lng
      });
      // Success toast is handled in the hook!
    } catch (error: any) {
      // Error toast is handled in the hook!
    }
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans">
      <Header />
      <main className="container py-8 md:py-12 flex-1 max-w-5xl mx-auto space-y-8 px-4">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
           <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white shadow-xl">
                    <AvatarImage alt={user.name} />
                    <AvatarFallback className="bg-[#7b1e3a] text-white text-2xl font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{user.name}</h1>
                    <p className="text-gray-500 font-medium">{user.email}</p>
                    <div className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {user.role}
                    </div>
                </div>
           </div>
           
           <Button 
                variant="outline" 
                className="text-red-600 border-red-100 hover:bg-red-50"
                onClick={handleLogout}
            >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
           </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-md bg-gradient-to-br from-[#7b1e3a] to-[#5a162b] text-white">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-white/70 font-medium text-sm">Total Orders</p>
                        <h3 className="text-3xl font-bold mt-1">{totalOrders}</h3>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl">
                        <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                </CardContent>
            </Card>
            {/* You can add more stat cards here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Personal Info Form */}
            <Card className="md:col-span-2 shadow-sm border-gray-200">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your contact and default delivery details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." />
                        </div>

                        {/* ADDRESS SECTION */}
                        <div className="space-y-2 relative">
                            <div className="flex justify-between items-center">
                                <Label>Default Address</Label>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-[#7b1e3a] hover:text-[#7b1e3a]/90 hover:bg-orange-50"
                                    onClick={handleUseGPS}
                                    type="button"
                                >
                                    <Locate className="h-3 w-3 mr-1" /> Use GPS
                                </Button>
                            </div>
                            
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    placeholder="Search your street address..." 
                                    className="pl-9"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-3">
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* SEARCH DROPDOWN */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                                    {suggestions.map((item) => (
                                        <button
                                            key={item.place_id}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm border-b last:border-0 border-gray-100 transition-colors"
                                            onClick={() => handleSelectAddress(item)}
                                            type="button"
                                        >
                                            {item.display_name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Coordinates Indicator */}
                            <div className="text-xs flex items-center gap-2 mt-1">
                                {coords ? (
                                    <span className="text-green-600 flex items-center font-medium">
                                        <MapPin className="h-3 w-3 mr-1" /> Location Pinned
                                    </span>
                                ) : (
                                    <span className="text-gray-400 italic">No GPS location set</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button 
                            className="bg-[#7b1e3a] hover:bg-[#66172e] text-white min-w-[120px]"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Account Actions */}
             <Card className="shadow-sm border-gray-200 h-fit">
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start h-12 text-gray-600 hover:text-[#7b1e3a] hover:bg-orange-50">
                        <Heart className="mr-3 h-5 w-5" /> Favorites
                    </Button>
                    <Separator className="my-2"/>
                    <Button variant="ghost" className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50">
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}