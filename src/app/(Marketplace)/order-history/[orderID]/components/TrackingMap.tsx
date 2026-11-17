"use client";

import { useEffect, useMemo, useRef } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Source,
  MapRef,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, LineString } from "geojson";
import { PickupMarker } from "./PickupMarker";
import { DestinationMarker } from "./DestinationMarker";

type Coordinate = [number, number]; // [lng, lat]

interface TrackingMapProps {
  pickup: Coordinate;
  /** Null for orders placed without a map pin. */
  destination: Coordinate | null;
}

/**
 * Shows the market the order is bought from and the customer's delivery pin.
 * Riders don't share live GPS yet, so there is deliberately no moving rider:
 * order progress is shown in the status panel instead.
 */
export default function TrackingMap({ pickup, destination }: TrackingMapProps) {
  const mapRef = useRef<MapRef>(null);

  const lineGeoJSON: Feature<LineString> | null = useMemo(
    () =>
      destination
        ? {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [pickup, destination] },
            properties: {},
          }
        : null,
    [pickup, destination],
  );

  const fitBoth = () => {
    if (!destination) return;
    mapRef.current?.fitBounds(
      [
        [Math.min(pickup[0], destination[0]), Math.min(pickup[1], destination[1])],
        [Math.max(pickup[0], destination[0]), Math.max(pickup[1], destination[1])],
      ],
      // Extra bottom/top room so the markers clear the order panel.
      { padding: { top: 140, bottom: 200, left: 60, right: 60 }, maxZoom: 15, duration: 0 },
    );
  };

  // Re-fit if the coordinates change after the map has loaded.
  useEffect(() => {
    fitBoth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickup[0], pickup[1], destination?.[0], destination?.[1]]);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: pickup[0],
          latitude: pickup[1],
          zoom: 13,
        }}
        onLoad={fitBoth}
        mapStyle={`https://api.maptiler.com/maps/dataviz/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      >
        <NavigationControl position="top-right" />

        {lineGeoJSON && (
          <Source id="route" type="geojson" data={lineGeoJSON}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#D9A700",
                "line-width": 4,
                "line-dasharray": [2, 1.5],
              }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
          </Source>
        )}

        <Marker longitude={pickup[0]} latitude={pickup[1]} anchor="center">
          <PickupMarker />
        </Marker>

        {destination && (
          <Marker
            longitude={destination[0]}
            latitude={destination[1]}
            anchor="center"
          >
            <DestinationMarker />
          </Marker>
        )}
      </Map>
    </div>
  );
}
