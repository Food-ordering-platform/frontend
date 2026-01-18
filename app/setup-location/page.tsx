"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Libraries } from "@react-google-maps/api";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";

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

const LIBRARIES: Libraries = ["places"];

// 🟢 NEW: Allow props for Modal usage
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
        const bestResult = res.results.find((r) => r.types.includes("street_address")) || res.results[0];
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
    if (isLoaded && map) handleUseGPS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  const handleMapIdle = () => {
    if (!map) return;
    const newCenter = map.getCenter();
    if (!newCenter) return;
    setAddress("Locating...");
    fetchAddress(newCenter.lat(), newCenter.lng());
    setIsDragging(false);
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
      
      // 🟢 NEW: Handle modal callback OR redirect
      if (isModal && onComplete) {
        onComplete();
      } else {
        router.push("/restaurants");
      }
    } catch {
      toast.error("Failed to update location");
    }
  };

  if (!isLoaded) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className={cn("relative overflow-hidden bg-gray-100", isModal ? "h-[600px] w-full" : "h-screen w-full")}>
      
      {/* SEARCH BAR (Absolute) */}
      <div className="absolute top-4 inset-x-4 z-20 flex gap-2">
        {!isModal && (
            <Button onClick={() => router.back()} size="icon" className="bg-white text-black hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        )}
        <div className="flex-1 h-10 bg-white rounded-md shadow-md flex items-center px-4">
            <ReactGoogleAutocomplete
              apiKey={GOOGLE_MAPS_API_KEY}
              onPlaceSelected={handlePlaceSelected}
              options={{ componentRestrictions: { country: "ng" } }}
              placeholder="Search area..."
              className="w-full bg-transparent outline-none text-sm"
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
          <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a]" />
          <div className="w-2.5 h-1.5 bg-black/20 rounded-full mt-1 blur-[1px]" />
        </div>
      </div>

      {/* GPS BUTTON */}
      <div className="absolute bottom-[200px] right-4 z-10">
        <Button onClick={handleUseGPS} size="icon" className="rounded-full bg-white text-[#7b1e3a] shadow-lg">
          {isLoadingLocation ? <Loader2 className="animate-spin" /> : <Crosshair />}
        </Button>
      </div>

      {/* BOTTOM CARD */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-white p-6 shadow-lg rounded-t-2xl">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Confirm Location</p>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl mb-4">
            <MapPin className="h-5 w-5 text-[#7b1e3a]" />
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{address}</p>
        </div>
        <Button className="w-full bg-[#7b1e3a]" onClick={handleConfirm} disabled={isPending || isDragging || address === "Locating..."}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirm Location
        </Button>
      </div>
    </div>
  );
}