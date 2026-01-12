"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Default: Warri, Delta State
const DEFAULT_CENTER = { lat: 5.517, lng: 5.750 }; 
const DELTA_BOUNDS = { north: 6.00, south: 5.40, east: 6.30, west: 5.60 };

// Map styles to remove default POI icons for a cleaner "Chowdeck" look
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  clickableIcons: false, 
  restriction: {
    latLngBounds: DELTA_BOUNDS,
    strictBounds: false
  }
};

export default function SetupLocationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });

  // Initialize Geocoder when map is loaded
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // 🚀 Google Maps Geocoding
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    try {
      const response = await geocoderRef.current.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        const formattedAddress = response.results[0].formatted_address;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
  }, []);

  // 🚀 Auto-detect location on mount if user has no address
  useEffect(() => {
    if (navigator.geolocation && isLoaded && !user?.address) {
      handleUseGPS();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Handle Dragging Events
  const onDragStart = () => setIsDragging(true);
  
  const onDragEnd = () => {
    setIsDragging(false);
    if (map) {
      const newCenter = map.getCenter();
      if (newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        setCenter({ lat, lng });
        fetchAddress(lat, lng);
      }
    }
  };

  const handleUseGPS = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCenter(pos);
                map?.panTo(pos);
                map?.setZoom(17);
                fetchAddress(pos.lat, pos.lng);
                setLoadingLocation(false);
            },
            (error) => {
                console.error(error);
                toast.error("Could not get your location. Please enable permissions.");
                setLoadingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    } else {
        toast.error("Geolocation is not supported by your browser");
        setLoadingLocation(false);
    }
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const pos = { lat, lng };
        
        setCenter(pos);
        setAddress(place.formatted_address || "");
        map?.panTo(pos);
        map?.setZoom(17);
    }
  };

  const handleConfirmLocation = async () => {
    if (!address) {
        toast.error("Please select a valid address");
        return;
    }
    
    try {
        await updateProfile({
            address,
            latitude: center.lat,
            longitude: center.lng
        });
        
        // Redirect to Restaurants page
        router.push("/restaurants");
    } catch (e) {
        // Error handling is done in the hook
    }
  };

  if (!isLoaded) return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" />
            <p className="text-sm font-medium text-gray-500">Loading Map...</p>
        </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden">
      {/* 1. Top Search Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-6 bg-gradient-to-b from-white/80 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()} 
                className="bg-white shadow-sm rounded-full h-11 w-11 shrink-0"
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <Card className="flex-1 shadow-lg border-0 bg-white/95 backdrop-blur rounded-xl overflow-hidden px-4 flex items-center">
                <ReactGoogleAutocomplete
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={handlePlaceSelected}
                    options={{
                        types: ["establishment", "geocode"], 
                        componentRestrictions: { country: "ng" },
                    }}
                    placeholder="Search for your street..."
                    className="w-full h-11 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-400"
                />
            </Card>
        </div>
      </div>

      {/* 2. Google Map */}
      <div className="absolute inset-0 z-0">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            options={MAP_OPTIONS}
          >
             {/* No Marker component here - we use the fixed overlay pin below */}
          </GoogleMap>
      </div>

      {/* 3. Center Fixed Pin (Chowdeck Style) */}
      <div className="absolute top-1/2 left-1/2 z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 pb-[38px]">
        <div className={cn(
            "relative transition-transform duration-200 ease-out",
            isDragging ? "-translate-y-3 scale-110" : "translate-y-0"
        )}>
            <MapPin className="h-10 w-10 text-[#7b1e3a] fill-[#7b1e3a] drop-shadow-xl" />
            {/* Small dot shadow on the floor */}
            <div className={cn(
                "absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black/20 rounded-full blur-[1px] transition-all duration-200",
                isDragging ? "w-2 opacity-50" : "w-3 opacity-100"
            )} />
        </div>
      </div>

      {/* 4. Bottom Controls & Address Card */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-8 bg-gradient-to-t from-white via-white/90 to-transparent">
        <div className="max-w-md mx-auto space-y-4">
            
            {/* GPS Button */}
            <div className="flex justify-end">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-full shadow-md bg-white border-0 hover:bg-gray-50 text-gray-700"
                    onClick={handleUseGPS}
                >
                    {loadingLocation ? <Loader2 className="h-5 w-5 animate-spin"/> : <Navigation className="h-5 w-5" />}
                </Button>
            </div>

            {/* Address Confirmation Card */}
            <Card className="w-full p-5 shadow-2xl border-0 bg-white rounded-2xl space-y-4">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Delivery Location
                    </p>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-[#7b1e3a] shrink-0 mt-0.5" />
                        <p className="text-gray-900 font-semibold text-lg leading-tight line-clamp-2">
                            {address || "Locating..."}
                        </p>
                    </div>
                </div>
                
                <Button 
                    className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold rounded-xl text-base shadow-lg shadow-[#7b1e3a]/20 transition-all active:scale-[0.98]"
                    onClick={handleConfirmLocation}
                    disabled={isPending || !address || isDragging}
                >
                    {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                    Confirm Location
                </Button>
            </Card>
        </div>
      </div>
    </div>
  );
}