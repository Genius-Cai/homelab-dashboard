"use client";

import { useQuery } from "@tanstack/react-query";

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change24h?: number;
  change?: number;
  type: "crypto" | "stock";
}

interface MarketsResponse {
  success: boolean;
  data: MarketItem[];
  timestamp: string;
}

export function useMarkets() {
  return useQuery<MarketsResponse>({
    queryKey: ["markets"],
    queryFn: async () => {
      const response = await fetch("/api/markets");
      if (!response.ok) {
        throw new Error("Failed to fetch markets");
      }
      return response.json();
    },
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  });
}

// Helper to format price
export function formatPrice(price: number, symbol: string): string {
  if (symbol === "BTC") {
    return `$${(price / 1000).toFixed(1)}k`;
  }
  if (price >= 1000) {
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  return `$${price.toFixed(2)}`;
}

// Helper to get change percentage
export function getChange(item: MarketItem): number {
  return item.change24h ?? item.change ?? 0;
}
