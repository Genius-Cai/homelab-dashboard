"use client";

import useSWR from "swr";

export interface RSSItem {
  id: number;
  title: string;
  url: string;
  source?: string;
  summary?: string;
  isNew: boolean;
  isStarred: boolean;
  publishedAt: string;
}

interface RSSResponse {
  success: boolean;
  data: RSSItem[];
  stats?: {
    total: number;
    new: number;
    starred: number;
  };
  source: string;
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRss(tag: string = "rss", date?: string) {
  const params = new URLSearchParams({ tag });
  if (date) params.append("date", date);
  const url = `/api/rss?${params.toString()}`;

  const { data, error, isLoading } = useSWR<RSSResponse>(url, fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true,
  });

  const items = data?.data || [];
  const starredItems = items.filter((item) => item.isStarred);
  const newItems = items.filter((item) => item.isNew);

  return {
    items,
    starredItems,
    newItems,
    stats: data?.stats || { total: items.length, new: newItems.length, starred: starredItems.length },
    source: data?.source || "loading",
    isLoading,
    error,
  };
}
