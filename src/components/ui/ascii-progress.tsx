"use client";

import { cn } from "@/lib/utils";

interface ASCIIProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  unit?: string;
  className?: string;
}

export function ASCIIProgress({
  value,
  max = 100,
  size = "md",
  showPercentage = true,
  unit = "%",
  className,
}: ASCIIProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Different bar lengths based on size
  const barLength = size === "sm" ? 8 : size === "lg" ? 16 : 10;
  const filled = Math.round((percentage / 100) * barLength);
  const empty = barLength - filled;

  // Color based on threshold
  const getColorClass = () => {
    if (percentage > 85) return "text-destructive";
    if (percentage > 70) return "text-warning";
    return "text-success";
  };

  // Characters for the bar
  const filledChar = "█";
  const emptyChar = "░";

  // Display value - use actual value for non-percentage units
  const displayValue = unit === "%" ? percentage.toFixed(0) : value.toString();

  return (
    <span className={cn("font-mono", className)}>
      <span className="text-muted-foreground">[</span>
      <span className={getColorClass()}>
        {filledChar.repeat(filled)}
      </span>
      <span className="text-muted-foreground/50">
        {emptyChar.repeat(empty)}
      </span>
      <span className="text-muted-foreground">]</span>
      {showPercentage && (
        <span className={cn("ml-2 tabular-nums", getColorClass())}>
          {displayValue.padStart(3, " ")}{unit}
        </span>
      )}
    </span>
  );
}

// Compact inline version
export function ASCIIProgressInline({
  value,
  max = 100,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const filled = Math.round((percentage / 100) * 6);
  const empty = 6 - filled;

  const getColorClass = () => {
    if (percentage > 85) return "text-destructive";
    if (percentage > 70) return "text-warning";
    return "text-success";
  };

  return (
    <span className={cn("font-mono text-xs", getColorClass(), className)}>
      {"▓".repeat(filled)}{"░".repeat(empty)}
    </span>
  );
}
