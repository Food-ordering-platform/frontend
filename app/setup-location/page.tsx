"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  Libraries,
  Autocomplete,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUpdateProfile } from "@/services/auth/auth.queries";
import debounce from "lodash.debounce";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const DEFAULT_CENTER = { lat: 5.5544, lng: 5.7932 };

const LIBRARIES: Libraries = ["places"];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false, // Turned off default zoom to make mobile cleaner
  clickableIcons: false,
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
  const [inputValue, setInputValue] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Debounced Reverse Geocode to reduce billing
  const fetchAddress = useCallback(
    debounce((lat: number, lng: number) => {
      if (!geocoderRef.current) {
        geocoderRef.current = new google.maps.Geocoder();
      }

      geocoderRef.current.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            setAddress(results[0].formatted_address);
            setPlaceName(""); // clear old search name when dragging
          } else {
            setAddress("Unknown location");
          }
        }
      );
    }, 500),
    []
  );

  const handleMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      mapRef.current = mapInstance;
      geocoderRef.current = new google.maps.Geocoder();
      fetchAddress(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
    },
    [fetchAddress]
  );

  // Triggered when user selects an address from the Autocomplete dropdown
  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    
    if (!place || !place.geometry?.location) {
      toast.error("Please select a valid location from the dropdown");
      return;
    }

    const coords = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    
    setCenter(coords);
    mapRef.current?.panTo(coords);
    mapRef.current?.setZoom(18);
    
    setPlaceName(place.name || "");
    setAddress(place.formatted_address || "");
    setInputValue(place.name || place.formatted_address || "");
  };

  const handleDragStart = () => setIsDragging(true);

  const handleIdle = () => {
    if (!mapRef.current) return;
    setIsDragging(false);
    const currentCenter = mapRef.current.getCenter();
    if (!currentCenter) return;
    fetchAddress(currentCenter.lat(), currentCenter.lng());
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }
    
    setIsFetchingGPS(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = { lat: coords.latitude, lng: coords.longitude };
        setCenter(location);
        mapRef.current?.panTo(location);
        mapRef.current?.setZoom(18);
        fetchAddress(location.lat, location.lng);
        setIsFetchingGPS(false);
      },
      () => {
        toast.error("Unable to fetch location. Check your device permissions.");
        setIsFetchingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirm = async () => {
    if (!mapRef.current) return;
    const mapCenter = mapRef.current.getCenter();
    if (!mapCenter) return;

    const lat = mapCenter.lat();
    const lng = mapCenter.lng();
    const finalAddress = placeName ? `${placeName}, ${address}` : address;

    try {
      await updateProfile({
        latitude: lat,
        longitude: lng,
        address: finalAddress,
      });
      toast.success("Location saved successfully!");
      if (isModal && onComplete) {
        onComplete();
      } else {
        router.back();
      }
    } catch {
      toast.error("Failed to save location");
    }
  };

  // Ensure map isn't rendered until Google script is loaded
  if (!isLoaded) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-[#7b1e3a]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-gray-50 relative overflow-hidden",
        isModal ? "h-[80vh] min-h-[500px]" : "h-[100dvh]"
      )}
    >
      {/* 🟢 TOP SEARCH BAR (Fixed absolute positioning without pointer-events-none trap) */}
      <div className="absolute top-0 left-0 right-0 z-[60] p-4 pt-6 bg-gradient-to-b from-white/80 to-transparent">
        <div className="flex gap-3 items-center w-full max-w-lg mx-auto">
          {!isModal && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => router.back()}
              className="h-14 w-14 shrink-0 rounded-full bg-white shadow-lg border-gray-100 hover:bg-gray-50"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </Button>
          )}

          <div className="flex-1 relative shadow-lg rounded-full bg-white border border-gray-100 h-14 overflow-visible">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7b1e3a]" />
            <Autocomplete
              onLoad={(autoC) => (autocompleteRef.current = autoC)}
              onPlaceChanged={handlePlaceChanged}
              options={{
                componentRestrictions: { country: "ng" },
                fields: ["geometry", "formatted_address", "name"],
              }}
              className="w-full h-full"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search street, estate, or area..."
                className="w-full h-full pl-12 pr-4 rounded-full border-none focus:ring-2 focus:ring-[#7b1e3a] focus:outline-none bg-transparent text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal text-base"
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault(); // Stop mobile keyboards from submitting
                }}
              />
            </Autocomplete>
          </div>
        </div>
      </div>

      {/* 🟢 MAP CONTAINER (min-h-0 prevents flex collapse, absolute inner forces height) */}
      <div className="flex-1 relative w-full min-h-0 z-0">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
          center={center}
          zoom={16}
          options={MAP_OPTIONS}
          onLoad={handleMapLoad}
          onUnmount={() => {
            mapRef.current = null;
          }}
          onDragStart={handleDragStart}
          onIdle={handleIdle}
        >
          {/* Static Center Pin overlayed ON TOP of the map canvas */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center justify-center">
            <MapPin
              className={cn(
                "text-[#7b1e3a] fill-[#7b1e3a] h-12 w-12 transition-transform duration-200 drop-shadow-lg",
                isDragging ? "-translate-y-4 scale-110" : "translate-y-0"
              )}
            />
            {/* Tiny shadow dot for exact centering */}
            <div className="w-2 h-1 bg-black/30 rounded-[100%] blur-[1px] mt-1" />
          </div>

          {/* Floating GPS Button */}
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
        </GoogleMap>
      </div>

      {/* 🟢 BOTTOM CONFIRMATION SHEET */}
      <div className="bg-white p-6 rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.1)] z-20 relative -mt-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />
        
        <p className="text-xs font-bold text-[#7b1e3a] uppercase tracking-widest mb-4">
          Delivery Location
        </p>

        <div className="flex gap-4 mb-6 items-start">
          <div className="mt-1 bg-[#7b1e3a]/10 p-3 rounded-full shrink-0">
            <MapPin className="text-[#7b1e3a] h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            {placeName && !isDragging && (
              <p className="font-extrabold text-gray-900 text-lg leading-tight truncate">
                {placeName}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
              {isDragging ? "Moving map to find address..." : address}
            </p>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={isPending || isDragging || address === "Locating..."}
          className="w-full h-14 bg-[#7b1e3a] hover:bg-[#5e162c] text-white text-lg font-bold rounded-xl shadow-lg shadow-[#7b1e3a]/20 transition-all active:scale-[0.98]"
        >
          {isPending && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
          {isDragging ? "Drop pin to confirm" : "Confirm Location"}
        </Button>
      </div>
    </div>
  );
}