"use client";

import useSWR from "swr";

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

interface SystemsResponse {
  success: boolean;
  data: SystemData[];
  source: string;
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSystems() {
  const { data, error, isLoading, mutate } = useSWR<SystemsResponse>(
    "/api/beszel",
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    systems: data?.data || [],
    isLoading,
    isError: !!error,
    source: data?.source,
    refresh: mutate,
  };
}
