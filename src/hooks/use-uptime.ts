"use client";

import useSWR from "swr";

interface Monitor {
  id: number;
  name: string;
  status: boolean;
  uptime: number;
  responseTime: number;
}

interface UptimeResponse {
  success: boolean;
  data: Monitor[];
  source: string;
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUptime() {
  const { data, error, isLoading, mutate } = useSWR<UptimeResponse>(
    "/api/uptime",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
    }
  );

  // Create a map for easy lookup by service name
  const monitorMap = new Map<string, Monitor>();
  if (data?.data) {
    for (const monitor of data.data) {
      monitorMap.set(monitor.name, monitor);
    }
  }

  return {
    data,
    monitors: data?.data || [],
    monitorMap,
    isLoading,
    isError: !!error,
    source: data?.source,
    refresh: mutate,
    // Helper function to get status for a specific service
    getServiceStatus: (serviceName: string): "online" | "offline" => {
      const monitor = monitorMap.get(serviceName);
      return monitor?.status ? "online" : "offline";
    },
  };
}
