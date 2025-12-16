import { NextResponse } from "next/server";

// Beszel Hub API (PocketBase-based)
const BESZEL_URL = process.env.BESZEL_URL || "http://192.168.50.80:8090";
const BESZEL_EMAIL = process.env.BESZEL_EMAIL;
const BESZEL_PASSWORD = process.env.BESZEL_PASSWORD;

interface BeszelSystem {
  id: string;
  name: string;
  host: string;
  status: "up" | "down" | "paused" | "pending";
  info: {
    cpu: number;
    mp: number; // memory percentage
    dp?: number; // disk percentage
    t?: number; // temperature (Celsius * 10)
    g?: number; // GPU load
    gt?: number; // GPU temperature (Celsius * 10)
  };
}

interface SystemData {
  id: string;
  name: string;
  status: "online" | "offline";
  cpu: number;
  memory: number;
  temp: number | null;
  gpuLoad: number | null;
  gpuTemp: number | null;
}

// Cache token to avoid re-authenticating every request
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAuthToken(): Promise<string | null> {
  // Return cached token if still valid (with 5min buffer)
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  if (!BESZEL_EMAIL || !BESZEL_PASSWORD) {
    console.warn("Beszel credentials not configured");
    return null;
  }

  try {
    const response = await fetch(`${BESZEL_URL}/api/collections/users/auth-with-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity: BESZEL_EMAIL,
        password: BESZEL_PASSWORD,
      }),
    });

    if (!response.ok) {
      console.error("Beszel auth failed:", response.status);
      return null;
    }

    const data = await response.json();
    cachedToken = data.token;
    // Token typically valid for 2 hours
    tokenExpiry = Date.now() + 7200000;
    return cachedToken;
  } catch (error) {
    console.error("Beszel auth error:", error);
    return null;
  }
}

async function fetchSystems(token: string): Promise<BeszelSystem[]> {
  try {
    const response = await fetch(`${BESZEL_URL}/api/collections/systems/records`, {
      headers: {
        Authorization: token,
      },
      next: { revalidate: 10 }, // Cache for 10 seconds
    });

    if (!response.ok) {
      throw new Error(`Beszel API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Failed to fetch Beszel systems:", error);
    return [];
  }
}

function transformSystem(system: BeszelSystem): SystemData {
  return {
    id: system.id,
    name: system.name,
    status: system.status === "up" ? "online" : "offline",
    cpu: Math.round(system.info?.cpu || 0),
    memory: Math.round(system.info?.mp || 0),
    temp: system.info?.t ? Math.round(system.info.t / 10) : null,
    gpuLoad: system.info?.g ?? null,
    gpuTemp: system.info?.gt ? Math.round(system.info.gt / 10) : null,
  };
}

// Mock data for when Beszel is not configured
const mockSystems: SystemData[] = [
  { id: "pve-main", name: "PVE", status: "online", cpu: 68, memory: 82, temp: 52, gpuLoad: null, gpuTemp: null },
  { id: "fnos", name: "fnOS", status: "online", cpu: 15, memory: 45, temp: 38, gpuLoad: null, gpuTemp: null },
  { id: "rtx4090", name: "4090-PC", status: "online", cpu: 23, memory: 45, temp: 38, gpuLoad: 12, gpuTemp: 45 },
];

export async function GET() {
  try {
    // If credentials not configured, return mock data
    if (!BESZEL_EMAIL || !BESZEL_PASSWORD) {
      return NextResponse.json({
        success: true,
        data: mockSystems,
        source: "mock",
        message: "Beszel credentials not configured. Set BESZEL_EMAIL and BESZEL_PASSWORD.",
        timestamp: new Date().toISOString(),
      });
    }

    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({
        success: false,
        data: mockSystems,
        source: "mock",
        error: "Failed to authenticate with Beszel",
        timestamp: new Date().toISOString(),
      });
    }

    const systems = await fetchSystems(token);
    const transformedSystems = systems.map(transformSystem);

    return NextResponse.json({
      success: true,
      data: transformedSystems.length > 0 ? transformedSystems : mockSystems,
      source: transformedSystems.length > 0 ? "beszel" : "mock",
      count: transformedSystems.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Beszel API error:", error);
    return NextResponse.json(
      {
        success: false,
        data: mockSystems,
        source: "mock",
        error: "Failed to fetch system data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
