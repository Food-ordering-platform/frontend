"use client";

import { useAuth } from "@/lib/auth-context";
import { useGetOrders } from "@/services/order/order.queries";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Heart, MapPin, User, LogOut, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  
  // Fetch orders for stats
  const { data: orders = [] } = useGetOrders(user?.id || "");

  // Derived stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => ["pending", "preparing", "out_for_delivery", "confirmed"].includes(o.status)).length;
  const completedOrders = orders.filter(o => ["delivered"].includes(o.status)).length;

  const handleLogout = () => {
    toast({
        title: "Signed Out",
        description: "See you next time!",
        variant: "default"
    });
    clearCart();
    logout();
    router.push("/");
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans">
      <Header />
      <main className="container py-8 md:py-12 flex-1 max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
           <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white shadow-xl">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-[#7b1e3a] text-white text-2xl md:text-3xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{user.name}</h1>
                    <p className="text-gray-500 font-medium">{user.email}</p>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {user.role}
                    </div>
                </div>
           </div>
           
           <Button 
                variant="outline" 
                className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 gap-2"
                onClick={handleLogout}
            >
                <LogOut className="h-4 w-4" /> Sign Out
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
            <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium text-sm">Active Orders</p>
                        <h3 className="text-3xl font-bold mt-1 text-gray-900">{activeOrders}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-xl">
                        <ShoppingBag className="h-6 w-6 text-orange-500" />
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white">
                 <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium text-sm">Favorites</p>
                        <h3 className="text-3xl font-bold mt-1 text-gray-900">0</h3>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-xl">
                        <Heart className="h-6 w-6 text-pink-500" />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Personal Info Form */}
            <Card className="md:col-span-2 shadow-sm border-gray-200">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} className="focus:ring-[#7b1e3a] focus:border-[#7b1e3a]" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue={user.email} disabled className="bg-gray-50 text-gray-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" defaultValue={user.phone || ""} placeholder="+234..." className="focus:ring-[#7b1e3a] focus:border-[#7b1e3a]" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Default Address</Label>
                            <Input id="address" placeholder="Add an address" className="focus:ring-[#7b1e3a] focus:border-[#7b1e3a]" />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <Button className="bg-[#7b1e3a] hover:bg-[#66172e] text-white">Save Changes</Button>
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
                        <MapPin className="mr-3 h-5 w-5" /> Saved Addresses
                    </Button>
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