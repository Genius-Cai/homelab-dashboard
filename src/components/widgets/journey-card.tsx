"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PixelHome,
  PixelCoffee,
  PixelPark,
  PixelPin,
} from "@/components/ui/pixel-icons";

// Dynamic import for Leaflet (no SSR)
const JourneyMap = dynamic(() => import("./journey-map").then((mod) => mod.JourneyMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] border border-border bg-muted/30 flex items-center justify-center">
      <span className="text-xs text-muted-foreground font-mono animate-pulse">Loading map...</span>
    </div>
  ),
});

interface JourneyStop {
  time: string;
  location: string;
  icon: string;
  lat: number;
  lon: number;
  isCurrent: boolean;
}

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

interface JourneyData {
  success: boolean;
  data: JourneyStop[];
  track?: TrackPoint[];
  bounds?: Bounds | null;
  stats: {
    totalDistance: number;
    stopCount: number;
    pointCount?: number;
  };
  source: string;
}

// Client-side reverse geocoding using Nominatim
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16`,
      { headers: { "User-Agent": "HomelabDashboard/1.0" } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    const addr = data.address || {};
    return addr.suburb || addr.neighbourhood || addr.road || addr.town || null;
  } catch {
    return null;
  }
}

// Geocode all stops (client-side)
async function geocodeStops(stops: JourneyStop[]): Promise<JourneyStop[]> {
  const geocoded: JourneyStop[] = [];

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    const lat = Number(stop.lat);
    const lon = Number(stop.lon);

    if (lat !== 0 && lon !== 0 && !isNaN(lat) && !isNaN(lon)) {
      const placeName = await reverseGeocode(lat, lon);
      if (placeName) {
        let newLocation: string;
        if (stop.location === "NOW") {
          newLocation = `NOW · ${placeName}`;
        } else if (stop.location === "END") {
          newLocation = `END · ${placeName}`;
        } else if (stop.location === "START") {
          newLocation = `START · ${placeName}`;
        } else if (stop.location === "STOP") {
          newLocation = placeName; // Just show the place name for intermediate stops
        } else {
          newLocation = placeName;
        }
        geocoded.push({ ...stop, location: newLocation });
        continue;
      }
    }
    geocoded.push(stop);
  }

  return geocoded;
}

// Map icon names to components
function getIcon(iconName: string) {
  switch (iconName) {
    case "home":
      return <PixelHome size={16} />;
    case "coffee":
      return <PixelCoffee size={16} />;
    case "park":
      return <PixelPark size={16} />;
    case "pin":
    default:
      return <PixelPin size={16} />;
  }
}

function JourneyItem({ stop }: { stop: JourneyStop }) {
  const isNow = stop.location.startsWith("NOW");
  const isEnd = stop.location.startsWith("END");
  const isStart = stop.location.startsWith("START");
  const isSpecial = isNow || isEnd || isStart;

  return (
    <div className={`flex items-center gap-2 ${isSpecial ? "font-bold" : ""}`}>
      <div
        className={`relative z-10 p-0.5 border border-border bg-card ${
          isNow ? "animate-pulse" : ""
        }`}
      >
        {getIcon(stop.icon)}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-muted-foreground font-mono">{stop.time}</span>
        <p className={`text-xs truncate ${isSpecial ? "text-primary" : ""}`}>{stop.location}</p>
      </div>
      {isNow && (
        <Badge variant="default" className="text-[8px] px-1 h-4">
          NOW
        </Badge>
      )}
      {isEnd && (
        <Badge variant="outline" className="text-[8px] px-1 h-4">
          END
        </Badge>
      )}
    </div>
  );
}


export function JourneyCard() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [data, setData] = useState<JourneyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get available dates (last 7 days with data)
  const getRecentDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push({
        value: d.toISOString().split("T")[0],
        label: i === 0 ? "Today" : i === 1 ? "Yesterday" : d.toLocaleDateString("en-AU", { month: "numeric", day: "numeric" }),
      });
    }
    return dates;
  };

  const recentDates = getRecentDates();

  // Fetch journey data and geocode stops
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const url = selectedDate ? `/api/dawarich?date=${selectedDate}` : "/api/dawarich";
        const res = await fetch(url);
        const json = await res.json();

        // Client-side geocoding (server-side has network issues with Nominatim)
        if (json.data && json.data.length > 0) {
          json.data = await geocodeStops(json.data);
        }

        setData(json);
      } catch (err) {
        console.error("Failed to fetch journey:", err);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [selectedDate]);

  const stops = data?.data || [];

  return (
    <Card className="lg:row-span-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <PixelPin size={16} />
          {selectedDate ? "JOURNEY" : "TODAY'S JOURNEY"}
          {data?.source === "dawarich" && (
            <Badge variant="outline" className="text-[9px] ml-auto">
              LIVE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Date selector */}
        <div className="flex gap-1 mb-3 flex-wrap">
          <Button
            variant={selectedDate === null ? "default" : "ghost"}
            size="sm"
            className="h-5 px-2 text-[10px]"
            onClick={() => setSelectedDate(null)}
          >
            Today
          </Button>
          {recentDates.slice(1, 5).map((d) => (
            <Button
              key={d.value}
              variant={selectedDate === d.value ? "default" : "ghost"}
              size="sm"
              className="h-5 px-2 text-[10px]"
              onClick={() => setSelectedDate(d.value)}
            >
              {d.label}
            </Button>
          ))}
        </div>

        {/* Leaflet Map */}
        <div className="mb-3 relative">
          <JourneyMap
            track={data?.track || []}
            bounds={data?.bounds || null}
            startLabel={stops[0]?.location}
            endLabel={stops[stops.length - 1]?.location}
          />
          <a
            href="https://dawarich.geniuscai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-1 right-1 text-[8px] bg-background/80 px-1 py-0.5 border border-border hover:bg-muted z-[1000]"
          >
            Dawarich ↗
          </a>
        </div>

        {/* Stops list */}
        {isLoading ? (
          <div className="text-xs text-muted-foreground italic">Loading journey...</div>
        ) : stops.length > 0 ? (
          <div className="relative pl-4 space-y-3">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-6 w-0.5 border-l border-dashed border-border" />
            {stops.slice(0, 5).map((stop, index) => (
              <JourneyItem key={index} stop={stop} />
            ))}
            {stops.length > 5 && (
              <div className="text-[10px] text-muted-foreground">+{stops.length - 5} more stops</div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic">
            {selectedDate ? "No journey data for this day" : "No journey data today"}
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 pt-2 border-t border-border/50 flex gap-4 text-[10px] text-muted-foreground font-mono">
          <span>[{data?.stats?.totalDistance || 0}km]</span>
          <span>[{data?.stats?.stopCount ?? 0} stops]</span>
          {data?.stats?.pointCount && <span>[{data.stats.pointCount} pts]</span>}
        </div>
      </CardContent>
    </Card>
  );
}
