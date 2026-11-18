"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchDeliveryAreas, type DeliveryArea } from "@/lib/delivery";
import { getCurrentPosition, reverseGeocode } from "@/lib/geo";

interface QuickAddressFormProps {
  onPicked: (result: { lat: number; lng: number; address: string }) => void;
  onUseMap: () => void;
}

/**
 * Address entry without a map: one-tap GPS, or pick an Ibadan area from a
 * searchable list and type the street. The area's centre is used for the
 * delivery fee; the street and landmark guide the rider.
 */
export default function QuickAddressForm({ onPicked, onUseMap }: QuickAddressFormProps) {
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [areasError, setAreasError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<DeliveryArea | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [street, setStreet] = useState("");
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchDeliveryAreas()
      .then((list) => {
        if (!cancelled) setAreas(list);
      })
      .catch(() => {
        if (!cancelled) {
          setAreasError(
            "Could not load the area list. Use your current location or the map.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? areas.filter((a) => a.name.toLowerCase().includes(q)) : areas;
    return list.slice(0, 50);
  }, [areas, query]);

  const useMyLocation = async () => {
    setGpsError(null);
    setLocating(true);
    try {
      const pos = await getCurrentPosition();
      const address = await reverseGeocode(pos.lat, pos.lng);
      onPicked({ ...pos, address });
    } catch (err) {
      setGpsError(err instanceof Error ? err.message : "Could not get your location.");
    } finally {
      setLocating(false);
    }
  };

  const canContinue = Boolean(area) && street.trim().length >= 3;

  return (
    <div className="flex flex-col gap-4 w-full">
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className="w-full rounded-full bg-[#004A19] text-white px-4 py-3 text-sm font-medium disabled:opacity-60"
      >
        {locating ? "Getting your location..." : "Use my current location"}
      </button>
      {gpsError && <p className="text-sm text-red-600">{gpsError}</p>}

      <div className="flex items-center gap-3 text-xs text-grey-300">
        <span className="h-px flex-1 bg-[#E7E7E7]" />
        or enter your address
        <span className="h-px flex-1 bg-[#E7E7E7]" />
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="area-search" className="text-sm font-medium">
          Area
        </label>
        <input
          id="area-search"
          type="text"
          autoComplete="off"
          value={area && !listOpen ? area.name : query}
          onFocus={() => setListOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setArea(null);
            setListOpen(true);
          }}
          placeholder="Search your area, e.g. Bodija, Agbowo, UI"
          className="w-full border border-[#E7E7E7] rounded-xl p-3 focus-within:outline-0"
        />
        {listOpen && areas.length > 0 && (
          <ul
            role="listbox"
            className="max-h-48 overflow-y-auto border border-[#E7E7E7] rounded-xl bg-white"
          >
            {matches.length === 0 ? (
              <li className="p-3 text-sm text-grey-300">
                No match. Pick the nearest area, or use the map.
              </li>
            ) : (
              matches.map((a) => (
                <li key={a.name}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={area?.name === a.name}
                    className="w-full text-left p-3 text-sm hover:bg-[#F5F7F5]"
                    onClick={() => {
                      setArea(a);
                      setQuery(a.name);
                      setListOpen(false);
                    }}
                  >
                    {a.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
        {areasError && <p className="text-sm text-red-600">{areasError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="street" className="text-sm font-medium">
          Street and house number
        </label>
        <input
          id="street"
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="e.g. 12 Olorunkemi Street"
          className="w-full border border-[#E7E7E7] rounded-xl p-3 focus-within:outline-0"
        />
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => {
          if (!area) return;
          onPicked({
            lat: area.lat,
            lng: area.lng,
            address: `${street.trim()}, ${area.name}, Ibadan`,
          });
        }}
        className="w-full rounded-full border border-[#004A19] text-[#004A19] px-4 py-3 text-sm font-medium disabled:opacity-50"
      >
        Continue
      </button>

      <button
        type="button"
        onClick={onUseMap}
        className="text-sm text-primary underline w-fit self-center"
      >
        Prefer the map? Drop a pin instead
      </button>
    </div>
  );
}
