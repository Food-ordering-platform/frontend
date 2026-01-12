"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair } from "lucide-react"; // Using Crosshair for 'locate' icon
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";

// --- CONSTANTS ---
const DEFAULT_CENTER = { lat: 6.5244, lng: 3.3792 }; // Default to Lagos (matching your RN version)
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true, // Hides default Google controls
  clickableIcons: false,
  zoomControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

export default function SetupLocationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  // --- STATE ---
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("Locating...");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Ref for Geocoder to prevent re-instantiation
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // --- LOAD MAP SCRIPT ---
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // --- 1. INITIALIZE MAP ---
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // --- 2. GEOCODING (Reverse Geocode) ---
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    try {
      const res = await geocoderRef.current.geocode({
        location: { lat, lng },
      });

      // Logic to find the most relevant address (similar to RN results[0])
      if (res.results && res.results.length > 0) {
        setAddress(res.results[0].formatted_address);
      } else {
        setAddress("Unknown Location");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  }, []);

  // --- 3. AUTO GPS ON MOUNT ---
  // Matches RN: useEffect(() => { ...Location.getCurrentPositionAsync... }, [])
  useEffect(() => {
    if (isLoaded) {
      handleUseGPS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // --- 4. MAP EVENTS ---
  const handleMapDragStart = () => {
    setIsDragging(true);
  };

  const handleMapIdle = () => {
    if (!map) return;

    // Get the new center coordinates
    const newCenter = map.getCenter();
    if (!newCenter) return;

    const lat = newCenter.lat();
    const lng = newCenter.lng();

    setCenter({ lat, lng });
    
    // Only fetch address if we are done dragging
    fetchAddress(lat, lng);
    setIsDragging(false);
  };

  // --- 5. SEARCH HANDLER ---
  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    // Optimistic update: Set address immediately from search result (Matches RN behavior)
    if (place.formatted_address) {
      setAddress(place.formatted_address);
    }

    setCenter({ lat, lng });
    map?.panTo({ lat, lng });
    map?.setZoom(17); // equivalent to delta zoom
  };

  // --- 6. GPS HANDLER ---
  const handleUseGPS = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(coords);
        map?.panTo(coords);
        map?.setZoom(17);
        fetchAddress(coords.lat, coords.lng);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        // Only show error if user explicitly clicked the button, 
        // silently fail on auto-load to avoid spamming toast
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // --- 7. CONFIRMATION ---
  const handleConfirm = async () => {
    if (!address || address === "Locating...") {
      toast.error("Please wait for the location to be identified");
      return;
    }

    try {
      await updateProfile({
        address,
        latitude: center.lat,
        longitude: center.lng,
      });

      // Navigate based on your flow
      router.push("/restaurants"); 
    } catch (error) {
      toast.error("Failed to update location");
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-100">
      
      {/* --- TOP SEARCH BAR (Overlay) --- */}
      <div className="absolute top-0 inset-x-0 z-20 pt-4 px-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto flex items-center gap-3 pointer-events-auto">
          {/* Back Button */}
          <Button
            onClick={() => router.back()}
            size="icon"
            className="h-11 w-11 rounded-full bg-white text-black shadow-md hover:bg-gray-100 border border-gray-100 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Search Input */}
          <div className="flex-1 h-11 bg-white rounded-full shadow-md flex items-center px-4 border border-gray-100">
            <ReactGoogleAutocomplete
              apiKey={GOOGLE_MAPS_API_KEY}
              onPlaceSelected={handlePlaceSelected}
              options={{
                types: ["geocode", "establishment"],
                componentRestrictions: { country: "ng" }, // Limit to Nigeria
              }}
              placeholder="Search street, area..."
              className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* --- MAP --- */}
      <div className="absolute inset-0 z-0">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onDragStart={handleMapDragStart}
          onIdle={handleMapIdle}
          options={MAP_OPTIONS}
        />
      </div>

      {/* --- CENTER PIN --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none pb-[40px]">
        <div className={cn(
          "flex flex-col items-center justify-center transition-transform duration-200",
          isDragging ? "-translate-y-3 scale-110" : ""
        )}>
           {/* Pin Icon */}
          <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a] drop-shadow-lg" />
          {/* Shadow dot */}
          <div className="w-2.5 h-1.5 bg-black/20 rounded-full mt-1 blur-[1px]" />
        </div>
      </div>

      {/* --- RE-CENTER BUTTON --- */}
      <div className="absolute bottom-[280px] md:bottom-[240px] right-4 z-10">
        <Button
          onClick={handleUseGPS}
          size="icon"
          className="h-12 w-12 rounded-full bg-white text-[#7b1e3a] shadow-lg hover:bg-gray-50"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Crosshair className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* --- BOTTOM CARD --- */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-6 pb-8 animate-in slide-in-from-bottom duration-300">
        <div className="max-w-md mx-auto space-y-4">
          
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Confirm Delivery Address
          </p>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <MapPin className="h-6 w-6 text-[#7b1e3a] shrink-0" />
            <p className="text-base font-semibold text-gray-900 line-clamp-2">
              {address}
            </p>
          </div>

          <Button
            className="w-full h-14 bg-[#7b1e3a] hover:bg-[#60152b] text-white text-base font-bold rounded-2xl shadow-md"
            disabled={isPending || isDragging || !address}
            onClick={handleConfirm}
          >
            {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Confirm Location
          </Button>

        </div>
      </div>

    </div>
  );
}