"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Libraries } from "@react-google-maps/api";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";

// --- CONSTANTS ---
const DEFAULT_CENTER = { lat: 6.5244, lng: 3.3792 };
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  zoomControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

// ✅ FIX 1: Define libraries OUTSIDE the component to prevent reload loops
const LIBRARIES: Libraries = ["places"];

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

  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // --- LOAD MAP SCRIPT ---
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES, // ✅ Use the static constant
  });

  // --- MAP INIT ---
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // --- REVERSE GEOCODING ---
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    try {
      const res = await geocoderRef.current.geocode({
        location: { lat, lng },
      });

      if (res.results?.length) {
        const bestResult =
          res.results.find((r) =>
            r.types.includes("street_address") ||
            r.types.includes("premise")
          ) || res.results[0];

        setAddress(bestResult.formatted_address);
      } else {
        setAddress("Unknown location");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      // Don't show "Unable" if it's just a rate limit hiccup, keep old address if possible
      // But for now, we leave it to inform user
      setAddress("Unable to get address");
    }
  }, []);

  // --- GPS (GOOGLE MAPS STYLE) ---
  const handleUseGPS = async () => {
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

        // It is okay to setCenter HERE because this is a User Action (Click)
        setCenter(coords); 
        map?.panTo(coords);
        map?.setZoom(17);

        setAddress("Locating...");
        fetchAddress(coords.lat, coords.lng);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("GPS error:", error);
        toast.error("Location unavailable. Please check permissions.");
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // --- AUTO GPS ON LOAD ---
  useEffect(() => {
    if (isLoaded && map) {
      handleUseGPS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  // --- MAP EVENTS ---
  const handleMapDragStart = () => {
    setIsDragging(true);
  };

  const handleMapIdle = () => {
    if (!map) return;

    const newCenter = map.getCenter();
    if (!newCenter) return;

    const lat = newCenter.lat();
    const lng = newCenter.lng();

    // ✅ FIX 2: REMOVED `setCenter({ lat, lng })`
    // We do NOT update React state here. The map is already at this location.
    // Updating state here would trigger a re-render -> map reload -> onIdle -> loop.
    
    setAddress("Locating...");
    fetchAddress(lat, lng);
    setIsDragging(false);
  };

  // --- SEARCH ---
  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    if (place.formatted_address) {
      setAddress(place.formatted_address);
    }

    // It is safe to setCenter here (User Action: Search)
    setCenter({ lat, lng });
    map?.panTo({ lat, lng });
    map?.setZoom(17);
  };

  // --- CONFIRM ---
  const handleConfirm = async () => {
    if (!address || address === "Locating..." || address === "Unable to get address") {
      toast.error("Please wait for a valid location");
      return;
    }

    // ✅ FIX 3: Get the EXACT current position from the map instance
    // Since we stopped updating 'center' state on drag, we must ask the map directly.
    const currentCenter = map?.getCenter();
    const finalLat = currentCenter?.lat() || center.lat;
    const finalLng = currentCenter?.lng() || center.lng;

    try {
      await updateProfile({
        address,
        latitude: finalLat,
        longitude: finalLng,
      });

      router.push("/restaurants");
    } catch {
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

      {/* TOP SEARCH */}
      <div className="absolute top-0 inset-x-0 z-20 pt-4 px-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto flex items-center gap-3 pointer-events-auto">
          <Button
            onClick={() => router.back()}
            size="icon"
            className="h-11 w-11 rounded-full bg-white text-black shadow-md hover:bg-gray-100 border border-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1 h-11 bg-white rounded-full shadow-md flex items-center px-4 border border-gray-100">
            <ReactGoogleAutocomplete
              apiKey={GOOGLE_MAPS_API_KEY}
              onPlaceSelected={handlePlaceSelected}
              options={{
                types: ["geocode", "establishment"],
                componentRestrictions: { country: "ng" },
              }}
              placeholder="Search street, area..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* MAP */}
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

      {/* CENTER PIN */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none pb-[40px]">
        <div
          className={cn(
            "flex flex-col items-center transition-transform duration-200",
            isDragging ? "-translate-y-3 scale-110" : ""
          )}
        >
          <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a]" />
          <div className="w-2.5 h-1.5 bg-black/20 rounded-full mt-1 blur-[1px]" />
        </div>
      </div>

      {/* RECENTER */}
      <div className="absolute bottom-[280px] right-4 z-10">
        <Button
          onClick={handleUseGPS}
          size="icon"
          className="h-12 w-12 rounded-full bg-white text-[#7b1e3a] shadow-lg"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Crosshair className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* BOTTOM CARD */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-6 pb-8">
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase">
            Confirm Delivery Address
          </p>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <MapPin className="h-6 w-6 text-[#7b1e3a]" />
            <p className="text-base font-semibold text-gray-900 line-clamp-2">
              {address}
            </p>
          </div>

          <Button
            className="w-full h-14 bg-[#7b1e3a] text-white rounded-2xl"
            disabled={isPending || isDragging || !address || address === "Locating..."}
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