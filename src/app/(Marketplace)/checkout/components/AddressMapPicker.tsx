"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/** Rough city centre — map opens here before GPS / a saved pin. */
const IBADAN_CENTER = { lat: 7.401, lng: 3.917 };
const MAP_STYLE = `https://api.maptiler.com/maps/dataviz/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY || ""}`;

type Pin = { lat: number; lng: number };

interface AddressMapPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onConfirm: (result: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  confirming?: boolean;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (!key) {
    return `Pin ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
  try {
    const res = await fetch(
      `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${key}`,
    );
    if (!res.ok) {
      return `Pin ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
    const data = await res.json();
    const label = data?.features?.[0]?.place_name as string | undefined;
    return label || `Pin ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `Pin ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export default function AddressMapPicker({
  initialLat,
  initialLng,
  onConfirm,
  confirming = false,
}: AddressMapPickerProps) {
  const mapRef = useRef<MapRef>(null);
  const [pin, setPin] = useState<Pin>({
    lat: initialLat ?? IBADAN_CENTER.lat,
    lng: initialLng ?? IBADAN_CENTER.lng,
  });
  const [label, setLabel] = useState("Move the pin to your drop-off point");
  const [resolving, setResolving] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const hasMapKey = Boolean(process.env.NEXT_PUBLIC_MAPTILER_KEY);

  const refreshLabel = useCallback(async (next: Pin) => {
    setResolving(true);
    const name = await reverseGeocode(next.lat, next.lng);
    setLabel(name);
    setResolving(false);
  }, []);

  useEffect(() => {
    void refreshLabel(pin);
    // Only on mount / when parent seeds a pin — dragging refreshes itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMarkerDragEnd = useCallback(
    (event: { lngLat: { lat: number; lng: number } }) => {
      const next = { lat: event.lngLat.lat, lng: event.lngLat.lng };
      setPin(next);
      void refreshLabel(next);
    },
    [refreshLabel],
  );

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Your browser does not support location sharing.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPin(next);
        mapRef.current?.easeTo({
          center: [next.lng, next.lat],
          zoom: 16,
          duration: 800,
        });
        void refreshLabel(next);
        setLocating(false);
      },
      () => {
        setGeoError("Could not get your location. Move the pin manually.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12_000 },
    );
  };

  const initialView = useMemo(
    () => ({
      longitude: pin.lng,
      latitude: pin.lat,
      zoom: 14,
    }),
    // intentionally only for first paint
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!hasMapKey) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Map is not configured. Set <code>NEXT_PUBLIC_MAPTILER_KEY</code> to
        enable the pin picker.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-[#E7E7E7]">
        <Map
          ref={mapRef}
          mapLib={maplibregl}
          initialViewState={initialView}
          mapStyle={MAP_STYLE}
          onClick={(e) => {
            const next = { lat: e.lngLat.lat, lng: e.lngLat.lng };
            setPin(next);
            void refreshLabel(next);
          }}
        >
          <NavigationControl position="top-right" />
          <Marker
            longitude={pin.lng}
            latitude={pin.lat}
            anchor="bottom"
            draggable
            onDragEnd={onMarkerDragEnd}
          >
            <div className="flex flex-col items-center -mb-1 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-[#004A19] border-2 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#004A19]" />
            </div>
          </Marker>
        </Map>
      </div>

      <p className="body-small text-grey-300">
        Drag the pin or tap the map to set your exact drop-off point.
      </p>

      <div className="rounded-xl bg-[#F5F7F5] p-3">
        <p className="body-small text-grey-300">Drop-off</p>
        <p className="font-medium break-words">
          {resolving ? "Finding address…" : label}
        </p>
      </div>

      {geoError && <p className="text-sm text-red-600">{geoError}</p>}

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="flex-1 rounded-full border border-[#E7E7E7] px-4 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          {locating ? "Locating…" : "Use my current location"}
        </button>
        <button
          type="button"
          onClick={() => onConfirm({ lat: pin.lat, lng: pin.lng, address: label })}
          disabled={confirming || resolving}
          className="flex-1 rounded-full bg-[#004A19] text-white px-4 py-3 text-sm font-medium disabled:opacity-60"
        >
          {confirming ? "Saving…" : "Confirm this pin"}
        </button>
      </div>
    </div>
  );
}
