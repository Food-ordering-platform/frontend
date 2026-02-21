"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Libraries } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const DEFAULT_CENTER = { lat: 5.5544, lng: 5.7932 };

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

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("Locating...");
  const [placeName, setPlaceName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const fetchAddress = useCallback((lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress("Unknown location");
      }
    });
  }, []);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapRef.current = mapInstance;

    geocoderRef.current = new google.maps.Geocoder();

    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ["geometry", "formatted_address", "name"],
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        const coords = { lat, lng };

        setCenter(coords);
        mapInstance.panTo(coords);
        mapInstance.setZoom(18);

        setPlaceName(place.name || "");
        setAddress(place.formatted_address || "");
      });
    }
  }, []);

  const handleMapUnmount = () => {
    setMap(null);
    mapRef.current = null;
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleIdle = () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();

    if (!center) return;

    fetchAddress(center.lat(), center.lng());
    setIsDragging(false);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
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

        map?.panTo(coords);
        map?.setZoom(18);

        fetchAddress(coords.lat, coords.lng);

        setIsFetchingGPS(false);
      },
      () => {
        toast.error("Unable to fetch location");
        setIsFetchingGPS(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleConfirm = async () => {
    const c = map?.getCenter();

    if (!c) return;

    const lat = c.lat();
    const lng = c.lng();

    const finalAddress = placeName ? `${placeName}, ${address}` : address;

    try {
      await updateProfile({
        address: finalAddress,
        latitude: lat,
        longitude: lng,
      });

      toast.success("Location saved");

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
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[#7b1e3a]" />
      </div>
    );
  }

  return (
    <div className={cn("relative w-full flex flex-col", isModal ? "h-full" : "h-[100dvh]")}>
      
      {/* Search */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6">
        <div className="flex gap-3 items-center">

          {!isModal && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => router.back()}
              className="h-12 w-12 rounded-full bg-white shadow"
            >
              <ArrowLeft />
            </Button>
          )}

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-400" />
            <input
              ref={searchInputRef}
              placeholder="Search location..."
              className="w-full h-12 pl-12 pr-4 rounded-full border"
            />
          </div>
        </div>
      </div>

      {/* Map */}
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

      {/* Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <MapPin className="text-[#7b1e3a] fill-[#7b1e3a] h-10 w-10" />
      </div>

      {/* GPS */}
      <div className="absolute bottom-28 right-4">
        <Button
          size="icon"
          onClick={handleUseGPS}
          className="h-12 w-12 rounded-full bg-white text-[#7b1e3a]"
        >
          {isFetchingGPS ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Crosshair />
          )}
        </Button>
      </div>

      {/* Confirm */}
      <div className="bg-white p-6 rounded-t-3xl shadow-lg">
        <p className="text-sm text-gray-600 mb-2">Confirm Location</p>

        <div className="flex gap-3 mb-4">
          <MapPin className="text-[#7b1e3a]" />

          <div>
            {placeName && (
              <p className="font-bold">{placeName}</p>
            )}
            <p className="text-sm text-gray-600">{address}</p>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={isPending || isDragging}
          className="w-full h-12 bg-[#7b1e3a]"
        >
          {isPending && <Loader2 className="animate-spin mr-2" />}
          Confirm Location
        </Button>
      </div>
    </div>
  );
}