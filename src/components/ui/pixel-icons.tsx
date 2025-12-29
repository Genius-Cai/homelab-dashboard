"use client";

import { cn } from "@/lib/utils";

interface PixelIconProps {
  className?: string;
  size?: number;
}

// Base pixel grid component
const PixelGrid = ({
  pixels,
  size = 16,
  className,
}: {
  pixels: string[];
  size?: number;
  className?: string;
}) => {
  const gridSize = pixels.length;
  const pixelSize = size / gridSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize} ${gridSize}`}
      className={cn("pixel-icon", className)}
      style={{ imageRendering: "pixelated" }}
    >
      {pixels.map((row, y) =>
        row.split("").map((pixel, x) => {
          if (pixel === " " || pixel === ".") return null;
          const color =
            pixel === "#" ? "currentColor" :
            pixel === "G" ? "#22c55e" :
            pixel === "R" ? "#ef4444" :
            pixel === "Y" ? "#eab308" :
            pixel === "B" ? "#3b82f6" :
            pixel === "P" ? "#5046E5" :
            pixel === "W" ? "#ffffff" :
            pixel === "C" ? "#F5F3EE" :
            "currentColor";
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={color}
            />
          );
        })
      )}
    </svg>
  );
};

// Service Status Icons
export function PixelServer({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..####..",
    ".######.",
    ".#....#.",
    ".#.##.#.",
    ".######.",
    ".#....#.",
    ".#.##.#.",
    ".######.",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelDatabase({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..####..",
    ".######.",
    ".######.",
    "..####..",
    "..####..",
    ".######.",
    ".######.",
    "..####..",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelMedia({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "########",
    "#......#",
    "#.###..#",
    "#.###..#",
    "#.###..#",
    "#......#",
    "#......#",
    "########",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelCloud({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "...##...",
    "..####..",
    ".######.",
    "########",
    "########",
    ".######.",
    "........",
    "........",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelCPU({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    ".#.##.#.",
    "########",
    "#.####.#",
    "##....##",
    "##....##",
    "#.####.#",
    "########",
    ".#.##.#.",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelRAM({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "########",
    "#.#.#.##",
    "#.#.#.##",
    "########",
    "#......#",
    "#.####.#",
    "#.#..#.#",
    "########",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelDisk({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..####..",
    ".######.",
    "########",
    "#..##..#",
    "#......#",
    "#..##..#",
    ".######.",
    "..####..",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelGPU({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "########",
    "#GGGG..#",
    "#GGGG..#",
    "########",
    "#.##.##.",
    "#.##.##.",
    "#.##.##.",
    "########",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Status Indicators
export function PixelStatusOnline({ className, size = 8 }: PixelIconProps) {
  const pixels = [
    "..GG..",
    ".GGGG.",
    "GGGGGG",
    "GGGGGG",
    ".GGGG.",
    "..GG..",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelStatusOffline({ className, size = 8 }: PixelIconProps) {
  const pixels = [
    "..RR..",
    ".RRRR.",
    "RRRRRR",
    "RRRRRR",
    ".RRRR.",
    "..RR..",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelStatusWarning({ className, size = 8 }: PixelIconProps) {
  const pixels = [
    "..YY..",
    ".YYYY.",
    "YYYYYY",
    "YYYYYY",
    ".YYYY.",
    "..YY..",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Location Icons for Journey
export function PixelHome({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "...##...",
    "..####..",
    ".######.",
    "########",
    "##.##.##",
    "##.##.##",
    "##....##",
    "##....##",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelCafe({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..####..",
    "..#..#..",
    ".######.",
    ".#....#.",
    ".######.",
    "..####..",
    "...##...",
    "..####..",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelPark({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "...##...",
    "..####..",
    ".######.",
    "########",
    "...##...",
    "...##...",
    "..####..",
    ".######.",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelPin({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..####..",
    ".######.",
    ".##RR##.",
    ".##RR##.",
    ".######.",
    "..####..",
    "...##...",
    "....#...",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Weather Icons
export function PixelSun({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "...Y....",
    "Y..Y..Y.",
    "..YYY...",
    ".YYYYY..",
    "YYYYYYY.",
    ".YYYYY..",
    "..YYY...",
    "Y..Y..Y.",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelCloudSun({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "....YY..",
    "...YYY..",
    "..##YY..",
    ".####...",
    "######..",
    "######..",
    ".####...",
    "........",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelRain({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..####..",
    ".######.",
    "########",
    ".######.",
    "..B..B..",
    ".B..B...",
    "..B..B..",
    ".B..B...",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Market Icons
export function PixelArrowUp({ className, size = 12 }: PixelIconProps) {
  const pixels = [
    "..G...",
    ".GGG..",
    "GGGGG.",
    "..G...",
    "..G...",
    "..G...",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelArrowDown({ className, size = 12 }: PixelIconProps) {
  const pixels = [
    "..R...",
    "..R...",
    "..R...",
    "RRRRR.",
    ".RRR..",
    "..R...",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelBitcoin({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..#.#...",
    ".#####..",
    "#.#.#.#.",
    "#.###...",
    "#.#.#.#.",
    "#.###...",
    ".#####..",
    "..#.#...",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

export function PixelChart({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "........",
    "......#.",
    ".....##.",
    "..#.###.",
    ".##.###.",
    ".##.###.",
    "########",
    "########",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Docker/Container
export function PixelDocker({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "........",
    "..##.##.",
    ".##.##..",
    "########",
    "#BBBBBB#",
    "#BBBBBB#",
    ".######.",
    "........",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Temperature Icon
export function PixelTemp({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "...##...",
    "..#..#..",
    "..#RR#..",
    "..#RR#..",
    "..#RR#..",
    ".#RRRR#.",
    ".#RRRR#.",
    "..####..",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Memory/RAM Icon
export function PixelMemory({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "########",
    "#.#.#.#.",
    "#.#.#.#.",
    "########",
    "#......#",
    "#.####.#",
    "#......#",
    "########",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Better Coffee Icon (not toilet!)
export function PixelCoffee({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..#..#..",
    "...##...",
    ".######.",
    "#......#",
    "#......##",
    "#......#.",
    ".######..",
    "..####...",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Chevron Down
export function PixelChevronDown({ className, size = 12 }: PixelIconProps) {
  const pixels = [
    "........",
    "########",
    ".######.",
    "..####..",
    "...##...",
    "........",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Chevron Up
export function PixelChevronUp({ className, size = 12 }: PixelIconProps) {
  const pixels = [
    "........",
    "...##...",
    "..####..",
    ".######.",
    "########",
    "........",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Calendar Icon
export function PixelCalendar({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    ".#.##.#.",
    "########",
    "#......#",
    "#.####.#",
    "#.#..#.#",
    "#.####.#",
    "#......#",
    "########",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Claude AI Logo (Anthropic spark shape) - Coral/Orange
export function PixelClaude({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "...##...",
    "...##...",
    "#..##..#",
    "########",
    "########",
    "#..##..#",
    "...##...",
    "...##...",
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      className={cn("pixel-icon", className)}
      style={{ imageRendering: "pixelated" }}
    >
      {pixels.map((row, y) =>
        row.split("").map((pixel, x) => {
          if (pixel === "." || pixel === " ") return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="#D97757"
            />
          );
        })
      )}
    </svg>
  );
}

// ChatGPT Logo (OpenAI) - Green
export function PixelChatGPT({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..####..",
    ".#....#.",
    "#..##..#",
    "#.#..#.#",
    "#.#..#.#",
    "#..##..#",
    ".#....#.",
    "..####..",
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      className={cn("pixel-icon", className)}
      style={{ imageRendering: "pixelated" }}
    >
      {pixels.map((row, y) =>
        row.split("").map((pixel, x) => {
          if (pixel === "." || pixel === " ") return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="#10A37F"
            />
          );
        })
      )}
    </svg>
  );
}

// GitHub Logo (Octocat silhouette)
export function PixelGitHub({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "..####..",
    ".######.",
    "##.##.##",
    "########",
    "########",
    ".##..##.",
    ".#.##.#.",
    "..#..#..",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}

// Rocket Icon
export function PixelRocket({ className, size = 16 }: PixelIconProps) {
  const pixels = [
    "...##...",
    "..####..",
    ".######.",
    ".##RR##.",
    ".##RR##.",
    "##.##.##",
    "#..##..#",
    "...##...",
  ];
  return <PixelGrid pixels={pixels} size={size} className={className} />;
}
