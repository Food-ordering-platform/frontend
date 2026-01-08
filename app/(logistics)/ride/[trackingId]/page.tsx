"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Phone, Bike, PackageCheck, User } from "lucide-react";
import { toast } from "sonner";
import { useRiderTask } from "../../../../services/dispatch/dispatch.queries"; // Import your new hook

const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function RiderTaskPage() {
  const params = useParams();
  const trackingId = params?.trackingId as string;

  // 🚀 USE THE HOOK
  const { 
    task, 
    isLoading, 
    isError,
    claimOrder, 
    pickupOrder, 
    completeOrder, 
    isActionLoading 
  } = useRiderTask(trackingId);

  // Local UI State
  const [riderName, setRiderName] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  // 1. Check LocalStorage on Load to see if "I" am the owner
  const [isMyClaim, setIsMyClaim] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedClaim = localStorage.getItem(`claimed_${trackingId}`);
        if (storedClaim === 'true') setIsMyClaim(true);
    }
  }, [trackingId]);
  
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Calculate Route when task loads
  useEffect(() => {
    if (isLoaded && task && task.vendor && task.riderName) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: task.vendor.latitude, lng: task.vendor.longitude },
          destination: { lat: task.deliveryLatitude, lng: task.deliveryLongitude },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") setDirections(result);
        }
      );
    }
  }, [isLoaded, task]);

  // --- HANDLERS ---

  const handleClaimOrder = async () => {
    if (!riderName || !riderPhone) return toast.error("Enter your details");
    await claimOrder({ trackingId, name: riderName, phone: riderPhone });
    localStorage.setItem(`claimed_${trackingId}`, 'true')
    setIsMyClaim(true)
  };

  const handlePickup = async () => {
    await pickupOrder();
  };

  const handleComplete = async () => {
    if (!otp || otp.length < 4) return toast.error("Enter valid code");
    await completeOrder(otp);
  };

  // --- RENDER ---

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#7b1e3a]" /></div>;
  }

  if (isError || !task) {
    return <div className="h-screen flex items-center justify-center">Invalid or Expired Link</div>;
  }

  // 🛑 IDENTITY WALL (Derived from data)
  if (!task.riderName) {
    return (
      <div className="h-screen bg-[#7b1e3a] flex flex-col items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Bike size={32} className="text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Claim Delivery</h1>
          <p className="text-center text-gray-500 mb-6">Enter your details to start this job.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Your Name</label>
              <Input 
                value={riderName} 
                onChange={(e) => setRiderName(e.target.value)} 
                placeholder="e.g. Musa Ibrahim" 
                className="h-12 text-lg" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
              <Input 
                value={riderPhone} 
                onChange={(e) => setRiderPhone(e.target.value)} 
                placeholder="080..." 
                type="tel" 
                className="h-12 text-lg" 
              />
            </div>
            <Button
              className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold text-lg mt-2"
              onClick={handleClaimOrder}
              disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="animate-spin" /> : "Start Delivery"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL RIDER VIEW
  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      <div className="flex-1 relative bg-gray-200">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: task.vendor.latitude, lng: task.vendor.longitude }}
            zoom={13}
            options={MAP_OPTIONS}
          >
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{ polylineOptions: { strokeColor: "#7b1e3a", strokeWeight: 5 } }}
              />
            )}
          </GoogleMap>
        )}
      </div>

      <div className="bg-white rounded-t-3xl shadow-xl p-6 -mt-6 relative z-10 pb-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#7b1e3a]">Order #{task.id.slice(-6).toUpperCase()}</h1>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <User size={12} /> Rider: <span className="font-semibold text-gray-900">{task.riderName}</span>
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            task.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
          }`}>
            {task.status.replace(/_/g, " ")}
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
              <Bike size={14} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold">PICK UP</p>
              <p className="font-medium">{task.vendor.name}</p>
              <p className="text-sm text-gray-500">{task.vendor.address}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7b1e3a]/10 flex items-center justify-center mt-1">
              <MapPin size={14} className="text-[#7b1e3a]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold">DROP OFF</p>
              <p className="font-medium">{task.customer.name}</p>
              <p className="text-sm text-gray-500">{task.deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => window.open(`tel:${task.vendor.phone}`)}>
              <Phone className="mr-2 h-3 w-3" /> Vendor
            </Button>
            <Button variant="outline" onClick={() => window.open(`tel:${task.customer.phone}`)}>
              <Phone className="mr-2 h-3 w-3" /> Customer
            </Button>
          </div>

          {task.status === "READY_FOR_PICKUP" && (
            <Button
              className="w-full h-12 bg-[#7b1e3a] text-white font-bold"
              onClick={handlePickup}
              disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="animate-spin" /> : "Confirm Pickup"}
            </Button>
          )}

          {task.status === "OUT_FOR_DELIVERY" && !showOtpInput && (
            <Button
              className="w-full h-12 bg-green-600 text-white font-bold"
              onClick={() => setShowOtpInput(true)}
            >
              <PackageCheck className="mr-2" /> Complete Delivery
            </Button>
          )}

          {showOtpInput && (
            <div className="flex gap-2">
              <Input
                placeholder="1234"
                className="text-center font-bold"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                className="bg-green-600"
                onClick={handleComplete}
                disabled={isActionLoading}
              >
                Verify
              </Button>
            </div>
          )}
          
          {task.status === "DELIVERED" && (
            <div className="p-4 bg-green-50 text-green-700 text-center rounded-xl font-bold border border-green-200">
              ✅ Job Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}