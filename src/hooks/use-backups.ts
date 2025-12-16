"use client";

import useSWR from "swr";

interface BackupInfo {
  name: string;
  lastRun: string;
  status: "success" | "failed" | "running";
  size: string;
  isRunning: boolean;
  progress: number;
}

interface BackupsResponse {
  success: boolean;
  data: BackupInfo[];
  source: string;
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBackups() {
  const { data, error, isLoading, mutate } = useSWR<BackupsResponse>(
    "/api/backups",
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    backups: data?.data || [],
    isLoading,
    isError: !!error,
    source: data?.source,
    refresh: mutate,
  };
}
