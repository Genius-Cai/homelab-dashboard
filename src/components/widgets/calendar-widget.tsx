"use client";

import { useEffect, useState } from "react";
import { PixelCalendar } from "@/components/ui/pixel-icons";

export function CalendarWidget() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    // Update every minute
    const interval = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <div className="text-6xl font-black tabular-nums">--</div>
        <div className="text-sm text-muted-foreground font-bold">---</div>
      </div>
    );
  }

  const day = date.getDate();
  const weekday = date.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();

  // Get current day of week (0 = Sunday)
  const currentDayOfWeek = date.getDay();
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="flex flex-col h-full">
      {/* Month Header - Pixel Style */}
      <div className="border-2 border-border bg-primary text-primary-foreground px-3 py-1.5 text-center">
        <div className="text-xs font-black tracking-[0.3em]">{month} {year}</div>
      </div>

      {/* Large Day Number */}
      <div className="flex-1 flex flex-col items-center justify-center border-x-2 border-border bg-background py-6">
        <div className="relative">
          {/* Pixel shadow effect */}
          <div
            className="text-7xl font-black tabular-nums leading-none text-primary"
            style={{
              textShadow: "3px 3px 0 var(--border)",
              letterSpacing: "-0.05em"
            }}
          >
            {day.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-bold mt-2 tracking-[0.2em]">
          {weekday}
        </div>
      </div>

      {/* Mini Week View */}
      <div className="grid grid-cols-7 border-2 border-t-0 border-border">
        {weekDays.map((d, i) => (
          <div
            key={i}
            className={`
              text-center text-xs font-mono py-1.5 border-r border-border last:border-r-0
              ${i === currentDayOfWeek
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground"
              }
            `}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono">
        <PixelCalendar size={12} />
        <span>WEEK {getWeekNumber(date)}</span>
      </div>
    </div>
  );
}

// Get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
