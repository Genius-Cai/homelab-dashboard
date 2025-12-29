"use client";

import useSWR from "swr";

export interface JourneyStop {
  time: string;
  location: string;
  icon: string;
  lat: number;
  lon: number;
  isCurrent: boolean;
}

interface JourneyResponse {
  success: boolean;
  data: JourneyStop[];
  stats: {
    totalDistance: number;
    stopCount: number;
    pointCount?: number;
  };
  source: string;
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useJourney() {
  const { data, error, isLoading } = useSWR<JourneyResponse>("/api/dawarich", fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true,
  });

  return {
    stops: data?.data || [],
    totalDistance: data?.stats?.totalDistance || 0,
    stopCount: data?.stats?.stopCount || 0,
    source: data?.source || "loading",
    isLoading,
    error,
  };
}
