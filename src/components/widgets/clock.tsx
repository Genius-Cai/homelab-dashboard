"use client";

import { useEffect, useState } from "react";
import {
  PixelSun,
  PixelCloudSun,
  PixelRain,
  PixelCloud,
} from "@/components/ui/pixel-icons";

export function Clock() {
  const [time, setTime] = useState<string>("--:--:--");
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-AU", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Fetch weather (Sydney)
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-33.8688&longitude=151.2093&current=temperature_2m,weather_code"
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
        });
      })
      .catch(() => setWeather(null));

    return () => clearInterval(interval);
  }, []);

  // Get pixel weather icon based on WMO code
  const WeatherIcon = () => {
    if (!weather) return null;
    const code = weather.code;

    if (code === 0) return <PixelSun size={20} />;
    if (code >= 1 && code <= 3) return <PixelCloudSun size={20} />;
    if (code >= 45 && code <= 48) return <PixelCloud size={20} />;
    if (code >= 51 && code <= 67) return <PixelRain size={20} />;
    if (code >= 71 && code <= 77) return <PixelCloud size={20} />;
    if (code >= 80 && code <= 82) return <PixelRain size={20} />;
    if (code >= 95) return <PixelRain size={20} />;
    return <PixelCloudSun size={20} />;
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-3 text-sm font-mono">
        <div className="flex items-center border-2 border-border px-3 py-1 bg-muted/30">
          <span>--:--:--</span>
        </div>
        <span className="text-muted-foreground">Sydney</span>
        <span>--°C</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm font-mono">
      {/* Time */}
      <div className="flex items-center border-2 border-border px-3 py-1 bg-muted/30">
        <span className="font-bold tabular-nums tracking-wider">{time}</span>
      </div>

      {/* Weather */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Sydney</span>
        {weather ? (
          <>
            <span className="font-bold">{weather.temp}°C</span>
            <WeatherIcon />
          </>
        ) : (
          <span>--°C</span>
        )}
      </div>
    </div>
  );
}
