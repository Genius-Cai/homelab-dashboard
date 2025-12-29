import { NextResponse } from "next/server";

// Dawarich API configuration
const DAWARICH_URL = process.env.DAWARICH_URL || "https://dawarich.geniuscai.com";
const DAWARICH_API_KEY = process.env.DAWARICH_API_KEY;

interface DawarichPoint {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  velocity?: number;
  altitude?: number;
  battery?: number;
  accuracy?: number;
}

export interface JourneyStop {
  time: string;
  location: string;
  icon: string;
  lat: number;
  lon: number;
  isCurrent: boolean;
}

// Haversine distance calculation (in meters)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate total distance from points
function calculateTotalDistance(points: DawarichPoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(
      points[i - 1].latitude,
      points[i - 1].longitude,
      points[i].latitude,
      points[i].longitude
    );
  }
  return Math.round(total / 100) / 10; // Return km with 1 decimal
}

// Parse timestamp - Dawarich uses Unix seconds, not milliseconds
function parseTimestamp(ts: number | string): Date {
  const num = typeof ts === "string" ? parseInt(ts) : ts;
  // If timestamp is less than year 2000 in ms, it's in seconds
  return new Date(num < 946684800000 ? num * 1000 : num);
}

// Format time in Sydney timezone
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Australia/Sydney",
  });
}

// Cluster points into stops (same location for 5+ minutes)
function clusterPointsToStops(points: DawarichPoint[]): JourneyStop[] {
  if (points.length === 0) return [];

  const STAY_THRESHOLD_METERS = 100; // 100m radius = same location
  const STAY_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes minimum stay

  const stops: JourneyStop[] = [];
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  // Always add START point
  stops.push({
    time: formatTime(parseTimestamp(firstPoint.timestamp)),
    location: "START",
    icon: "home",
    lat: firstPoint.latitude,
    lon: firstPoint.longitude,
    isCurrent: false,
  });

  // Find intermediate stops (stayed 5+ min in same location)
  let clusterStart = points[0];
  let clusterPoints: DawarichPoint[] = [points[0]];

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    const distance = haversineDistance(
      clusterStart.latitude,
      clusterStart.longitude,
      point.latitude,
      point.longitude
    );

    if (distance < STAY_THRESHOLD_METERS) {
      clusterPoints.push(point);
    } else {
      // End current cluster, check if valid stop
      const startTime = parseTimestamp(clusterStart.timestamp).getTime();
      const endTime = parseTimestamp(clusterPoints[clusterPoints.length - 1].timestamp).getTime();
      const duration = endTime - startTime;

      // Add as stop if stayed 5+ min and not the first point
      if (duration >= STAY_THRESHOLD_MS && clusterStart !== firstPoint) {
        stops.push({
          time: formatTime(parseTimestamp(clusterStart.timestamp)),
          location: "STOP",
          icon: "pin",
          lat: clusterStart.latitude,
          lon: clusterStart.longitude,
          isCurrent: false,
        });
      }

      // Start new cluster
      clusterStart = point;
      clusterPoints = [point];
    }
  }

  // Add END point (if different from START)
  const distFromStart = haversineDistance(
    firstPoint.latitude, firstPoint.longitude,
    lastPoint.latitude, lastPoint.longitude
  );

  if (distFromStart > STAY_THRESHOLD_METERS || points.length === 1) {
    stops.push({
      time: formatTime(parseTimestamp(lastPoint.timestamp)),
      location: "END", // Will be updated to NOW/END by assignStopNames
      icon: "pin",
      lat: lastPoint.latitude,
      lon: lastPoint.longitude,
      isCurrent: true,
    });
  }

  return stops;
}

// Simple location naming (geocoding moved to client-side for reliability)
function assignStopNames(stops: JourneyStop[], isToday: boolean): JourneyStop[] {
  return stops.map((stop, i) => {
    let icon = "pin";
    let location = stop.location;

    // Set icon based on position
    if (stop.isCurrent) {
      icon = "pin";
      // Only show "NOW" for today, otherwise it's just the last point
      location = isToday ? "NOW" : "END";
    } else if (i === 0) {
      icon = "home";
      location = "START";
    }

    return { ...stop, icon, location };
  });
}

// GET - Fetch journey from Dawarich (supports date range)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date"); // Optional: specific date YYYY-MM-DD
  const fromParam = searchParams.get("from"); // Optional: start date for range
  const toParam = searchParams.get("to"); // Optional: end date for range
  if (!DAWARICH_API_KEY) {
    // Return mock data when not configured
    return NextResponse.json({
      success: true,
      data: [
        { time: "09:23", location: "HOME", icon: "home", lat: 0, lon: 0, isCurrent: false },
        { time: "10:15", location: "CAFE", icon: "coffee", lat: 0, lon: 0, isCurrent: false },
        { time: "12:20", location: "PARK", icon: "park", lat: 0, lon: 0, isCurrent: false },
        { time: "13:25", location: "NOW", icon: "pin", lat: 0, lon: 0, isCurrent: true },
      ],
      stats: {
        totalDistance: 9.2,
        stopCount: 3,
      },
      source: "mock",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Calculate date range based on parameters
    let startDate: Date;
    let endDate: Date;

    if (fromParam && toParam) {
      // Date range mode
      startDate = new Date(fromParam);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(toParam);
      endDate.setHours(23, 59, 59, 999);
    } else if (dateParam) {
      // Specific date mode
      startDate = new Date(dateParam);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(dateParam);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Default: today
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    // Check if querying today's data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = startDate.getTime() === today.getTime();

    const startOfDay = startDate.toISOString();
    const endOfDay = endDate.toISOString();

    // Fetch points from Dawarich API
    const response = await fetch(
      `${DAWARICH_URL}/api/v1/points?api_key=${DAWARICH_API_KEY}&start_at=${startOfDay}&end_at=${endOfDay}&per_page=1000`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Dawarich API error:", response.status);
      // Return mock data on error
      return NextResponse.json({
        success: false,
        data: [
          { time: "09:23", location: "HOME", icon: "home", lat: 0, lon: 0, isCurrent: false },
          { time: "13:25", location: "NOW", icon: "pin", lat: 0, lon: 0, isCurrent: true },
        ],
        stats: { totalDistance: 0, stopCount: 1 },
        source: "mock",
        error: `Dawarich API error: ${response.status}`,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();
    const points: DawarichPoint[] = data.data || data || [];

    // Sort points by timestamp
    points.sort((a, b) => parseTimestamp(a.timestamp).getTime() - parseTimestamp(b.timestamp).getTime());

    // Calculate stats
    const totalDistance = calculateTotalDistance(points);

    // Cluster into stops
    let stops = clusterPointsToStops(points);

    // Assign basic names (geocoding done client-side)
    stops = assignStopNames(stops, isToday);

    // Extract track coordinates for map drawing (simplified)
    const track = points.map((p) => ({
      lat: p.latitude,
      lon: p.longitude,
      time: parseTimestamp(p.timestamp).toISOString(),
    }));

    // Calculate bounding box for map
    const lats = points.map((p) => p.latitude);
    const lons = points.map((p) => p.longitude);
    const bounds = points.length > 0 ? {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons),
    } : null;

    return NextResponse.json({
      success: true,
      data: stops,
      track, // Raw coordinates for map rendering
      bounds, // Bounding box for map viewport
      stats: {
        totalDistance,
        stopCount: stops.filter(s => s.location === "STOP").length, // Only intermediate stops
        pointCount: points.length,
      },
      source: "dawarich",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Dawarich fetch error:", error);
    return NextResponse.json({
      success: false,
      data: [
        { time: "09:23", location: "HOME", icon: "home", lat: 0, lon: 0, isCurrent: false },
        { time: "13:25", location: "NOW", icon: "pin", lat: 0, lon: 0, isCurrent: true },
      ],
      stats: { totalDistance: 0, stopCount: 1 },
      source: "mock",
      error: "Failed to fetch journey data",
      timestamp: new Date().toISOString(),
    });
  }
}
