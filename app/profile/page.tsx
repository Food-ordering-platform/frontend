"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useGetOrders } from "@/services/order/order.queries";
import { useUpdateProfile } from "@/services/auth/auth.queries";
import { toast } from "sonner";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Loader2,
  Locate,
  Clock,
  CheckCircle,
} from "lucide-react";
// 🚀 GOOGLE MAPS IMPORT
import ReactGoogleAutocomplete from "react-google-autocomplete";

// 🌍 DELTA STATE BOUNDARIES (Approximate Box)
const DELTA_STATE_BOUNDS = {
  north: 6.5, // Top Latitude
  south: 5.0, // Bottom Latitude
  east: 6.75, // Right Longitude
  west: 5.0, // Left Longitude
};

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();

  const { mutateAsync: updateProfile, isPending: isSaving } =
    useUpdateProfile();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    user?.latitude && user?.longitude
      ? { lat: user.latitude, lng: user.longitude }
      : null
  );

  const { data: orders = [] } = useGetOrders(user?.id || "");
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) =>
    ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "CONFIRMED"].includes(o.status)
  ).length;
  const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;

  // 📍 GPS HANDLER
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    toast.loading("Fetching your current position...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // 🛡️ CLIENT-SIDE VALIDATION: Check if inside Delta State bounds
        if (
          latitude > DELTA_STATE_BOUNDS.north ||
          latitude < DELTA_STATE_BOUNDS.south ||
          longitude > DELTA_STATE_BOUNDS.east ||
          longitude < DELTA_STATE_BOUNDS.west
        ) {
          toast.error(
            "We noticed you are outside Delta State. We currently only serve this region."
          );
          // We allow them to save it anyway if they insist, or you can return; to block it.
        }

        setCoords({ lat: latitude, lng: longitude });

        try {
          // Keep using free nominatim for reverse geocoding to save Google costs
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data.display_name) setAddress(data.display_name);
        } catch (error) {
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      },
      () => toast.error("Could not retrieve location.")
    );
  };

  const handleLogout = () => {
    toast.success("See you next time!");
    clearCart();
    logout();
    router.push("/");
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile({
        name,
        phone,
        address,
        latitude: coords?.lat,
        longitude: coords?.lng,
      });

      if (user) setUser({ ...user, ...updatedUser.user });

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error(error);
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
        {/* Profile Header & Stats (Kept same as before) */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white shadow-xl">
              <AvatarImage alt={user.name} />
              <AvatarFallback className="bg-[#7b1e3a] text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {user.name}
              </h1>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-md bg-gradient-to-br from-[#7b1e3a] to-[#5a162b] text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-white/70 font-medium text-sm">
                  Total Orders
                </p>
                <h3 className="text-3xl font-bold mt-1">{totalOrders}</h3>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-sm">
                  Active Orders
                </p>
                <h3 className="text-3xl font-bold mt-1 text-[#7b1e3a]">
                  {activeOrders}
                </h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-sm">Delivered</p>
                <h3 className="text-3xl font-bold mt-1 text-green-600">
                  {completedOrders}
                </h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your contact and default delivery details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                  />
                </div>

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
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />

                    {/* 🚀 UPDATED GOOGLE INPUT WITH STRICT BOUNDS */}
                    <ReactGoogleAutocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                      onPlaceSelected={(place) => {
                        if (place.geometry && place.geometry.location) {
                          const lat = place.geometry.location.lat();
                          const lng = place.geometry.location.lng();
                          const formattedAddress =
                            place.formatted_address || "";

                          // 🛡️ DOUBLE CHECK: Ensure "Delta" is in the address string
                          if (
                            !formattedAddress.toLowerCase().includes("delta")
                          ) {
                            toast.error(
                              "Please select an address within Delta State, Nigeria."
                            );
                            setAddress(""); // Clear input
                            return;
                          }

                          setAddress(formattedAddress);
                          setCoords({ lat, lng });
                        }
                      }}
                      options={{
                        types: ["address"],
                        componentRestrictions: { country: "ng" },
                        strictBounds: true, // 🔒 Force results to be inside bounds
                        bounds: DELTA_STATE_BOUNDS, // 🔒 The Box defined above
                      }}
                      defaultValue={address}
                      value={address}
                      onChange={(e: any) => setAddress(e.target.value)}
                      placeholder="Enter street name (e.g. Airport Road, Warri)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                    />
                  </div>

                  <div className="text-xs flex items-center gap-2 mt-1">
                    {coords ? (
                      <span className="text-green-600 flex items-center font-medium">
                        <MapPin className="h-3 w-3 mr-1" /> Location Pinned
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        No GPS location set
                      </span>
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
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 h-fit">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-gray-600 hover:text-[#7b1e3a] hover:bg-orange-50"
              >
                <Heart className="mr-3 h-5 w-5" /> Favorites
              </Button>
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
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
