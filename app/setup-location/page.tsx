// food-ordering-platform/frontend/frontend-wip-staging/app/setup-location/page.tsx

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Libraries } from "@react-google-maps/api";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";

// 🟢 CHANGED: Default Center to Warri, Delta State
const DEFAULT_CENTER = { lat: 5.5544, lng: 5.7932 }; 
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// 🟢 ADDED: Boundaries for Delta State (Approximate Rect)
const DELTA_STATE_BOUNDS = {
  north: 6.5, // Top Latitude
  south: 4.9, // Bottom Latitude
  west: 5.0,  // Left Longitude
  east: 6.8,  // Right Longitude
};

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  zoomControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  // 🟢 ADDED: Restrict map movement roughly to this area if desired (optional)
  restriction: {
    latLngBounds: DELTA_STATE_BOUNDS,
    strictBounds: false, // Allow some scrolling out, but bias view
  }
};

const LIBRARIES: Libraries = ["places"];

interface SetupLocationProps {
  isModal?: boolean;
  onComplete?: () => void;
}

export default function SetupLocationPage({ isModal = false, onComplete }: SetupLocationProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("Locating...");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (!geocoderRef.current) return;
    try {
      const res = await geocoderRef.current.geocode({ location: { lat, lng } });
      if (res.results?.length) {
        const bestResult = res.results.find((r) => 
            r.types.includes("street_address") || 
            r.types.includes("establishment") ||
            r.types.includes("point_of_interest")
        ) || res.results[0];
        setAddress(bestResult.formatted_address);
      } else {
        setAddress("Unknown location");
      }
    } catch (err) {
      setAddress("Unable to get address");
    }
  }, []);

  const handleUseGPS = async () => {
    setIsLoadingLocation(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      setIsLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCenter(coords); 
        map?.panTo(coords);
        map?.setZoom(17);
        setAddress("Locating...");
        fetchAddress(coords.lat, coords.lng);
        setIsLoadingLocation(false);
      },
      (error) => {
        toast.error("Location unavailable");
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (isLoaded && map && !user?.address) handleUseGPS(); 
  }, [isLoaded, map]); 

  const handleMapIdle = () => {
    if (!map) return;
    const newCenter = map.getCenter();
    if (!newCenter) return;
    
    if(isDragging) {
        setAddress("Locating...");
        fetchAddress(newCenter.lat(), newCenter.lng());
        setIsDragging(false);
    }
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    if (place.formatted_address) setAddress(place.formatted_address);
    setCenter({ lat, lng });
    map?.panTo({ lat, lng });
    map?.setZoom(17);
  };

  const handleConfirm = async () => {
    if (!address || address === "Locating...") return;
    const currentCenter = map?.getCenter();
    const finalLat = currentCenter?.lat() || center.lat;
    const finalLng = currentCenter?.lng() || center.lng;

    try {
      await updateProfile({ address, latitude: finalLat, longitude: finalLng });
      toast.success("Location updated!");
      if (isModal && onComplete) {
        onComplete();
      } else {
        router.push("/restaurants");
      }
    } catch {
      toast.error("Failed to update location");
    }
  };

  if (!isLoaded) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-[#7b1e3a]" /></div>;

  return (
    <div className={cn("relative overflow-hidden bg-gray-100", isModal ? "h-[600px] w-full" : "h-screen w-full")}>
      
      {/* 🟢 CUSTOM STYLES FOR DROPDOWN (PAC CONTAINER) */}
      <style jsx global>{`
        .pac-container {
            z-index: 10000 !important; /* Ensure high z-index over modals/overlays */
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            border: none;
            font-family: inherit;
            margin-top: 8px;
        }
        .pac-item {
            padding: 12px 16px; /* Larger click area */
            font-size: 15px; /* Readable text */
            cursor: pointer;
            border-top: 1px solid #f3f4f6;
            line-height: 1.5;
        }
        .pac-item:first-child {
            border-top: none;
        }
        .pac-item:hover {
            background-color: #f9fafb;
        }
        .pac-item-query {
            font-size: 15px;
            color: #111827;
            font-weight: 600;
        }
        .pac-icon {
            margin-top: 4px; /* Align icon */
        }
      `}</style>

      {/* SEARCH BAR */}
      <div className="absolute top-4 inset-x-4 z-20 flex gap-2">
        {!isModal && (
            <Button onClick={() => router.back()} size="icon" className="bg-white text-black hover:bg-gray-100 shadow-md shrink-0">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        )}
        <div className="flex-1 h-12 bg-white rounded-lg shadow-lg flex items-center px-4 border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-[#7b1e3a]/20">
            <Search className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
            <ReactGoogleAutocomplete
              apiKey={GOOGLE_MAPS_API_KEY}
              onPlaceSelected={handlePlaceSelected}
              options={{ 
                types: ["establishment", "geocode"], 
                componentRestrictions: { country: "ng" },
                // 🟢 ADDED: Strict Bounds for Delta State
                bounds: DELTA_STATE_BOUNDS,
                strictBounds: true, 
                fields: ["formatted_address", "geometry", "name"]
              }}
              placeholder="Search area (Delta State)..."
              className="w-full h-full bg-transparent outline-none text-base placeholder:text-gray-400"
            />
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragStart={() => setIsDragging(true)}
        onIdle={handleMapIdle}
        options={MAP_OPTIONS}
      />

      {/* CENTER PIN */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none pb-[40px]">
        <div className={cn("flex flex-col items-center transition-transform", isDragging && "-translate-y-3 scale-110")}>
          <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a] drop-shadow-xl" />
          <div className="w-2.5 h-1.5 bg-black/20 rounded-full mt-1 blur-[1px]" />
        </div>
      </div>

      {/* 🟢 CHANGED: GPS BUTTON POSITION 
         Moved to TOP-RIGHT (below search bar) to prevent occlusion by the bottom card on mobile.
         Added 'top-20' (roughly 80px from top) to sit nicely under the search input.
      */}
      <div className="absolute top-20 right-4 z-10">
        <Button onClick={handleUseGPS} size="icon" className="h-12 w-12 rounded-full bg-white text-[#7b1e3a] shadow-xl hover:bg-gray-50 border border-gray-100">
          {isLoadingLocation ? <Loader2 className="animate-spin" /> : <Crosshair className="h-6 w-6" />}
        </Button>
      </div>

      {/* BOTTOM CARD */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" /> 
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Confirm Delivery Location</p>
        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
            <MapPin className="h-5 w-5 text-[#7b1e3a] shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{address}</p>
                <p className="text-xs text-gray-500 mt-1">Adjust pin to refine precise location</p>
            </div>
        </div>
        <Button className="w-full h-12 text-base font-bold bg-[#7b1e3a] hover:bg-[#60132a] shadow-lg shadow-[#7b1e3a]/20" onClick={handleConfirm} disabled={isPending || isDragging || address === "Locating..."}>
            {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />} 
            {address === "Locating..." ? "Locating..." : "Confirm Location"}
        </Button>
      </div>
    </div>
  );
}