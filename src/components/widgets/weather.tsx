"use client";

import { useWeather } from "@/hooks/use-weather";

export function Weather() {
  const { data, isLoading, isError } = useWeather();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm font-mono animate-pulse">
        <span className="w-16 h-4 bg-muted rounded" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
        <span>--°C</span>
      </div>
    );
  }

  const weather = data.data;

  return (
    <div className="flex items-center gap-2 text-sm font-mono" title={weather.description}>
      <span>{weather.location}</span>
      <span className="text-lg">{weather.icon}</span>
      <span className="font-bold">{weather.temperature}°C</span>
    </div>
  );
}
