//
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

// Default to Warri, Delta State
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
  clickableIcons: true, // Allow clicking on POIs
  zoomControl: true, // Allow user to zoom in/out for details
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
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
  const [placeName, setPlaceName] = useState<string>(""); // Store place name separately (e.g., "KFC")
  const [isDragging, setIsDragging] = useState(false);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);

  // Refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const isInternalUpdate = useRef(false);

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
        // Try to find a specific street address first
        const preciseResult = results.find(
          (r) => r.types.includes("street_address") || r.types.includes("premise")
        ) || results[0];

        const newAddress = preciseResult.formatted_address;
        
        // If we dragged the pin, we lose the specific "Place Name" (like KFC), so we reset it
        if (!isInternalUpdate.current) {
             setPlaceName(""); 
        }

        setAddress(newAddress);
        
        // Update Search Input to reflect the pin's location
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

    // Initialize Autocomplete
    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ["geometry", "formatted_address", "name", "place_id"], // precise details
        componentRestrictions: { country: "ng" },
        bounds: DELTA_STATE_BOUNDS,
        strictBounds: false, // Allow searching slightly outside if needed
      });

      autocomplete.bindTo("bounds", mapInstance);
      autocompleteRef.current = autocomplete;

      // Handle Place Search Selection
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
          return;
        }

        isInternalUpdate.current = true; // Prevent reverse geocode from overwriting the nice name immediately
        
        // Zoom in deeply (Detailed view)
        if (place.geometry.viewport) {
          mapInstance.fitBounds(place.geometry.viewport);
        } else {
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(18); // Street level zoom
        }

        // Set detailed address
        const name = place.name || "";
        const formatted = place.formatted_address || "";
        
        // If the name is different from the address (e.g., "Shoprite" vs "123 Road"), show both
        setPlaceName(name !== formatted ? name : "");
        setAddress(formatted);
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
    isInternalUpdate.current = false;
  };

  const handleIdle = () => {
    if (!mapRef.current) return;
    
    // Only reverse geocode if user manually moved the map
    // If we just arrived via Search, 'address' is already set perfectly
    if (!isInternalUpdate.current) {
        const newCenter = mapRef.current.getCenter();
        if (newCenter) {
           fetchAddress(newCenter.lat(), newCenter.lng());
        }
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
        const coords = { lat: latitude, lng: longitude };
        setCenter(coords);
        map?.panTo(coords);
        map?.setZoom(18); // Zoom in for detail
        setIsFetchingGPS(false);
        // Let handleIdle fetch the address
      },
      (err) => {
        console.error(err);
        toast.error("Unable to access location.");
        setIsFetchingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // ================= CONFIRMATION =================

  const handleConfirm = async () => {
    if (!address || address === "Locating...") return;

    const c = map?.getCenter();
    const lat = c?.lat() ?? center.lat;
    const lng = c?.lng() ?? center.lng;

    // Combine name + address if available for better clarity
    const finalAddress = placeName ? `${placeName}, ${address}` : address;

    try {
      await updateProfile({ address: finalAddress, latitude: lat, longitude: lng });
      toast.success("Delivery location updated!");

      if (isModal && onComplete) {
        onComplete();
      } else {
        router.back();
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
        isModal ? "h-full" : "h-[100dvh]"
    )}>
      
      {/* TOP SEARCH BAR */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 pointer-events-none">
        <div className="flex gap-3 items-center pointer-events-auto">
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

            <div className="flex-1 relative shadow-lg rounded-full group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#7b1e3a]" />
                </div>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search specific places (e.g. Chicken Republic)"
                    className="w-full h-12 pl-12 pr-4 rounded-full border-none outline-none text-base bg-white placeholder:text-gray-400"
                />
            </div>
        </div>
      </div>

      {/* MAP */}
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

          {/* CENTER PIN */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center pb-[38px] z-10">
              <div className={cn("transition-transform duration-200 drop-shadow-md", isDragging ? "-translate-y-3 scale-110" : "")}>
                 <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a]" />
              </div>
              <div className="w-2.5 h-1 bg-black/20 rounded-full blur-[1px]" />
          </div>

          {/* GPS BUTTON */}
          <div className="absolute bottom-6 right-4 z-10">
             <Button
                size="icon"
                onClick={handleUseGPS}
                className="h-12 w-12 rounded-full bg-white text-[#7b1e3a] shadow-lg hover:bg-gray-50"
             >
                {isFetchingGPS ? <Loader2 className="animate-spin h-5 w-5" /> : <Crosshair className="h-6 w-6" />}
             </Button>
          </div>
      </div>

      {/* BOTTOM CONFIRM CARD */}
      <div className="bg-white p-6 pb-8 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20">
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Confirm Delivery Location
                </p>
                <div className="flex gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 items-start">
                    <MapPin className="text-[#7b1e3a] shrink-0 mt-0.5" size={20} />
                    <div className="flex flex-col">
                        {placeName && (
                            <span className="text-sm font-bold text-gray-900 block">
                                {placeName}
                            </span>
                        )}
                        <span className={cn("text-sm text-gray-700", placeName ? "mt-0.5" : "font-medium")}>
                            {address}
                        </span>
                    </div>
                </div>
            </div>

            <Button
                onClick={handleConfirm}
                disabled={isPending || isDragging || address === "Locating..."}
                className="w-full h-14 text-base font-bold bg-[#7b1e3a] hover:bg-[#60132a] rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
                {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                Confirm Location
            </Button>
        </div>
      </div>
    </div>
  );
}