import { NextResponse } from "next/server";

// qBittorrent API configuration
const QBIT_URL = process.env.QBIT_URL || "http://192.168.50.80:8080";
const QBIT_USERNAME = process.env.QBIT_USERNAME || "admin";
const QBIT_PASSWORD = process.env.QBIT_PASSWORD || "adminadmin";

export interface TorrentInfo {
  hash: string;
  name: string;
  size: number;
  progress: number;
  dlspeed: number;
  upspeed: number;
  state: string;
  eta: number;
  category: string;
}

export interface ActivityItem {
  type: "jellyfin" | "qbittorrent" | "docker";
  title: string;
  subtitle?: string;
  progress?: number;
  status: "active" | "paused" | "completed";
  timestamp: string;
  icon?: string;
}

// Cache for SID cookie
let cachedSID: string | null = null;
let sidExpiry: number = 0;

async function getQBitSID(): Promise<string | null> {
  // Return cached SID if still valid (30 minutes)
  if (cachedSID && Date.now() < sidExpiry) {
    return cachedSID;
  }

  try {
    const response = await fetch(`${QBIT_URL}/api/v2/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${encodeURIComponent(QBIT_USERNAME)}&password=${encodeURIComponent(QBIT_PASSWORD)}`,
      cache: "no-store",
    });

    if (!response.ok || response.headers.get("set-cookie") === null) {
      console.error("qBittorrent auth failed:", response.status);
      return null;
    }

    // Extract SID from set-cookie header
    const cookies = response.headers.get("set-cookie");
    const sidMatch = cookies?.match(/SID=([^;]+)/);
    if (sidMatch) {
      cachedSID = sidMatch[1];
      sidExpiry = Date.now() + 1800000; // 30 minutes
      return cachedSID;
    }

    return null;
  } catch (error) {
    console.error("qBittorrent auth error:", error);
    return null;
  }
}

async function fetchTorrents(sid: string): Promise<TorrentInfo[]> {
  try {
    // Get downloading torrents only
    const response = await fetch(
      `${QBIT_URL}/api/v2/torrents/info?filter=downloading`,
      {
        headers: {
          Cookie: `SID=${sid}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("qBittorrent API error:", response.status);
      return [];
    }

    const torrents = await response.json();
    return torrents.map((t: any) => ({
      hash: t.hash,
      name: t.name,
      size: t.size,
      progress: Math.round(t.progress * 100),
      dlspeed: t.dlspeed,
      upspeed: t.upspeed,
      state: t.state,
      eta: t.eta,
      category: t.category || "",
    }));
  } catch (error) {
    console.error("qBittorrent fetch error:", error);
    return [];
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatETA(seconds: number): string {
  if (seconds < 0 || seconds === 8640000) return "∞";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export async function GET() {
  try {
    const sid = await getQBitSID();

    if (!sid) {
      return NextResponse.json({
        success: false,
        data: [],
        torrents: [],
        source: "mock",
        error: "Failed to authenticate with qBittorrent",
        timestamp: new Date().toISOString(),
      });
    }

    const allTorrents = await fetchTorrents(sid);

    // Filter out slow downloads (< 1 MB/s) unless they're > 90% complete
    // This reduces clutter from stalled/slow downloads
    const MIN_SPEED_BYTES = 1024 * 1024; // 1 MB/s
    const torrents = allTorrents.filter((t) =>
      t.dlspeed >= MIN_SPEED_BYTES || t.progress >= 90
    );

    // Convert to activity items
    const activities: ActivityItem[] = torrents.map((t) => {
      const speed = formatBytes(t.dlspeed) + "/s";
      const eta = formatETA(t.eta);
      const status: "active" | "paused" | "completed" =
        t.state.includes("paused") ? "paused" :
        t.progress >= 100 ? "completed" : "active";

      return {
        type: "qbittorrent",
        title: t.name.length > 40 ? t.name.substring(0, 40) + "..." : t.name,
        subtitle: `${t.progress}% · ${speed} · ETA: ${eta}`,
        progress: t.progress,
        status,
        timestamp: new Date().toISOString(),
        icon: "⬇️",
      };
    });

    return NextResponse.json({
      success: true,
      data: activities,
      torrents,
      totalTorrents: allTorrents.length,
      filteredCount: allTorrents.length - torrents.length,
      source: "qbittorrent",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("qBittorrent API error:", error);
    return NextResponse.json({
      success: false,
      data: [],
      torrents: [],
      source: "mock",
      error: "Failed to fetch torrents",
      timestamp: new Date().toISOString(),
    });
  }
}
