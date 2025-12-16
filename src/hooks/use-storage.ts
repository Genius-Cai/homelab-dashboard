"use client";

import useSWR from "swr";

interface StoragePool {
  name: string;
  used: number;
  total: number;
  status: "healthy" | "degraded" | "error";
  type: string;
}

interface StorageResponse {
  success: boolean;
  data: StoragePool[];
  source: string;
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStorage() {
  const { data, error, isLoading, mutate } = useSWR<StorageResponse>(
    "/api/storage",
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    pools: data?.data || [],
    isLoading,
    isError: !!error,
    source: data?.source,
    refresh: mutate,
  };
}
