"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Libraries } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";

// ================= CONSTANTS =================

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Default to Warri, Delta State (Matching Vendor App)
const DEFAULT_CENTER = { lat: 5.5544, lng: 5.7932 };

// Delta State bounds 
const DELTA_STATE_BOUNDS = {
  north: 6.5,
  south: 4.9,
  west: 5.0,
  east: 6.8,
};

const LIBRARIES: Libraries = ["places", "geometry"];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  zoomControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  restriction: {
    latLngBounds: DELTA_STATE_BOUNDS,
    strictBounds: false,
  },
};

// ================= TYPES =================

interface SetupLocationProps {
  isModal?: boolean;
  onComplete?: () => void;
}

// ================= COMPONENT =================

export default function SetupLocationPage({
  isModal = false,
  onComplete,
}: SetupLocationProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  // State
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState<string>("Locating...");
  const [isDragging, setIsDragging] = useState(false);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);

  // Refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const isInternalUpdate = useRef(false); // To prevent loop when map updates input

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // ================= HELPERS =================

  // 1. Fetch Address from Lat/Lng (Reverse Geocoding)
  const fetchAddress = useCallback((lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const newAddress = results[0].formatted_address;
        setAddress(newAddress);
        
        // SYNC SEARCH INPUT (Vital for UX)
        if (searchInputRef.current && !isInternalUpdate.current) {
          searchInputRef.current.value = newAddress;
        }
      } else {
        setAddress("Unknown location");
      }
    });
  }, []);

  // ================= MAP LIFECYCLE =================

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapRef.current = mapInstance;
    geocoderRef.current = new google.maps.Geocoder();

    // Initialize Autocomplete manually attached to the input ref
    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ["geometry", "formatted_address", "name"],
        componentRestrictions: { country: "ng" },
        bounds: DELTA_STATE_BOUNDS,
        strictBounds: true,
      });

      // Bind autocomplete bounds to map view
      autocomplete.bindTo("bounds", mapInstance);
      autocompleteRef.current = autocomplete;

      // Handle Place Selection
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
          // User entered name of a Place that was not suggested and pressed the Enter key, or the Place Details request failed.
          return;
        }

        isInternalUpdate.current = true; // Don't overwrite input while we move
        
        // Move Map
        if (place.geometry.viewport) {
          mapInstance.fitBounds(place.geometry.viewport);
        } else {
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(17);
        }

        setAddress(place.formatted_address || place.name || "Selected Location");
        setCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
        
        isInternalUpdate.current = false;
      });
    }
  }, []);

  const handleMapUnmount = useCallback(() => {
    setMap(null);
    mapRef.current = null;
  }, []);

  // ================= MAP EVENTS =================

  const handleDragStart = () => {
    setIsDragging(true);
    isInternalUpdate.current = false; // User is manually moving, so we should update input on stop
  };

  const handleIdle = () => {
    if (!mapRef.current) return;
    
    // Slight delay to prevent flickering
    const newCenter = mapRef.current.getCenter();
    if (newCenter) {
       // Only fetch if we are not programmatically moving from search
       fetchAddress(newCenter.lat(), newCenter.lng());
    }
    setIsDragging(false);
  };

  // ================= GPS =================

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setIsFetchingGPS(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Simple Bounds Check (Optional: Alert if outside Delta)
        if (
            latitude > DELTA_STATE_BOUNDS.north || 
            latitude < DELTA_STATE_BOUNDS.south ||
            longitude > DELTA_STATE_BOUNDS.east || 
            longitude < DELTA_STATE_BOUNDS.west
        ) {
            toast.warning("You are currently outside our service area (Delta State).");
        }

        const coords = { lat: latitude, lng: longitude };
        setCenter(coords);
        map?.panTo(coords);
        map?.setZoom(17);
        setIsFetchingGPS(false);
      },
      (err) => {
        console.error(err);
        toast.error("Unable to access location. Please check permissions.");
        setIsFetchingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Auto-trigger GPS on mount if user has no address
  useEffect(() => {
    if (isLoaded && map && !user?.address && !isModal) {
      handleUseGPS();
    }
  }, [isLoaded, map, isModal, user?.address]);

  // ================= CONFIRMATION =================

  const handleConfirm = async () => {
    if (!address || address === "Locating...") return;

    const c = map?.getCenter();
    const lat = c?.lat() ?? center.lat;
    const lng = c?.lng() ?? center.lng;

    try {
      await updateProfile({ address, latitude: lat, longitude: lng });
      toast.success("Delivery location updated!");

      if (isModal && onComplete) {
        onComplete(); // Close modal (Checkout flow)
      } else {
        router.back(); // Go back (Profile flow)
      }
    } catch {
      toast.error("Failed to save location.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-[#7b1e3a]" />
      </div>
    );
  }

  return (
    <div className={cn(
        "relative w-full overflow-hidden bg-gray-100 flex flex-col",
        isModal ? "h-full" : "h-[100dvh]" // Use dvh for mobile browsers
    )}>
      
      {/* 1. TOP BAR & SEARCH */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6">
        <div className="flex gap-3 items-center">
            {/* Back Button (Only if not modal) */}
            {!isModal && (
                <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="h-12 w-12 rounded-full bg-white border-0 shadow-lg shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            )}

            {/* Search Input */}
            <div className="flex-1 relative shadow-lg rounded-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search street, area..."
                    className="w-full h-12 pl-12 pr-4 rounded-full border-none outline-none text-base bg-white placeholder:text-gray-400"
                />
            </div>
        </div>
      </div>

      {/* 2. MAP CONTAINER */}
      <div className="flex-1 relative">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={15}
            options={MAP_OPTIONS}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
            onDragStart={handleDragStart}
            onIdle={handleIdle}
          />

          {/* 3. CENTER PIN (Floating) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center pb-[40px]">
              <div className={cn("transition-transform duration-200", isDragging ? "-translate-y-3 scale-110" : "")}>
                 <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a]" />
              </div>
              <div className="w-2.5 h-1 bg-black/20 rounded-full blur-[1px]" />
          </div>

          {/* 4. GPS BUTTON */}
          <div className="absolute bottom-6 right-4">
             <Button
                size="icon"
                onClick={handleUseGPS}
                className="h-12 w-12 rounded-full bg-white text-[#7b1e3a] shadow-lg hover:bg-gray-50"
             >
                {isFetchingGPS ? <Loader2 className="animate-spin h-5 w-5" /> : <Crosshair className="h-6 w-6" />}
             </Button>
          </div>
      </div>

      {/* 5. BOTTOM CARD */}
      <div className="bg-white p-6 pb-8 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20">
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Confirm Delivery Location
                </p>
                <div className="flex gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <MapPin className="text-[#7b1e3a] shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {address}
                    </p>
                </div>
            </div>

            <Button
                onClick={handleConfirm}
                disabled={isPending || isDragging || address === "Locating..."}
                className="w-full h-14 text-base font-bold bg-[#7b1e3a] hover:bg-[#60132a] rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
                {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                {address === "Locating..." ? "Locating..." : "Confirm Location"}
            </Button>
        </div>
      </div>
      
      {/* Global Style for Google Autocomplete Dropdown */}
      <style jsx global>{`
        .pac-container {
          z-index: 10000 !important; /* Ensure it appears above modals */
          border-radius: 0 0 12px 12px;
          margin-top: 2px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: none;
          font-family: var(--font-inter), sans-serif;
        }
        .pac-item {
          padding: 12px 16px;
          font-size: 14px;
          cursor: pointer;
          border-top: 1px solid #f3f4f6;
        }
        .pac-item:first-child {
            border-top: none;
        }
        .pac-item:hover {
          background-color: #f9fafb;
        }
        .pac-icon {
            display: none; /* Cleaner look */
        }
      `}</style>
    </div>
  );
}