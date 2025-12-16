import { NextResponse } from "next/server";

interface Monitor {
  id: number;
  name: string;
  status: boolean; // true = up, false = down
  uptime: number;  // percentage
  responseTime: number; // ms
}

interface UptimeResponse {
  success: boolean;
  data: Monitor[];
  source: string;
  timestamp: string;
}

// Uptime Kuma Status Page API
const UPTIME_KUMA_URL = process.env.UPTIME_KUMA_URL || "http://192.168.50.80:3003";
const STATUS_PAGE_SLUG = "homelab";

// Service name mapping from Uptime Kuma to our dashboard
const serviceNameMapping: Record<string, string> = {
  "jellyfin": "Jellyfin",
  "sonarr": "Sonarr",
  "radarr": "Radarr",
  "ollama": "Ollama",
  "comfyui": "ComfyUI",
  "n8n": "n8n",
  "portainer": "Portainer",
  "adguard": "AdGuard",
  "prowlarr": "Prowlarr",
  "bazarr": "Bazarr",
  "qbittorrent": "qBittorrent",
  "qbit": "qBittorrent",
  "jellyseerr": "Jellyseerr",
  "freshrss": "FreshRSS",
  "uptime kuma": "Uptime Kuma",
  "uptime": "Uptime Kuma",
  "beszel": "Beszel",
  "dawarich": "Dawarich",
  "blinko": "Blinko",
  "forgejo": "Forgejo",
  "gitea": "Forgejo",
  "open webui": "Open WebUI",
  "chat": "Open WebUI",
  "dozzle": "Dozzle",
  "syncthing": "Syncthing",
  "mt photos": "MT Photos",
  "photos": "MT Photos",
  "reactive resume": "Reactive Resume",
  "resume": "Reactive Resume",
};

function normalizeServiceName(name: string): string {
  const lowerName = name.toLowerCase();
  return serviceNameMapping[lowerName] || name;
}

async function fetchUptimeKumaStatus(): Promise<Monitor[]> {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    // Uptime Kuma public status page API
    const response = await fetch(
      `${UPTIME_KUMA_URL}/api/status-page/${STATUS_PAGE_SLUG}`,
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Uptime Kuma API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Parse the status page response
    // Structure: { config: {...}, incident: [...], publicGroupList: [...] }
    const monitors: Monitor[] = [];

    if (data.publicGroupList) {
      for (const group of data.publicGroupList) {
        if (group.monitorList) {
          for (const monitor of group.monitorList) {
            monitors.push({
              id: monitor.id,
              name: normalizeServiceName(monitor.name),
              status: monitor.status === 1, // 1 = up, 0 = down, 2 = pending
              uptime: monitor.uptime24 || monitor.uptime || 100,
              responseTime: monitor.avgPing || 0,
            });
          }
        }
      }
    }

    return monitors;
  } catch (error) {
    console.error("Failed to fetch Uptime Kuma status:", error);
    return [];
  }
}

// Alternative: Try the heartbeat API if status page doesn't work
async function fetchUptimeKumaHeartbeat(): Promise<Monitor[]> {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    // Try to get data from the metrics endpoint (if enabled)
    const response = await fetch(
      `${UPTIME_KUMA_URL}/metrics`,
      {
        headers: {
          "Accept": "text/plain",
        },
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const monitors: Monitor[] = [];

    // Parse Prometheus metrics format
    const lines = text.split("\n");
    const statusMap = new Map<string, { name: string; status: boolean; responseTime: number }>();

    for (const line of lines) {
      // monitor_status{monitor_name="xxx",monitor_type="xxx"} 1
      const statusMatch = line.match(/monitor_status\{monitor_name="([^"]+)".*\}\s+(\d+)/);
      if (statusMatch) {
        const [, name, status] = statusMatch;
        statusMap.set(name, {
          name: normalizeServiceName(name),
          status: status === "1",
          responseTime: 0,
        });
      }

      // monitor_response_time{...} 123
      const rtMatch = line.match(/monitor_response_time\{monitor_name="([^"]+)".*\}\s+([\d.]+)/);
      if (rtMatch) {
        const [, name, rt] = rtMatch;
        const existing = statusMap.get(name);
        if (existing) {
          existing.responseTime = parseFloat(rt);
        }
      }
    }

    let id = 1;
    for (const [, data] of statusMap) {
      monitors.push({
        id: id++,
        name: data.name,
        status: data.status,
        uptime: data.status ? 100 : 0,
        responseTime: data.responseTime,
      });
    }

    return monitors;
  } catch (error) {
    console.error("Failed to fetch Uptime Kuma metrics:", error);
    return [];
  }
}

// Mock data fallback (matches services in services-card.tsx)
const mockMonitors: Monitor[] = [
  { id: 1, name: "Jellyfin", status: true, uptime: 99.9, responseTime: 45 },
  { id: 2, name: "Sonarr", status: true, uptime: 99.8, responseTime: 32 },
  { id: 3, name: "Radarr", status: true, uptime: 99.9, responseTime: 28 },
  { id: 4, name: "Ollama", status: true, uptime: 98.5, responseTime: 120 },
  { id: 5, name: "ComfyUI", status: false, uptime: 0, responseTime: 0 },
  { id: 6, name: "n8n", status: true, uptime: 99.9, responseTime: 35 },
  { id: 7, name: "Portainer", status: true, uptime: 100, responseTime: 22 },
  { id: 8, name: "AdGuard", status: true, uptime: 100, responseTime: 15 },
  { id: 9, name: "Prowlarr", status: true, uptime: 99.7, responseTime: 40 },
  { id: 10, name: "Bazarr", status: true, uptime: 99.8, responseTime: 38 },
  { id: 11, name: "qBittorrent", status: true, uptime: 99.5, responseTime: 25 },
  { id: 12, name: "Jellyseerr", status: true, uptime: 99.9, responseTime: 30 },
  { id: 13, name: "FreshRSS", status: true, uptime: 99.8, responseTime: 42 },
  { id: 14, name: "Uptime Kuma", status: true, uptime: 100, responseTime: 12 },
  { id: 15, name: "Beszel", status: true, uptime: 99.9, responseTime: 18 },
  { id: 16, name: "Dawarich", status: true, uptime: 99.5, responseTime: 55 },
  { id: 17, name: "Blinko", status: true, uptime: 99.9, responseTime: 20 },
  { id: 18, name: "Forgejo", status: true, uptime: 99.8, responseTime: 35 },
  { id: 19, name: "Open WebUI", status: true, uptime: 99.7, responseTime: 48 },
  { id: 20, name: "Dozzle", status: true, uptime: 100, responseTime: 15 },
  { id: 21, name: "Syncthing", status: true, uptime: 99.9, responseTime: 22 },
  { id: 22, name: "MT Photos", status: true, uptime: 99.8, responseTime: 85 },
  { id: 23, name: "Reactive Resume", status: true, uptime: 99.5, responseTime: 40 },
];

export async function GET(): Promise<NextResponse<UptimeResponse>> {
  try {
    // Try status page API first
    let monitors = await fetchUptimeKumaStatus();

    // If empty, try metrics endpoint
    if (monitors.length === 0) {
      monitors = await fetchUptimeKumaHeartbeat();
    }

    // Return real data if available, otherwise mock
    if (monitors.length > 0) {
      return NextResponse.json({
        success: true,
        data: monitors,
        source: "uptime-kuma",
        timestamp: new Date().toISOString(),
      });
    }

    // Fallback to mock data
    return NextResponse.json({
      success: true,
      data: mockMonitors,
      source: "mock",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Uptime API error:", error);
    return NextResponse.json({
      success: false,
      data: mockMonitors,
      source: "mock",
      timestamp: new Date().toISOString(),
    });
  }
}
