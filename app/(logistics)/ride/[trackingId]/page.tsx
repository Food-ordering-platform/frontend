"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Phone, 
  Navigation, 
  CheckCircle, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Map, 
  MoreVertical,
  Store,
  Receipt,
  Utensils
} from "lucide-react";

export default function RiderTaskPage() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- MOCK DATA ---
  const [order, setOrder] = useState({
    id: "ORD-9921",
    status: "PICKED_UP", 
    deliveryFee: 1500,
    distance: "4.2 km",
    estTime: "15 mins",
    vendor: { 
      name: "Mama Tega Kitchen", 
      address: "14 Refinery Road, Warri", 
      phone: "08012345678",
    },
    customer: { 
      name: "John Doe", 
      address: "Delta Mall, Effurun (Cinema Entrance)", 
      phone: "09012345678" 
    },
    items: [
      { name: "Jollof Rice & Chicken", quantity: 2, price: 3000 },
      { name: "Fried Plantain", quantity: 1, price: 500 },
      { name: "Coca Cola 50cl", quantity: 2, price: 400 },
    ]
  });

  const handleComplete = () => {
    if (otp.length < 4) return toast.error("Enter valid 4-digit code");
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Delivery Verified Successfully!");
      setOrder(prev => ({ ...prev, status: "DELIVERED" }));
      setIsSubmitting(false);
    }, 1500);
  };

  // --- SUCCESS STATE ---
  if (order.status === "DELIVERED") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-primary text-white p-8 text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 bg-white/20 p-6 rounded-full mb-8 backdrop-blur-md border border-white/20 shadow-2xl animate-in zoom-in duration-500">
          <CheckCircle className="h-20 w-20 text-white" />
        </div>
        
        <h1 className="relative z-10 text-4xl font-extrabold mb-2 tracking-tight">Delivery Complete!</h1>
        <p className="relative z-10 text-white/80 text-lg mb-8">Great job, Rider.</p>
        
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-xs border border-white/20">
          <p className="text-sm font-medium uppercase tracking-wider opacity-70 mb-1">Total Earnings</p>
          <p className="text-5xl font-extrabold">₦{order.deliveryFee.toLocaleString()}</p>
        </div>

        <Button 
          variant="secondary" 
          className="relative z-10 mt-12 w-full max-w-xs h-12 rounded-xl font-bold text-primary hover:bg-white/90 shadow-xl"
          onClick={() => window.location.reload()}
        >
          Find Next Order
        </Button>
      </div>
    );
  }

  // --- ACTIVE TASK STATE ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="bg-white px-5 py-4 sticky top-0 z-30 shadow-sm border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/5 rounded-full flex items-center justify-center p-2 border border-primary/10">
             <img src="/placeholder-logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">#{order.id.slice(-4)}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 leading-tight mt-0.5">Ongoing Trip</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* --- MAP PLACEHOLDER --- */}
      <div className="relative h-48 bg-gray-200 w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200">
             <Map className="h-4 w-4" /> Map View (Simulation)
           </div>
        </div>
        <svg className="absolute top-1/2 left-0 w-full h-12 stroke-primary/50 stroke-[3] fill-none stroke-dashed" viewBox="0 0 400 50">
           <path d="M0,25 Q200,50 400,25" />
        </svg>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 -mt-6 relative z-10 px-4 pb-40 overflow-y-auto">
        
        {/* --- MAIN UNIFIED CARD --- */}
        <Card className="border-0 shadow-xl shadow-gray-200/60 rounded-2xl overflow-hidden bg-white">
          
          {/* 1. Trip Summary Header */}
          <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
             <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold">{order.estTime}</span>
             </div>
             <div className="h-4 w-[1px] bg-gray-300"></div>
             <div className="flex items-center gap-2 text-gray-600">
                <Navigation className="h-4 w-4" />
                <span className="text-xs font-bold">{order.distance}</span>
             </div>
             <div className="h-4 w-[1px] bg-gray-300"></div>
             <Badge variant="outline" className="bg-white border-green-200 text-green-700 font-bold">
               ₦{order.deliveryFee} Earned
             </Badge>
          </div>

          <div className="p-6 relative">
             {/* The Connecting Route Line */}
            <div className="absolute left-[35px] top-[45px] bottom-[45px] w-0.5 bg-gray-200 bg-gradient-to-b from-gray-300 to-primary/30" />

            {/* 2. PICKUP SECTION */}
            <div className="relative flex gap-4 mb-8 group">
              <div className="relative z-10 h-8 w-8 rounded-full bg-white border-[3px] border-gray-300 shadow-sm flex items-center justify-center shrink-0">
                <Store className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pickup</p>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">Completed</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{order.vendor.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{order.vendor.address}</p>
                
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-gray-200 text-gray-600 hover:bg-gray-50" asChild>
                  <a href={`tel:${order.vendor.phone}`}>
                    <Phone className="h-3 w-3" /> Call Vendor
                  </a>
                </Button>
              </div>
            </div>

            {/* 3. DROPOFF SECTION */}
            <div className="relative flex gap-4">
              <div className="relative z-10 h-8 w-8 rounded-full bg-primary border-[3px] border-white shadow-md flex items-center justify-center shrink-0 animate-pulse">
                <MapPin className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Dropoff</p>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{order.customer.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{order.customer.address}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-10 bg-gray-900 hover:bg-black text-white border-0 shadow-md gap-2 rounded-lg" asChild>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.customer.address)}`} target="_blank">
                      <Navigation className="h-3.5 w-3.5" /> Navigate
                    </a>
                  </Button>
                  <Button variant="outline" className="h-10 border-gray-200 gap-2 rounded-lg" asChild>
                    <a href={`tel:${order.customer.phone}`}>
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. MANIFEST SECTION (Inside the same card) */}
          <div className="bg-gray-50/80 border-t border-dashed border-gray-300 p-4">
             <div className="flex items-center gap-2 mb-3">
               <Receipt className="h-4 w-4 text-gray-500" />
               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Manifest</span>
             </div>
             
             <div className="space-y-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start text-sm">
                     <div className="flex items-start gap-2">
                        <span className="font-bold text-gray-900 min-w-[20px]">{item.quantity}x</span>
                        <span className="text-gray-700 font-medium leading-tight">{item.name}</span>
                     </div>
                  </div>
                ))}
             </div>
             
             <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-gray-400 font-medium">
                <Utensils className="h-3 w-3" />
                <span>Verify items at pickup</span>
             </div>
          </div>
        </Card>

        {/* Security Tip */}
        <div className="mt-6 mx-auto max-w-sm text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100">
             <ShieldCheck className="h-3 w-3" />
             <span>Verify 4-digit code before releasing package</span>
           </div>
        </div>
      </div>

      {/* --- BOTTOM ACTION SHEET --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 pt-2 z-40 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.1)] rounded-t-[24px]">
        {/* Drawer Handle */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 mt-2"></div>

        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-end mb-3 px-1">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verification Code</label>
             <span className="text-[10px] text-primary font-bold bg-primary/5 px-2 py-1 rounded">Required</span>
          </div>
          
          <div className="flex gap-3 h-14">
            <Input 
              placeholder="----" 
              className="h-full w-28 text-center font-mono text-2xl font-bold tracking-[0.3em] border-2 border-gray-100 focus-visible:ring-primary focus-visible:border-primary bg-gray-50 rounded-xl transition-all" 
              maxLength={4}
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button 
              className="h-full flex-1 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
              onClick={handleComplete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> 
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  COMPLETE <ArrowRight className="h-5 w-5 opacity-60" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}