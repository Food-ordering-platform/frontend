"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/services/auth/auth.queries";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Center of Warri, Delta State (Default)
const DEFAULT_CENTER = { lat: 5.517, lng: 5.750 }; 
const DELTA_BOUNDS = { north: 6.00, south: 5.40, east: 6.30, west: 5.60 };

export default function SetupLocationPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // 🚀 Helper to get address from lat/lng
  const reverseGeocode = async (lat: number, lng: number) => {
     try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await res.json();
        if (data.address) {
            // Build detailed address from specific to general
            const parts = [];
            
            if (data.address.house_number) parts.push(data.address.house_number);
            if (data.address.road) parts.push(data.address.road);
            if (data.address.neighbourhood) parts.push(data.address.neighbourhood);
            if (data.address.suburb) parts.push(data.address.suburb);
            if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
            if (data.address.state) parts.push(data.address.state);
            
            const detailedAddress = parts.length > 0 ? parts.join(", ") : data.display_name;
            setAddress(detailedAddress);
        } else if (data.display_name) {
            setAddress(data.display_name);
        }
     } catch (e) {
        console.error("Geocoding failed", e);
     }
  };

  const onDragEnd = async () => {
    if (!map) return;
    const newCenter = map.getCenter();
    if(newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        setCenter({ lat, lng });
        
        // 🚀 TRIGGER UPDATE
        await reverseGeocode(lat, lng);
    }
  };

  // 🚀 NEW: Handle map click
  const onMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCenter({ lat, lng });
      await reverseGeocode(lat, lng);
    }
  };

  const handleConfirmLocation = async () => {
    if (!address) {
        toast.error("Please select a valid address");
        return;
    }
    
    try {
        const updated = await updateProfile({
            address,
            latitude: center.lat,
            longitude: center.lng
        });
        
        if (user) {
            setUser({ ...user, ...updated.user, address, latitude: center.lat, longitude: center.lng });
        }

        toast.success("Location saved! Let's eat.");
        router.push("/restaurants");
    } catch (e) {
        toast.error("Failed to save location.");
    }
  };

  const handleUseGPS = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCenter(pos);
                map?.panTo(pos);
                await reverseGeocode(pos.lat, pos.lng);
                setLoadingLocation(false);
            },
            () => {
                toast.error("Could not get your location");
                setLoadingLocation(false);
            }
        );
    }
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#7b1e3a]" /></div>;

  return (
    <div className="h-screen w-full flex flex-col relative">
      <div className="absolute inset-0 z-0">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onDragEnd={onDragEnd}
            onClick={onMapClick}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
                restriction: {
                    latLngBounds: DELTA_BOUNDS,
                    strictBounds: false
                }
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none pb-[35px]">
                 <MapPin className="h-10 w-10 text-[#7b1e3a] drop-shadow-lg fill-current" />
            </div>
          </GoogleMap>
      </div>

      <div className="absolute top-6 left-4 right-4 z-10 flex justify-center">
        <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 backdrop-blur">
            <div className="p-4 flex gap-2">
                <ReactGoogleAutocomplete
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={(place) => {
                        if (place.geometry && place.geometry.location) {
                            const lat = place.geometry.location.lat();
                            const lng = place.geometry.location.lng();
                            setCenter({ lat, lng });
                            setAddress(place.formatted_address || "");
                            map?.panTo({ lat, lng });
                        }
                    }}
                    options={{
                        types: [], 
                        componentRestrictions: { country: "ng" },
                        strictBounds: true,
                        bounds: DELTA_BOUNDS
                    }}
                    placeholder="Search your delivery address..."
                    className="flex-1 h-11 px-4 rounded-xl bg-gray-100 border-transparent focus:bg-white focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/20 outline-none transition-all font-medium"
                />
            </div>
        </Card>
      </div>

      <div className="absolute bottom-8 left-4 right-4 z-10 flex flex-col items-center gap-4">
        <Button 
            variant="secondary" 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg bg-white hover:bg-gray-50 text-gray-700"
            onClick={handleUseGPS}
        >
            {loadingLocation ? <Loader2 className="h-5 w-5 animate-spin"/> : <Navigation className="h-5 w-5" />}
        </Button>

        <Card className="w-full max-w-md p-5 shadow-2xl border-0 bg-white space-y-4">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Confirm Location</p>
                <p className="text-gray-900 font-medium text-lg leading-tight truncate">
                    {address || "Select a location on the map"}
                </p>
            </div>
            <Button 
                className="w-full h-12 bg-[#7b1e3a] hover:bg-[#60152b] text-white font-bold rounded-xl text-lg shadow-lg shadow-[#7b1e3a]/20"
                onClick={handleConfirmLocation}
                disabled={isPending || !address}
            >
                {isPending ? <Loader2 className="animate-spin" /> : "Confirm Delivery Address"}
            </Button>
        </Card>
      </div>
    </div>
  );
}