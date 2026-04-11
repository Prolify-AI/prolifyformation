"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Loader as Loader2 } from "lucide-react";

interface AddressParts {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (parts: AddressParts) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initGooglePlaces?: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

let scriptLoaded = false;
let scriptLoading = false;
const readyCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(onReady: () => void) {
  if (scriptLoaded) {
    onReady();
    return;
  }
  readyCallbacks.push(onReady);
  if (scriptLoading) return;
  scriptLoading = true;

  window.initGooglePlaces = () => {
    scriptLoaded = true;
    scriptLoading = false;
    readyCallbacks.forEach((cb) => cb());
    readyCallbacks.length = 0;
  };

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlaces&loading=async`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

export function AddressAutocomplete({ value, onChange, onAddressSelect, placeholder = "123 Main Street", className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "us" },
      types: ["address"],
      fields: ["address_components", "formatted_address"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.address_components) return;

      const parts: AddressParts = { street: "", city: "", state: "", zip: "" };
      let streetNumber = "";
      let streetName = "";

      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes("street_number")) streetNumber = component.long_name;
        else if (types.includes("route")) streetName = component.long_name;
        else if (types.includes("locality")) parts.city = component.long_name;
        else if (types.includes("administrative_area_level_1")) parts.state = component.short_name;
        else if (types.includes("postal_code")) parts.zip = component.long_name;
      }

      parts.street = streetNumber ? `${streetNumber} ${streetName}`.trim() : streetName;
      onChange(parts.street);
      onAddressSelect(parts);
    });

    setIsLoading(false);
  }, [onChange, onAddressSelect]);

  useEffect(() => {
    setIsLoading(true);
    loadGoogleMapsScript(() => {
      initAutocomplete();
    });
  }, [initAutocomplete]);

  useEffect(() => {
    if (scriptLoaded && !autocompleteRef.current) {
      initAutocomplete();
    }
  }, [initAutocomplete]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full h-10 px-3 pr-9 rounded-lg text-sm bg-white dark:bg-[#0a0a0a] text-black dark:text-white border-2 transition-colors outline-none placeholder:text-black/40 dark:placeholder:text-white/40 ${
            isFocused
              ? "border-[#FFC107]"
              : "border-black/15 dark:border-white/15"
          } ${className}`}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-black/30 dark:text-white/30 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 text-black/30 dark:text-white/30" />
          )}
        </div>
      </div>
    </div>
  );
}
