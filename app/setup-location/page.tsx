"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Libraries } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ArrowLeft, Crosshair, Search, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUpdateProfile } from "@/services/auth/auth.queries";
import debounce from "lodash.debounce";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const DEFAULT_CENTER = { lat: 5.5544, lng: 5.7932 };
const LIBRARIES: Libraries = ["places"];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false, // We'll add our own or rely on pinch-zoom on mobile
  clickableIcons: false, // Reduces unnecessary Places API calls = lower billing
  restriction: {
    latLngBounds: { north: 13.89, south: 4.27, west: 2.67, east: 14.68 },
    strictBounds: false,
  },
};

interface Suggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

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

  // Search state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  // Session token groups autocomplete + place detail into one billing session
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Renew session token after each completed selection (billing best-practice)
  const renewSessionToken = useCallback(() => {
    if (!window.google) return;
    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
  }, []);

  // Debounced reverse geocode — fires at most once per 600ms after dragging stops
  const fetchAddress = useCallback(
    debounce((lat: number, lng: number) => {
      if (!geocoderRef.current) return;
      geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress("Unknown location");
        }
      });
    }, 600),
    [],
  );

  // Debounced autocomplete — 300ms, minimum 2 chars
  const fetchSuggestions = useCallback(
    debounce((input: string) => {
      if (!autocompleteServiceRef.current || input.length < 2) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "ng" },
          sessionToken: sessionTokenRef.current ?? undefined,
          types: ["geocode", "establishment"],
        },
        (predictions, status) => {
          setIsSearching(false);
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(
              predictions.map((p) => ({
                placeId: p.place_id,
                mainText: p.structured_formatting.main_text,
                secondaryText: p.structured_formatting.secondary_text ?? "",
                description: p.description,
              })),
            );
            setShowDropdown(true);
            setActiveIndex(-1);
          } else {
            setSuggestions([]);
          }
        },
      );
    }, 300),
    [],
  );

  const handleMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      mapRef.current = mapInstance;
      geocoderRef.current = new google.maps.Geocoder();
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      // PlacesService needs a map or a DOM node
      placesServiceRef.current = new google.maps.places.PlacesService(mapInstance);
      renewSessionToken();
      fetchAddress(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
    },
    [fetchAddress, renewSessionToken],
  );

  // Select a suggestion from the dropdown
  const selectSuggestion = useCallback(
    (suggestion: Suggestion) => {
      if (!placesServiceRef.current) return;

      setQuery(suggestion.mainText);
      setShowDropdown(false);
      setSuggestions([]);
      setPlaceName(suggestion.mainText);
      setAddress(suggestion.description);

      // Fetch full place details (geometry) — this + autocomplete = 1 session = cheaper
      placesServiceRef.current.getDetails(
        {
          placeId: suggestion.placeId,
          fields: ["geometry", "formatted_address", "name"], // Only request needed fields
          sessionToken: sessionTokenRef.current ?? undefined,
        },
        (place, status) => {
          renewSessionToken(); // Renew after completing a session
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            const coords = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setCenter(coords);
            mapRef.current?.panTo(coords);
            mapRef.current?.setZoom(17);
            setPlaceName(place.name ?? suggestion.mainText);
            setAddress(place.formatted_address ?? suggestion.description);
          } else {
            toast.error("Couldn't load location details");
          }
        },
      );
    },
    [renewSessionToken],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length >= 2) {
      setIsSearching(true);
      fetchSuggestions(val);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex]);
        searchInputRef.current?.blur();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      searchInputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setPlaceName("");
    searchInputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current !== e.target
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
    setShowDropdown(false);
  };

  const handleIdle = () => {
    if (!mapRef.current) return;
    setIsDragging(false);
    const currentCenter = mapRef.current.getCenter();
    if (!currentCenter) return;
    const lat = currentCenter.lat();
    const lng = currentCenter.lng();
    setCenter({ lat, lng });
    fetchAddress(lat, lng);
    setPlaceName(""); // User dragged away from the searched place
    setQuery("");
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setIsFetchingGPS(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = { lat: coords.latitude, lng: coords.longitude };
        setCenter(location);
        mapRef.current?.panTo(location);
        mapRef.current?.setZoom(17);
        fetchAddress(location.lat, location.lng);
        setPlaceName("");
        setQuery("");
        setIsFetchingGPS(false);
      },
      () => {
        toast.error("Unable to fetch your location");
        setIsFetchingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
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
      await updateProfile({ latitude: lat, longitude: lng, address: finalAddress });
      toast.success("Location saved!");
      isModal && onComplete ? onComplete() : router.back();
    } catch {
      toast.error("Failed to save location");
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-[#7b1e3a]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col w-full bg-gray-50 overflow-hidden",
        isModal ? "h-[85vh] min-h-[520px] rounded-2xl" : "h-[100dvh]",
      )}
    >
      {/* ─── Search bar overlay ─── */}
      <div className="absolute top-0 left-0 right-0 z-50 p-3 pt-safe-top">
        <div className="flex gap-2 items-center">
          {!isModal && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => router.back()}
              className="h-11 w-11 shrink-0 rounded-full bg-white shadow-md border-none"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
          )}

          {/* Search input + dropdown */}
          <div className="flex-1 relative">
            {/* Input pill */}
            <div className="flex items-center h-12 bg-white rounded-full shadow-md px-4 gap-2">
              {isSearching ? (
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin shrink-0" />
              ) : (
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
              )}
              <input
                ref={searchInputRef}
                type="text"
                inputMode="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                placeholder="Search street or area..."
                className="flex-1 bg-transparent text-gray-800 text-sm font-medium placeholder:text-gray-400 focus:outline-none min-w-0"
              />
              {query.length > 0 && (
                <button
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur before clear fires
                  onClick={clearSearch}
                  className="shrink-0 p-0.5 rounded-full text-gray-400 hover:text-gray-600 active:text-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-100"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={s.placeId}
                    // onMouseDown prevents the input losing focus before click fires
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      selectSuggestion(s);
                      searchInputRef.current?.blur();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      "active:bg-gray-100 touch-manipulation", // Better mobile tap response
                      i === activeIndex ? "bg-[#7b1e3a]/5" : "hover:bg-gray-50",
                      i !== 0 && "border-t border-gray-50",
                    )}
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-[#7b1e3a]/8 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-[#7b1e3a]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {s.mainText}
                      </p>
                      {s.secondaryText && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {s.secondaryText}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Map ─── */}
      <div className="flex-1 relative w-full">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={15}
          options={MAP_OPTIONS}
          onLoad={handleMapLoad}
          onUnmount={() => { mapRef.current = null; }}
          onDragStart={handleDragStart}
          onIdle={handleIdle}
        />

        {/* Crosshair pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-20"
          style={{ marginTop: isDragging ? "-60px" : "-48px", transition: "margin-top 0.15s ease" }}>
          <MapPin
            className="text-[#7b1e3a] fill-[#7b1e3a] h-12 w-12 drop-shadow-lg"
          />
        </div>
        {/* Pin shadow dot */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-20 transition-all duration-150"
          style={{
            width: isDragging ? "6px" : "10px",
            height: isDragging ? "3px" : "5px",
            marginTop: "0px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.25)",
            filter: isDragging ? "blur(2px)" : "blur(1px)",
          }}
        />

        {/* GPS button */}
        <div className="absolute bottom-6 right-4 z-20">
          <Button
            size="icon"
            onClick={handleUseGPS}
            disabled={isFetchingGPS}
            className="h-14 w-14 rounded-full bg-white text-[#7b1e3a] shadow-lg hover:bg-gray-50 border border-gray-100"
          >
            {isFetchingGPS ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Crosshair className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* ─── Bottom sheet ─── */}
      <div className="bg-white px-5 pt-4 pb-6 rounded-t-3xl shadow-[0_-12px_32px_rgba(0,0,0,0.07)] z-30 relative">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <p className="text-[10px] font-bold text-[#7b1e3a] uppercase tracking-widest mb-3">
          Delivery Address
        </p>
        <div className="flex gap-3 mb-5 items-start">
          <div className="mt-0.5 bg-[#7b1e3a]/10 p-2 rounded-full shrink-0">
            <MapPin className="text-[#7b1e3a] h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            {placeName && !isDragging && (
              <p className="font-bold text-gray-900 text-base leading-snug truncate">
                {placeName}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
              {isDragging ? "Drop pin to set location…" : address}
            </p>
          </div>
        </div>
        <Button
          onClick={handleConfirm}
          disabled={isPending || isDragging || address === "Locating..."}
          className="w-full h-13 bg-[#7b1e3a] hover:bg-[#5e162c] text-white text-base font-bold rounded-xl shadow-md shadow-[#7b1e3a]/20 disabled:opacity-50"
        >
          {isPending ? (
            <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving…</>
          ) : isDragging ? (
            "Drop pin to confirm"
          ) : (
            "Confirm Location"
          )}
        </Button>
      </div>
    </div>
  );
}