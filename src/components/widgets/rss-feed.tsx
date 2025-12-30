"use client";

import { useState } from "react";
import { useRss, RSSItem } from "@/hooks/use-rss";

// Pixel satellite icon
function PixelSatellite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor">
      <rect x="7" y="1" width="2" height="2" />
      <rect x="6" y="3" width="4" height="2" />
      <rect x="5" y="5" width="6" height="3" />
      <rect x="3" y="6" width="2" height="2" />
      <rect x="11" y="6" width="2" height="2" />
      <rect x="7" y="8" width="2" height="3" />
      <rect x="5" y="11" width="2" height="2" />
      <rect x="9" y="11" width="2" height="2" />
      <rect x="4" y="13" width="2" height="2" />
      <rect x="10" y="13" width="2" height="2" />
    </svg>
  );
}

// Pixel graduation cap icon
function PixelGrad({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor">
      <rect x="1" y="6" width="14" height="2" />
      <rect x="3" y="4" width="10" height="2" />
      <rect x="6" y="2" width="4" height="2" />
      <rect x="4" y="8" width="8" height="4" />
      <rect x="3" y="12" width="2" height="2" />
      <rect x="11" y="12" width="2" height="2" />
      <rect x="12" y="8" width="2" height="5" />
      <rect x="13" y="10" width="2" height="4" />
    </svg>
  );
}

function NoteItem({ item, isCourse, showScore }: { item: RSSItem; isCourse?: boolean; showScore?: boolean }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-xs cursor-pointer hover:bg-primary/10 p-1 -mx-1 transition-colors group"
    >
      <span className={item.isNew ? (isCourse ? "text-warning" : "text-primary") : "text-muted-foreground/50"}>
        {item.isNew ? "●" : "○"}
      </span>
      {showScore && item.score && (
        <span className="text-[9px] font-mono text-muted-foreground shrink-0">{item.score}</span>
      )}
      <span className="truncate flex-1 group-hover:underline">{item.title}</span>
      {item.isNew && (
        <span className={`text-[9px] px-1 font-bold shrink-0 ${isCourse ? "bg-warning text-warning-foreground" : "bg-primary text-primary-foreground"}`}>
          NEW
        </span>
      )}
    </a>
  );
}

type TabType = "rss" | "course";

export function RSSFeed() {
  const [activeTab, setActiveTab] = useState<TabType>("rss");
  const [expanded, setExpanded] = useState(false);

  // Fetch both RSS and Course data
  const rssData = useRss("rss");
  const courseData = useRss("course");

  const currentData = activeTab === "rss" ? rssData : courseData;
  const { items, stats, source, isLoading } = currentData;

  // Show 6 items normally, all when expanded
  const displayCount = expanded ? items.length : 6;
  const displayItems = items.slice(0, displayCount);

  const tabs: { key: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "rss", label: "RSS", icon: <PixelSatellite className="w-4 h-4 inline-block align-middle" />, color: "text-primary" },
    { key: "course", label: "COURSE", icon: <PixelGrad className="w-4 h-4 inline-block align-middle" />, color: "text-warning" },
  ];

  return (
    <div className="p-4 bg-primary/5 border-l-4 border-primary relative h-full">
      {/* Corner fold effect */}
      <div
        className="absolute top-0 right-0 w-6 h-6 bg-primary/10"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />

      {/* Tab Header */}
      <div className="flex items-center gap-3 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setExpanded(false); }}
            className={`text-xs font-black tracking-wider transition-all flex items-center gap-1 ${
              activeTab === tab.key
                ? tab.color
                : "text-muted-foreground/50 hover:text-muted-foreground"
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.key && (
              <span className="text-[10px] font-mono">
                [{stats.new > 0 ? stats.new : stats.total}]
              </span>
            )}
          </button>
        ))}

        {source === "blinko" && (
          <span className="text-[9px] text-success font-mono ml-auto">● LIVE</span>
        )}
      </div>

      {/* Content */}
      <div className={`space-y-1.5 ${expanded ? "max-h-64 overflow-y-auto" : ""}`}>
        {isLoading ? (
          <div className="text-xs text-muted-foreground italic">Loading...</div>
        ) : displayItems.length > 0 ? (
          displayItems.map((item) => (
            <NoteItem key={item.id} item={item} isCourse={activeTab === "course"} showScore={expanded} />
          ))
        ) : (
          <div className="text-xs text-muted-foreground italic">
            {activeTab === "course" ? "No course notifications" : "No RSS items"}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-border/30 flex justify-between text-[10px] font-mono text-muted-foreground">
        <span>
          [{stats.total} items · {stats.new} new]
        </span>
        {items.length > 6 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary cursor-pointer hover:underline"
          >
            {expanded ? "collapse ↑" : "view all →"}
          </button>
        )}
      </div>
    </div>
  );
}
