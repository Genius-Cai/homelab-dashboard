"use client";

import useSWR from "swr";

export interface ActivityItem {
  type: "jellyfin" | "qbittorrent" | "docker";
  title: string;
  subtitle?: string;
  progress?: number;
  status: "active" | "paused" | "completed";
  timestamp: string;
  icon?: string;
}

interface JellyfinResponse {
  success: boolean;
  data: ActivityItem[];
  source: string;
  timestamp: string;
}

interface QBitResponse {
  success: boolean;
  data: ActivityItem[];
  source: string;
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useActivities() {
  // Fetch Jellyfin sessions
  const {
    data: jellyfinData,
    isLoading: jellyfinLoading,
  } = useSWR<JellyfinResponse>("/api/jellyfin", fetcher, {
    refreshInterval: 10000, // 10 seconds
    revalidateOnFocus: false,
  });

  // Fetch qBittorrent downloads
  const {
    data: qbitData,
    isLoading: qbitLoading,
  } = useSWR<QBitResponse>("/api/qbittorrent", fetcher, {
    refreshInterval: 10000, // 10 seconds
    revalidateOnFocus: false,
  });

  // Combine all activities
  const activities: ActivityItem[] = [
    ...(jellyfinData?.data || []),
    ...(qbitData?.data || []),
  ];

  // Sort by timestamp (most recent first)
  activities.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Separate by type
  const jellyfinActivities = activities.filter((a) => a.type === "jellyfin");
  const qbitActivities = activities.filter((a) => a.type === "qbittorrent");

  // Check if any source is live
  const isLive =
    jellyfinData?.source === "jellyfin" || qbitData?.source === "qbittorrent";

  return {
    activities,
    jellyfinActivities,
    qbitActivities,
    isLoading: jellyfinLoading || qbitLoading,
    isLive,
    jellyfinSource: jellyfinData?.source,
    qbitSource: qbitData?.source,
  };
}
