"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Pixel-style Sun icon
function PixelSun({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-warning"
    >
      {/* Center */}
      <rect x="6" y="6" width="4" height="4" />
      {/* Rays */}
      <rect x="7" y="2" width="2" height="2" />
      <rect x="7" y="12" width="2" height="2" />
      <rect x="2" y="7" width="2" height="2" />
      <rect x="12" y="7" width="2" height="2" />
      {/* Diagonal rays */}
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
    </svg>
  );
}

// Pixel sparkle star - diamond shape with 4 points
function PixelStar({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
    >
      {/* Black outline */}
      <rect x="7" y="0" width="2" height="1" fill="currentColor" className="text-foreground" />
      <rect x="7" y="1" width="2" height="1" fill="currentColor" className="text-foreground" />
      <rect x="6" y="3" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="9" y="3" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="5" y="4" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="10" y="4" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="4" y="5" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="11" y="5" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="0" y="7" width="4" height="2" fill="currentColor" className="text-foreground" />
      <rect x="12" y="7" width="4" height="2" fill="currentColor" className="text-foreground" />
      <rect x="4" y="10" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="11" y="10" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="5" y="11" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="10" y="11" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="6" y="12" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="9" y="12" width="1" height="1" fill="currentColor" className="text-foreground" />
      <rect x="7" y="14" width="2" height="2" fill="currentColor" className="text-foreground" />

      {/* Yellow/gold fill */}
      <rect x="7" y="2" width="2" height="2" fill="#F4D35E" />
      <rect x="6" y="4" width="4" height="1" fill="#F4D35E" />
      <rect x="5" y="5" width="6" height="1" fill="#F4D35E" />
      <rect x="4" y="6" width="8" height="1" fill="#F4D35E" />
      <rect x="4" y="7" width="8" height="2" fill="#F4D35E" />
      <rect x="4" y="9" width="8" height="1" fill="#F4D35E" />
      <rect x="5" y="10" width="6" height="1" fill="#F4D35E" />
      <rect x="6" y="11" width="4" height="1" fill="#F4D35E" />
      <rect x="7" y="12" width="2" height="2" fill="#F4D35E" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-3 py-1.5 border-2 border-border bg-muted/30 flex items-center justify-center">
        <div className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-3 py-1.5 border-2 border-border bg-muted/30 hover:bg-accent/50 transition-colors flex items-center justify-center"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <PixelSun size={14} /> : <PixelStar size={14} />}
    </button>
  );
}
