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
import * as turf from "@turf/turf";

import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, LineString } from 'geojson';
import { PickupMarker } from "./PickupMarker";
import { DestinationMarker } from "./DestinationMarker";
import { DriverMarker } from "./DriverMarker";

type Coordinate = [number, number];

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

  const [driverPosition, setDriverPosition] =
    useState<Coordinate>(routeCoordinates[0]);

  const [bearing, setBearing] = useState(0);

 const routeGeoJSON: Feature<LineString> = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: routeCoordinates,
  },
  properties: {},
};


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

      const angle = turf.bearing(
        turf.point(start),
        turf.point(end)
      );

      setBearing(angle);
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