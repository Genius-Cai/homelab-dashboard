"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TrackPoint {
  lat: number;
  lon: number;
  time: string;
}

interface Bounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

interface JourneyMapProps {
  track: TrackPoint[];
  bounds: Bounds | null;
  startLabel?: string;
  endLabel?: string;
}

// Custom markers
const startIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="background:#22c55e;color:white;padding:2px 6px;border-radius:2px;font-size:10px;font-weight:bold;white-space:nowrap;border:1px solid #166534;">START</div>`,
  iconSize: [50, 20],
  iconAnchor: [25, 20],
});

const endIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="background:#3b82f6;color:white;padding:2px 6px;border-radius:2px;font-size:10px;font-weight:bold;white-space:nowrap;border:1px solid #1d4ed8;">END</div>`,
  iconSize: [40, 20],
  iconAnchor: [20, 20],
});

// Auto-fit bounds component
function FitBounds({ bounds }: { bounds: Bounds | null }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      const leafletBounds = L.latLngBounds(
        [bounds.minLat, bounds.minLon],
        [bounds.maxLat, bounds.maxLon]
      );
      map.fitBounds(leafletBounds, { padding: [20, 20] });
    }
  }, [map, bounds]);

  return null;
}

export function JourneyMap({ track, bounds, startLabel, endLabel }: JourneyMapProps) {
  if (!track || track.length === 0) {
    return (
      <div className="w-full h-[200px] border border-border bg-muted/30 flex items-center justify-center">
        <span className="text-xs text-muted-foreground font-mono">No track data</span>
      </div>
    );
  }

  const positions: [number, number][] = track.map((p) => [p.lat, p.lon]);
  const startPos = positions[0];
  const endPos = positions[positions.length - 1];

  // Default center (Sydney)
  const center: [number, number] = bounds
    ? [(bounds.minLat + bounds.maxLat) / 2, (bounds.minLon + bounds.maxLon) / 2]
    : [-33.9, 151.2];

  return (
    <div className="w-full h-[200px] border border-border overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds bounds={bounds} />

        {/* Track polyline */}
        <Polyline
          positions={positions}
          pathOptions={{
            color: "#3b82f6",
            weight: 3,
            opacity: 0.8,
          }}
        />

        {/* Start marker */}
        <Marker position={startPos} icon={startIcon}>
          {startLabel && <Popup>{startLabel}</Popup>}
        </Marker>

        {/* End marker */}
        <Marker position={endPos} icon={endIcon}>
          {endLabel && <Popup>{endLabel}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
