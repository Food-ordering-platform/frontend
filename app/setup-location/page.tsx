"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Libraries, Autocomplete } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUpdateProfile } from "@/services/auth/auth.queries";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
// Set default center to Warri, Nigeria since that's your launch base
const DEFAULT_CENTER = { lat: 5.5544, lng: 5.7932 }; 

const LIBRARIES: Libraries = ["places"];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: true,
  // Optional: Restrict map panning to Nigeria bounds
  restriction: {
    latLngBounds: {
      north: 13.89,
      south: 4.27,
      west: 2.67,
      east: 14.68,
    },
    strictBounds: false,
  },
};

interface SetupLocationProps {
  isModal?: boolean;
  onComplete?: () => void;
}

export default function SetupLocationPage({
  isModal = false,
  onComplete,
}: SetupLocationProps) {
  const router = useRouter();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("Locating...");
  const [placeName, setPlaceName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const fetchAddress = useCallback((lat: number, lng: number) => {
    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }

    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setAddress(results[0].formatted_address);
        // Clear placeName when dragging so it doesn't hold onto an old search result
        setPlaceName(""); 
      } else {
        setAddress("Unknown location");
      }
    });
  }, []);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
    geocoderRef.current = new google.maps.Geocoder();
    // Initial fetch for the default center
    fetchAddress(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
  }, [fetchAddress]);

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (!place.geometry || !place.geometry.location) {
        toast.error("Please select a valid location from the dropdown.");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const coords = { lat, lng };

      setCenter(coords);
      mapRef.current?.panTo(coords);
      mapRef.current?.setZoom(18);

      setPlaceName(place.name || "");
      setAddress(place.formatted_address || "");
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleIdle = () => {
    if (!mapRef.current) return;

    const currentCenter = mapRef.current.getCenter();
    if (!currentCenter) return;

    fetchAddress(currentCenter.lat(), currentCenter.lng());
    setIsDragging(false);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }

    setIsFetchingGPS(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setCenter(coords);
        mapRef.current?.panTo(coords);
        mapRef.current?.setZoom(18);
        fetchAddress(coords.lat, coords.lng);

        setIsFetchingGPS(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        toast.error("Unable to fetch your location. Please check permissions.");
        setIsFetchingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirm = async () => {
    const mapCenter = mapRef.current?.getCenter();
    if (!mapCenter) return;

    const lat = mapCenter.lat();
    const lng = mapCenter.lng();
    const finalAddress = placeName ? `${placeName}, ${address}` : address;

    try {
      await updateProfile({
        address: finalAddress,
        latitude: lat,
        longitude: lng,
      });

      toast.success("Location saved successfully");

      if (isModal && onComplete) {
        onComplete();
      } else {
        router.back();
      }
    } catch {
      toast.error("Failed to save location");
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-[#7b1e3a]" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col w-full bg-gray-50", isModal ? "h-[80vh] min-h-[500px]" : "h-[100dvh]")}>
      
      {/* Search Bar Container */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 pointer-events-none">
        <div className="flex gap-3 items-center pointer-events-auto">
          {!isModal && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => router.back()}
              className="h-12 w-12 shrink-0 rounded-full bg-white shadow-md hover:bg-gray-50 border-none"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
          )}

          <div className="flex-1 relative shadow-md rounded-full bg-white overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            
            <Autocomplete
              onLoad={(autoC) => (autocompleteRef.current = autoC)}
              onPlaceChanged={handlePlaceChanged}
              options={{ 
                // 🟢 RESTRICT TO NIGERIA HERE
                componentRestrictions: { country: "ng" }, 
                fields: ["geometry", "formatted_address", "name"] 
              }}
              // Add a generic wrapper style so Google's dropdown doesn't break
              className="w-full h-full" 
            >
              <input
                type="text"
                placeholder="Search for your street or area..."
                className="w-full h-12 pl-12 pr-4 rounded-full border-none focus:ring-0 focus:outline-none bg-transparent text-gray-800 font-medium placeholder:text-gray-400 placeholder:font-normal"
                // Prevent form submission on enter
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} 
              />
            </Autocomplete>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative w-full h-full">
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

        {/* Center Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-2xl z-10">
          <MapPin className={cn(
            "text-[#7b1e3a] fill-[#7b1e3a] h-12 w-12 pb-2 transition-transform duration-200",
            isDragging ? "-translate-y-4 scale-110" : ""
          )} />
          {/* A small dot under the pin to show exact center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-black/20 rounded-[100%] blur-[1px]"></div>
        </div>

        {/* GPS Button */}
        <div className="absolute bottom-6 right-4 z-10">
          <Button
            size="icon"
            onClick={handleUseGPS}
            className="h-14 w-14 rounded-full bg-white text-[#7b1e3a] shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-50 border border-gray-100"
          >
            {isFetchingGPS ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              <Crosshair className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Bottom Confirmation Sheet */}
      <div className="bg-white p-6 rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.08)] z-20 relative -mt-4">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5"></div>
        
        <p className="text-xs font-bold text-[#7b1e3a] uppercase tracking-widest mb-4">
          Delivery Address
        </p>

        <div className="flex gap-4 mb-6 items-start">
          <div className="mt-1 bg-[#7b1e3a]/10 p-2.5 rounded-full shrink-0">
            <MapPin className="text-[#7b1e3a] h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            {placeName && !isDragging && (
              <p className="font-extrabold text-gray-900 text-lg leading-tight truncate">{placeName}</p>
            )}
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
              {isDragging ? "Moving map..." : address}
            </p>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={isPending || isDragging}
          className="w-full h-14 bg-[#7b1e3a] hover:bg-[#5e162c] text-white text-lg font-bold transition-all shadow-lg shadow-[#7b1e3a]/20 rounded-xl"
        >
          {isPending && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
          {isDragging ? "Drop pin to confirm" : "Confirm Location"}
        </Button>
      </div>
    </div>
  );
}