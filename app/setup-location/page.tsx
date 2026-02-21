"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Libraries, Autocomplete } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
// Removed unused useAuth import
import { useUpdateProfile } from "@/services/auth/auth.queries";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const DEFAULT_CENTER = { lat: 5.5544, lng: 5.7932 };

// Extracted outside component to prevent infinite re-renders
const LIBRARIES: Libraries = ["places"];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: true,
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
      } else {
        setAddress("Unknown location");
      }
    });
  }, []);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

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
      () => {
        toast.error("Unable to fetch your location. Please check permissions.");
        setIsFetchingGPS(false);
      },
      { enableHighAccuracy: true }
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
    <div className={cn("flex flex-col w-full bg-gray-50", isModal ? "h-full" : "h-[100dvh]")}>
      
      {/* Search Bar Container */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 pointer-events-none">
        <div className="flex gap-3 items-center pointer-events-auto">
          {!isModal && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => router.back()}
              className="h-12 w-12 rounded-full bg-white shadow-md hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="flex-1 relative shadow-md rounded-full bg-white">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 z-10" />
            <Autocomplete
              onLoad={(autoC) => (autocompleteRef.current = autoC)}
              onPlaceChanged={handlePlaceChanged}
              options={{ fields: ["geometry", "formatted_address", "name"] }}
            >
              <input
                type="text"
                placeholder="Search for a location..."
                className="w-full h-12 pl-12 pr-4 rounded-full border-none focus:ring-2 focus:ring-[#7b1e3a] outline-none"
              />
            </Autocomplete>
          </div>
        </div>
      </div>

      {/* Map Container - Flex 1 takes all available space above the bottom sheet */}
      <div className="flex-1 relative w-full">
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

        {/* Center Pin - pointer-events-none ensures map drag works even if touching the pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-lg">
          {/* pb-5 shifts the pin up slightly so the exact bottom tip points to the center */}
          <MapPin className="text-[#7b1e3a] fill-[#7b1e3a] h-10 w-10 pb-2" />
        </div>

        {/* GPS Button */}
        <div className="absolute bottom-6 right-4">
          <Button
            size="icon"
            onClick={handleUseGPS}
            className="h-12 w-12 rounded-full bg-white text-[#7b1e3a] shadow-lg hover:bg-gray-50"
          >
            {isFetchingGPS ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Crosshair className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Bottom Confirmation Sheet */}
      <div className="bg-white p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Confirm Location
        </p>

        <div className="flex gap-4 mb-6 items-start">
          <div className="mt-1 bg-red-50 p-2 rounded-full">
            <MapPin className="text-[#7b1e3a] h-5 w-5" />
          </div>
          <div className="flex-1">
            {placeName && (
              <p className="font-bold text-gray-900 text-lg leading-tight">{placeName}</p>
            )}
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-snug">
              {isDragging ? "Moving map..." : address}
            </p>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={isPending || isDragging}
          className="w-full h-12 bg-[#7b1e3a] hover:bg-[#5e162c] text-white text-lg font-medium transition-all"
        >
          {isPending && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
          {isDragging ? "Drop pin to confirm" : "Confirm Location"}
        </Button>
      </div>
    </div>
  );
}