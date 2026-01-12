"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  MapPin, 
  Phone, 
  Bike, 
  PackageCheck, 
  User, 
  LockKeyhole, 
  ShoppingBag, 
  Navigation,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useRiderTask } from "../../../../services/dispatch/dispatch.queries";
import { cn } from "@/lib/utils";

export default function RiderTaskPage() {
  const params = useParams();
  const trackingId = params?.trackingId as string;

  const { 
    task, 
    isLoading, 
    isError,
    claimOrder, 
    pickupOrder, 
    completeOrder, 
    isActionLoading 
  } = useRiderTask(trackingId);

  const [riderName, setRiderName] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  // 🔐 SECURITY STATE
  const [isMyClaim, setIsMyClaim] = useState(false);
  const [checkingIdentity, setCheckingIdentity] = useState(true);

  // 1. CHECK "RECEIPT" ON LOAD
  useEffect(() => {
    if (typeof window !== 'undefined' && trackingId) {
        const receipt = localStorage.getItem(`claimed_${trackingId}`);
        if (receipt === 'true') {
            setIsMyClaim(true);
        }
        setCheckingIdentity(false);
    }
  }, [trackingId]);

  // --- HANDLERS ---

  const handleClaimOrder = async () => {
    if (!riderName || !riderPhone) return toast.error("Enter your details");
    
    try {
        await claimOrder({ trackingId, name: riderName, phone: riderPhone });
        localStorage.setItem(`claimed_${trackingId}`, 'true'); 
        setIsMyClaim(true);
    } catch (e) {
        // Toast handled in hook
    }
  };

  const handlePickup = async () => await pickupOrder();

  const handleComplete = async () => {
    if (!otp || otp.length < 4) return toast.error("Enter valid code");
    await completeOrder(otp);
  };

  // 🚀 Open Google Maps Navigation
  const openNavigation = (lat: number, lng: number) => {
    if (!lat || !lng) {
      toast.error("Location coordinates missing");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  // --- RENDER HELPERS ---

  const getStatusColor = (status: string) => {
    switch(status) {
        case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
        case "OUT_FOR_DELIVERY": return "bg-blue-100 text-blue-700 border-blue-200";
        case "READY_FOR_PICKUP": return "bg-orange-100 text-orange-700 border-orange-200";
        default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // --- LOADING STATE ---
  if (isLoading || checkingIdentity) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="h-10 w-10 animate-spin text-[#7b1e3a] mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Locating Order...</p>
        </div>
    );
  }

  // --- ERROR STATE ---
  if (isError || !task) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <LockKeyhole className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
            <p className="text-gray-500 max-w-xs">This tracking link is invalid or has expired.</p>
        </div>
    );
  }

  // 🛑 CASE 1: ORDER ALREADY CLAIMED BY SOMEONE ELSE
  if (task.riderName && !isMyClaim) {
      return (
        <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <LockKeyhole size={48} className="text-gray-400" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-4">Order Taken</h1>
            <p className="text-gray-500 mb-8 max-w-xs text-lg">
                This delivery is being handled by <span className="font-bold text-gray-900">{task.riderName}</span>.
            </p>
            <Button variant="outline" className="border-[#7b1e3a] text-[#7b1e3a] hover:bg-[#7b1e3a]/5 h-12 px-8 rounded-full" onClick={() => window.location.reload()}>
                Refresh Status
            </Button>
        </div>
      );
  }

  // 📝 CASE 2: NEW ORDER -> CLAIM FORM
  if (!task.riderName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#7b1e3a] to-[#5a162b] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
            {/* Header branding */}
            <div className="text-center mb-8">
                <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Bike className="h-8 w-8 text-white" />
                </div>
                <h1 className="font-playfair text-3xl font-bold text-white mb-2">New Delivery Request</h1>
                <p className="text-white/80">Earn money by delivering this order</p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Earning</p>
                        <p className="text-2xl font-bold text-[#7b1e3a]">₦{task.deliveryFee || "1,500"}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Distance</p>
                         <p className="text-lg font-semibold text-gray-900">{task.distance || "2.4"} km</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Your Name</label>
                        <Input 
                            value={riderName} 
                            onChange={(e) => setRiderName(e.target.value)} 
                            placeholder="e.g. Musa Ibrahim" 
                            className="h-14 text-lg rounded-xl bg-gray-50 border-gray-200 focus:ring-[#7b1e3a]" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                        <Input 
                            value={riderPhone} 
                            onChange={(e) => setRiderPhone(e.target.value)} 
                            placeholder="080..." 
                            type="tel" 
                            className="h-14 text-lg rounded-xl bg-gray-50 border-gray-200 focus:ring-[#7b1e3a]" 
                        />
                    </div>
                    
                    <Button
                        className="w-full h-14 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold text-lg rounded-xl mt-4 shadow-lg shadow-[#7b1e3a]/20 transition-all active:scale-[0.98]"
                        onClick={handleClaimOrder}
                        disabled={isActionLoading}
                    >
                        {isActionLoading ? <Loader2 className="animate-spin mr-2" /> : "Accept Delivery"}
                    </Button>
                </div>
            </div>
            
            <p className="text-center text-white/40 text-xs mt-8">Powered by ChowEazy Logistics</p>
        </div>
      </div>
    );
  }

  // 🗺️ CASE 3: ACTIVE JOB -> DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-[#7b1e3a] pt-8 pb-20 px-6 rounded-b-[40px] shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="font-playfair text-3xl font-bold text-white mb-1">Current Job</h1>
                    <div className="flex items-center gap-2 text-white/80">
                        <Clock size={14} />
                        <span className="text-sm font-medium">Est. time: 25 mins</span>
                    </div>
                </div>
                <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white font-bold">
                    {task.riderName.charAt(0)}
                </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {task.status.replace(/_/g, " ")}
            </div>
        </div>
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="flex-1 px-4 -mt-12 pb-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-0 overflow-hidden border border-gray-100/50">
            
            {/* ROUTE VISUALIZATION */}
            <div className="p-6 relative">
                {/* The vertical line connecting dots */}
                <div className="absolute left-[39px] top-[48px] bottom-[48px] w-0.5 bg-gray-200" />

                {/* PICKUP */}
                <div className="flex gap-4 mb-8 relative">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center flex-shrink-0 z-10 bg-white">
                        <Bike size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-orange-600 uppercase mb-1 tracking-wide">Pickup Point</p>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{task.vendor.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.vendor.address}</p>
                            </div>
                            <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-10 w-10 rounded-full border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shrink-0"
                                onClick={() => openNavigation(task.vendor.latitude, task.vendor.longitude)}
                            >
                                <Navigation size={18} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ITEMS */}
                {task.items && task.items.length > 0 && (
                    <div className="ml-14 mb-8 bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200/50">
                            <ShoppingBag size={14} className="text-gray-400" />
                            <p className="text-xs font-bold text-gray-400 uppercase">Order Details</p>
                        </div>
                        <ul className="space-y-3">
                            {task.items.map((item: any, index: number) => (
                            <li key={index} className="flex items-start text-sm">
                                <span className="font-bold text-[#7b1e3a] bg-[#7b1e3a]/10 px-2 py-0.5 rounded text-xs mr-3 self-center">
                                    {item.quantity}x
                                </span>
                                <span className="text-gray-700 font-medium">{item.menuItemName}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* DROP OFF */}
                <div className="flex gap-4 relative">
                    <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center flex-shrink-0 z-10 bg-white">
                        <MapPin size={18} className="text-[#7b1e3a]" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-[#7b1e3a] uppercase mb-1 tracking-wide">Dropoff Point</p>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{task.customer.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.deliveryAddress}</p>
                            </div>
                            <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-10 w-10 rounded-full border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shrink-0"
                                onClick={() => openNavigation(task.deliveryLatitude, task.deliveryLongitude)}
                            >
                                <Navigation size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="bg-gray-50 p-6 border-t border-gray-100 space-y-4">
                {/* Contact Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Button 
                        variant="outline" 
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium rounded-xl"
                        onClick={() => window.open(`tel:${task.vendor.phone}`)}
                    >
                        <Phone className="mr-2 h-4 w-4" /> Vendor
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium rounded-xl"
                        onClick={() => window.open(`tel:${task.customer.phone}`)}
                    >
                        <Phone className="mr-2 h-4 w-4" /> Customer
                    </Button>
                </div>

                {/* Primary Action Button */}
                <div>
                    {task.status === "READY_FOR_PICKUP" && (
                        <Button
                            className="w-full h-14 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#7b1e3a]/20 transition-all active:scale-[0.98]"
                            onClick={handlePickup}
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center">Confirm Pickup <ArrowRight className="ml-2 h-5 w-5" /></span>
                            )}
                        </Button>
                    )}

                    {task.status === "OUT_FOR_DELIVERY" && !showOtpInput && (
                        <Button
                            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-[0.98]"
                            onClick={() => setShowOtpInput(true)}
                        >
                            <PackageCheck className="mr-2" /> Complete Delivery
                        </Button>
                    )}

                    {showOtpInput && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                            <p className="text-center text-sm text-gray-500 mb-2">Ask customer for the 4-digit code</p>
                            <div className="flex gap-3">
                                <Input
                                    placeholder="0 - 0 - 0 - 0"
                                    className="text-center font-bold h-14 text-2xl tracking-[0.5em] rounded-xl border-2 border-green-100 focus:border-green-500 focus:ring-green-200"
                                    maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <Button
                                    className="bg-green-600 hover:bg-green-700 h-14 w-32 font-bold text-lg rounded-xl shadow-md"
                                    onClick={handleComplete}
                                    disabled={isActionLoading}
                                >
                                    Verify
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {task.status === "DELIVERED" && (
                        <div className="p-4 bg-green-50 text-green-700 text-center rounded-xl font-bold border border-green-200 flex items-center justify-center gap-2">
                            <CheckCircle2 size={20} />
                            Job Completed Successfully
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Help Link */}
        <p className="text-center text-gray-400 text-sm mt-6 cursor-pointer hover:text-[#7b1e3a] transition-colors">
            Having trouble? Contact Support
        </p>
      </div>
    </div>
  );
}