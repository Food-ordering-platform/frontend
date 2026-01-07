"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Navigation, CheckCircle, MapPin, 
  ArrowRight, ShieldCheck, Clock, Store, 
  Receipt, Loader2, Lock
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://food-ordering-app.up.railway.app/api";

export default function RiderTaskPage() {
  const params = useParams();
  const trackingId = params.trackingId as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🔒 Security Gate State
  const [isVerified, setIsVerified] = useState(false);
  const [riderName, setRiderName] = useState("");

  const fetchTask = async () => {
    try {
      const res = await axios.get(`${API_URL}/dispatch/task/${trackingId}`);
      setOrder(res.data.data);
    } catch (error) {
      toast.error("Task not found or invalid link");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingId) fetchTask();
  }, [trackingId]);

  const handlePickup = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/dispatch/task/pickup`, { trackingId });
      toast.success("Pickup Confirmed!");
      fetchTask(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (otp.length < 4) return toast.error("Enter valid 4-digit code");
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/dispatch/task/complete`, { trackingId, otp });
      toast.success("Delivery Verified!");
      setOrder((prev: any) => ({ ...prev, status: "DELIVERED" }));
    } catch (error: any) {
      toast.error("Incorrect Delivery Code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /></div>;
  if (!order) return <div className="p-10 text-center text-red-500">Task not found</div>;

  // 🔒 1. SECURITY GATEKEEPER
  if (!isVerified && order.status !== "DELIVERED") {
    return (
      <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gray-800 p-4 rounded-full mb-6 ring-4 ring-orange-500/20">
            <Lock className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Restricted Access</h1>
        <p className="text-gray-400 mb-8 max-w-xs">
            This delivery task is assigned to a specific rider. Please confirm your identity.
        </p>
        <div className="w-full max-w-xs space-y-4">
            <Input 
                placeholder="Enter Your Name" 
                className="bg-gray-800 border-gray-700 text-white h-12 text-center"
                value={riderName}
                onChange={(e) => setRiderName(e.target.value)}
            />
            <Button 
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 font-bold"
                onClick={() => {
                    if(riderName.length > 2) setIsVerified(true);
                    else toast.error("Please enter your name");
                }}
            >
                View Task Details
            </Button>
        </div>
      </div>
    );
  }

  // --- Main Render ---
  const isPickedUp = order.status === "OUT_FOR_DELIVERY";
  const isDelivered = order.status === "DELIVERED";
  
  // Use Pickup address initially, switch to Customer address after pickup
  const activeAddress = isPickedUp ? order.customer.address : order.vendor.address;
  // Simple map embed URL (No API Key needed for basic embed)
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(activeAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 2. LIVE MAP HEADER */}
      <div className="relative h-64 w-full bg-gray-200">
        <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            src={mapUrl}
            className="opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
        
        {/* Status Badge */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
                <h1 className="text-xl font-bold text-gray-900">{isPickedUp ? "Heading to Customer" : "Heading to Pickup"}</h1>
                <p className="text-xs text-gray-500 font-mono">ID: {order.id.slice(-6)} • {riderName}</p>
            </div>
            <Badge variant="secondary" className="bg-white shadow-sm border-orange-200 text-orange-700">
                {order.status.replace('_', ' ')}
            </Badge>
        </div>
      </div>

      {/* 3. TASK CARD */}
      <div className="flex-1 px-4 -mt-6 relative z-10 pb-32">
        <Card className="border-0 shadow-xl rounded-xl overflow-hidden mb-4">
            <div className="p-4 bg-white">
                {/* Pickup */}
                <div className={`flex gap-4 mb-6 ${isPickedUp ? 'opacity-40' : ''}`}>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <Store size={16} />
                        </div>
                        <div className="w-0.5 h-full bg-gray-100 my-1" />
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-xs font-bold text-gray-400 uppercase">Pickup</p>
                        <h3 className="font-bold text-gray-900">{order.vendor.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{order.vendor.address}</p>
                        {!isPickedUp && (
                            <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => window.open(`geo:0,0?q=${encodeURIComponent(order.vendor.address)}`)}>
                                <Navigation size={12} /> Navigate
                            </Button>
                        )}
                    </div>
                </div>

                {/* Dropoff */}
                <div className={`flex gap-4 ${!isPickedUp ? 'opacity-40' : ''}`}>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <MapPin size={16} />
                        </div>
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-xs font-bold text-blue-600 uppercase">Dropoff</p>
                        <h3 className="font-bold text-gray-900">{order.customer.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{order.customer.address}</p>
                        {isPickedUp && (
                            <div className="flex gap-2">
                                <Button size="sm" className="h-8 text-xs gap-2 bg-blue-600" onClick={() => window.open(`geo:0,0?q=${encodeURIComponent(order.customer.address)}`)}>
                                    <Navigation size={12} /> Navigate
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => window.open(`tel:${order.customer.phone}`)}>
                                    <Phone size={12} /> Call
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Manifest */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <Receipt size={14} /> <span className="text-xs font-bold uppercase">Items</span>
                </div>
                {order.items.map((item:any, i:number) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-gray-600"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.menuItemName}</span>
                    </div>
                ))}
            </div>
        </Card>
      </div>

      {/* 4. FLOATING ACTION FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20 pb-8">
        {!isPickedUp ? (
            <Button 
                className="w-full h-14 text-lg font-bold bg-gray-900 hover:bg-black shadow-lg"
                onClick={handlePickup}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Processing..." : "CONFIRM PICKUP"}
            </Button>
        ) : (
            <div className="flex gap-3">
                <Input 
                    className="h-14 text-center text-xl font-mono tracking-widest font-bold border-2 focus:border-green-500"
                    placeholder="CODE"
                    maxLength={4}
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <Button 
                    className="flex-1 h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg"
                    onClick={handleComplete}
                    disabled={isSubmitting}
                >
                    COMPLETE
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}