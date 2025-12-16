"use client";

import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  location: string;
}

interface WeatherResponse {
  success: boolean;
  data: WeatherData;
  timestamp: string;
}

export function useWeather() {
  return useQuery<WeatherResponse>({
    queryKey: ["weather"],
    queryFn: async () => {
      const response = await fetch("/api/weather");
      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
