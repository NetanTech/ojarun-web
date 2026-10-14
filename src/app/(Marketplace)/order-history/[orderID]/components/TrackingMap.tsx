"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { DriverMarker } from "./DriverMarker";

type Coordinate = [number, number];

/** Degrees from north; replaces @turf/turf for this single use. */
function bearingDegrees(start: Coordinate, end: Coordinate): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

interface TrackingMapProps {
  routeCoordinates: Coordinate[];
  pickup: Coordinate;
  destination: Coordinate;
}

export default function TrackingMap({
  routeCoordinates,
  pickup,
  destination,
}: TrackingMapProps) {
  const mapRef = useRef<MapRef>(null);

  const [driverPosition, setDriverPosition] = useState<Coordinate>(
    routeCoordinates[0],
  );

  const [bearing, setBearing] = useState(0);

  const routeGeoJSON: Feature<LineString> = useMemo(
    () => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeCoordinates,
      },
      properties: {},
    }),
    [routeCoordinates],
  );

  useEffect(() => {
    if (!routeCoordinates.length) return;

    let current = 0;

    const interval = setInterval(() => {
      if (current >= routeCoordinates.length - 1) {
        clearInterval(interval);
        return;
      }

      const start = routeCoordinates[current];
      const end = routeCoordinates[current + 1];

      setBearing(bearingDegrees(start, end));
      setDriverPosition(end);

      mapRef.current?.easeTo({
        center: end,
        duration: 1000,
        zoom: 14.5,
        pitch: 0,
      });

      current++;
    }, 2000);

    return () => clearInterval(interval);
  }, [routeCoordinates]);

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
        mapStyle={`https://api.maptiler.com/maps/dataviz/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      >
        <NavigationControl position="top-right" />

        {/* Route */}
        <Source
          id="route"
          type="geojson"
          data={routeGeoJSON}
        >
          {/* Shadow */}
          <Layer
            id="route-shadow"
            type="line"
            paint={{
              "line-color": "#D9A700",
              "line-width": 10,
              "line-opacity": 0.9,
            }}
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
          />

          {/* Main Line */}
          <Layer
            id="route-main"
            type="line"
            paint={{
              "line-color": "#FFD539",
              "line-width": 6,
            }}
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
          />
        </Source>

        {/* Pickup */}
        <Marker
          longitude={pickup[0]}
          latitude={pickup[1]}
          anchor="center"
        >
          <PickupMarker />
        </Marker>

        {/* Destination */}
        <Marker
          longitude={destination[0]}
          latitude={destination[1]}
          anchor="center"
        >
          <DestinationMarker />
        </Marker>

        {/* Driver */}
        <Marker
          longitude={driverPosition[0]}
          latitude={driverPosition[1]}
          anchor="center"
        >
          <DriverMarker bearing={bearing} />
        </Marker>
      </Map>
    </div>
  );
}