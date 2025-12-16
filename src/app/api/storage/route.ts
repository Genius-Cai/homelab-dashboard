import { NextResponse } from "next/server";

// ZFS Pool data from PVE API

interface StoragePool {
  name: string;
  used: number;  // TB
  total: number; // TB
  status: "healthy" | "degraded" | "error";
  type: string;
}

// PVE API configuration
const PVE_HOST = process.env.PVE_HOST || "192.168.50.200";
const PVE_USER = process.env.PVE_USER || "root@pam";
const PVE_PASSWORD = process.env.PVE_PASSWORD || "Shangzhensteven2024!";

// Custom fetch that ignores SSL certificate errors
async function fetchWithSSLBypass(url: string, options: RequestInit = {}) {
  // In Node.js, we need to use the agent option
  // For Next.js API routes, we can set NODE_TLS_REJECT_UNAUTHORIZED
  return fetch(url, {
    ...options,
    // @ts-ignore - Next.js specific
    next: { revalidate: 30 },
  });
}

async function getPVETicket(): Promise<{ ticket: string; csrf: string } | null> {
  try {
    // Use HTTP to avoid SSL issues, or configure proper SSL handling
    const response = await fetch(`https://${PVE_HOST}:8006/api2/json/access/ticket`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(PVE_USER)}&password=${encodeURIComponent(PVE_PASSWORD)}`,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("PVE auth failed:", response.status);
      return null;
    }
    const data = await response.json();
    return {
      ticket: data.data.ticket,
      csrf: data.data.CSRFPreventionToken,
    };
  } catch (error) {
    console.error("PVE auth error:", error);
    return null;
  }
}

async function getZFSPools(ticket: string): Promise<StoragePool[]> {
  try {
    // Get ZFS pool info directly from PVE
    const response = await fetch(`https://${PVE_HOST}:8006/api2/json/nodes/pve/disks/zfs`, {
      headers: {
        Cookie: `PVEAuthCookie=${ticket}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("ZFS API failed:", response.status);
      return [];
    }

    const data = await response.json();

    // Convert bytes to TB and format
    return data.data.map((pool: any) => ({
      name: pool.name.toUpperCase(),
      used: Number((pool.alloc / 1024 / 1024 / 1024 / 1024).toFixed(2)),
      total: Number((pool.size / 1024 / 1024 / 1024 / 1024).toFixed(2)),
      status: pool.health === "ONLINE" ? "healthy" : "degraded",
      type: pool.name === "tank" ? "media/docker" : "backup/archive",
    }));
  } catch (error) {
    console.error("ZFS pools fetch error:", error);
    return [];
  }
}

// Fallback mock data
const mockPools: StoragePool[] = [
  { name: "TANK", used: 14.2, total: 27.3, status: "healthy", type: "media/docker" },
  { name: "COLD", used: 8.5, total: 14.5, status: "healthy", type: "backup/archive" },
];

export async function GET() {
  try {
    // Try to get real data from PVE API
    const ticket = await getPVETicket();

    if (ticket) {
      const pools = await getZFSPools(ticket.ticket);
      if (pools.length > 0) {
        return NextResponse.json({
          success: true,
          data: pools,
          source: "pve",
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Fallback to mock data
    return NextResponse.json({
      success: true,
      data: mockPools,
      source: "mock",
      message: "Using mock data - PVE API not available",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Storage API error:", error);
    return NextResponse.json({
      success: false,
      data: mockPools,
      source: "mock",
      error: "Failed to fetch storage data",
      timestamp: new Date().toISOString(),
    });
  }
}
