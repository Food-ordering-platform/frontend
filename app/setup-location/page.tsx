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

// ================= CONSTANTS =================

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Default to Warri, Delta State
const DEFAULT_CENTER = { lat: 5.5544, lng: 5.7932 };

// Delta State bounds (bias, not strict lock)
const DELTA_STATE_BOUNDS: google.maps.LatLngBoundsLiteral = {
  north: 6.5,
  south: 4.9,
  west: 5.0,
  east: 6.8,
};

const LIBRARIES: Libraries = ["places"];

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

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState<string>("Locating...");
  const [isDragging, setIsDragging] = useState(false);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);

  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // ================= MAP LIFECYCLE =================

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

  const handleMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // ================= GEOCODING =================

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    try {
      const res = await geocoderRef.current.geocode({
        location: { lat, lng },
      });

      if (!res.results?.length) {
        setAddress("Unknown location");
        return;
      }

      const best =
        res.results.find((r) =>
          r.types.includes("street_address") ||
          r.types.includes("premise") ||
          r.types.includes("establishment")
        ) || res.results[0];

      setAddress(best.formatted_address);
    } catch {
      setAddress("Unable to fetch address");
    }
  }, []);

  // ================= GPS =================

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
        map?.setZoom(17);

        setAddress("Locating...");
        reverseGeocode(coords.lat, coords.lng);
        setIsFetchingGPS(false);
      },
      () => {
        toast.error("Unable to get location");
        setIsFetchingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Auto-fetch GPS if user has no address
  useEffect(() => {
    if (isLoaded && map && !user?.address) {
      handleUseGPS();
    }
  }, [isLoaded, map]);

  // ================= MAP INTERACTION =================

  const handleMapIdle = () => {
    if (!map || !isDragging) return;

    const c = map.getCenter();
    if (!c) return;

    setAddress("Locating...");
    reverseGeocode(c.lat(), c.lng());
    setIsDragging(false);
  };

  // ================= AUTOCOMPLETE =================

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    const finalAddress =
      place.formatted_address || place.name || "Selected location";

    setAddress(finalAddress);
    setCenter({ lat, lng });

    map?.panTo({ lat, lng });
    map?.setZoom(17);
  };

  // ================= CONFIRM =================

  const handleConfirm = async () => {
    if (!address || address === "Locating...") return;

    const c = map?.getCenter();
    const lat = c?.lat() ?? center.lat;
    const lng = c?.lng() ?? center.lng;

    try {
      await updateProfile({ address, latitude: lat, longitude: lng });
      toast.success("Location updated successfully");

      if (isModal && onComplete) onComplete();
      else router.push("/restaurants");
    } catch {
      toast.error("Failed to update location");
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-[#7b1e3a]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100",
        isModal ? "h-[600px]" : "h-screen"
      )}
    >
      {/* GOOGLE AUTOCOMPLETE STYLES */}
      <style jsx global>{`
        .pac-container {
          z-index: 10000 !important;
          pointer-events: auto !important;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: none;
          margin-top: 8px;
        }
        .pac-item {
          padding: 12px 16px;
          font-size: 15px;
          cursor: pointer;
        }
        .pac-item:hover {
          background: #f9fafb;
        }
      `}</style>

      {/* SEARCH BAR */}
      <div className="absolute top-4 inset-x-4 z-20 flex gap-2">
        {!isModal && (
          <Button
            size="icon"
            onClick={() => router.back()}
            className="bg-white text-black shadow-md"
          >
            <ArrowLeft />
          </Button>
        )}

        <div className="flex-1 h-12 bg-white rounded-lg shadow-lg flex items-center px-4">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <ReactGoogleAutocomplete
            apiKey={GOOGLE_MAPS_API_KEY}
            onPlaceSelected={handlePlaceSelected}
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "ng" },
              bounds: DELTA_STATE_BOUNDS,
              strictBounds: false,
              fields: ["formatted_address", "geometry", "name"],
            }}
            placeholder="Search delivery location"
            className="w-full h-full bg-transparent outline-none"
          />
        </div>
      </div>

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={15}
        options={MAP_OPTIONS}
        onLoad={handleMapLoad}
        onUnmount={handleMapUnmount}
        onDragStart={() => setIsDragging(true)}
        onIdle={handleMapIdle}
      />

      {/* CENTER PIN */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a]" />
      </div>

      {/* GPS BUTTON */}
      <div className="absolute top-20 right-4 z-10">
        <Button
          size="icon"
          onClick={handleUseGPS}
          className="h-12 w-12 rounded-full bg-white text-[#7b1e3a] shadow-lg"
        >
          {isFetchingGPS ? <Loader2 className="animate-spin" /> : <Crosshair />}
        </Button>
      </div>

      {/* BOTTOM CARD */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-white p-6 rounded-t-3xl shadow-xl">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">
          Confirm Delivery Location
        </p>

        <div className="flex gap-3 bg-gray-50 p-4 rounded-xl mb-4">
          <MapPin className="text-[#7b1e3a]" />
          <p className="text-sm font-semibold line-clamp-2">{address}</p>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={isPending || isDragging || address === "Locating..."}
          className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60132a]"
        >
          {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
          {address === "Locating..." ? "Locating..." : "Confirm Location"}
        </Button>
      </div>
    </div>
  );
}
