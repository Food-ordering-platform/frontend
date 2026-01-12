"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";

// Default: Warri
const DEFAULT_CENTER = { lat: 5.517, lng: 5.75 };

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  zoomControl: false,
};

export default function SetupLocationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);

  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  /* -------------------- MAP INIT -------------------- */
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    geocoderRef.current = new google.maps.Geocoder();

    mapInstance.setTilt(0);
    mapInstance.setHeading(0);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  /* -------------------- GEOCODING -------------------- */
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    try {
      const res = await geocoderRef.current.geocode({
        location: { lat, lng },
      });

      const precise =
        res.results.find(
          (r) =>
            r.geometry.location_type === "ROOFTOP" ||
            r.geometry.location_type === "RANGE_INTERPOLATED"
        ) || res.results[0];

      if (precise) setAddress(precise.formatted_address);
    } catch (err) {
      console.error(err);
    }
  }, []);

  /* -------------------- AUTO GPS ON LOAD -------------------- */
  useEffect(() => {
    if (isLoaded && !user?.address) {
      handleUseGPS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  /* -------------------- MAP MOVEMENT -------------------- */
  const handleMapIdle = () => {
    if (!map) return;

    const c = map.getCenter();
    if (!c) return;

    const lat = c.lat();
    const lng = c.lng();

    setCenter({ lat, lng });
    fetchAddress(lat, lng);
    setIsDragging(false);
  };

  /* -------------------- GPS -------------------- */
  const handleUseGPS = () => {
    setLoadingGPS(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setLoadingGPS(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setCenter(coords);
        map?.panTo(coords);
        map?.setZoom(18);
        fetchAddress(coords.lat, coords.lng);

        navigator.geolocation.clearWatch(watchId);
        setLoadingGPS(false);
      },
      () => {
        toast.error("Enable precise GPS location");
        setLoadingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  /* -------------------- SEARCH -------------------- */
  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setCenter({ lat, lng });
    setAddress(place.formatted_address || "");
    map?.panTo({ lat, lng });
    map?.setZoom(18);
  };

  /* -------------------- CONFIRM -------------------- */
  const handleConfirm = async () => {
    if (!address) {
      toast.error("Select a valid address");
      return;
    }

    try {
      await updateProfile({
        address,
        latitude: center.lat,
        longitude: center.lng,
      });

      router.push("/restaurants");
    } catch {}
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" />
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Top Search */}
      <div className="absolute top-0 inset-x-0 z-10 p-4 bg-gradient-to-b from-white/90 to-transparent">
        <div className="max-w-md mx-auto flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white shadow rounded-full h-11 w-11"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>

          <Card className="flex-1 px-4 flex items-center rounded-xl shadow bg-white">
            <ReactGoogleAutocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={handlePlaceSelected}
              options={{
                types: ["geocode", "establishment"],
                componentRestrictions: { country: "ng" },
              }}
              placeholder="Search your street"
              className="w-full h-11 bg-transparent outline-none text-sm"
            />
          </Card>
        </div>
      </div>

      {/* Map */}
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

      {/* Fixed Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20 pointer-events-none">
        <div
          className={cn(
            "transition-transform",
            isDragging && "-translate-y-3 scale-110"
          )}
        >
          <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a]" />
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-4 pb-8 bg-gradient-to-t from-white via-white/90">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-end">
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-white shadow"
              onClick={handleUseGPS}
            >
              {loadingGPS ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Navigation />
              )}
            </Button>
          </div>

          <Card className="p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex gap-2">
              <MapPin className="text-[#7b1e3a]" />
              <p className="font-semibold text-lg line-clamp-2">
                {address || "Locating..."}
              </p>
            </div>

            <Button
              className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60152b]"
              disabled={isPending || !address || isDragging}
              onClick={handleConfirm}
            >
              {isPending && <Loader2 className="mr-2 animate-spin" />}
              Confirm Location
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
