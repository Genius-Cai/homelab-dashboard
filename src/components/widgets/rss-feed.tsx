"use client";

import { useState } from "react";
import { useRss, RSSItem } from "@/hooks/use-rss";

function NoteItem({ item, isCourse }: { item: RSSItem; isCourse?: boolean }) {
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

  // Fetch both RSS and Course data
  const rssData = useRss("rss");
  const courseData = useRss("course");

  const currentData = activeTab === "rss" ? rssData : courseData;
  const { items, stats, source, isLoading } = currentData;

  // Show top 4 items (prioritize starred and new)
  const displayItems = items.slice(0, 4);

  const tabs: { key: TabType; label: string; icon: string; color: string }[] = [
    { key: "rss", label: "RSS", icon: "📡", color: "text-primary" },
    { key: "course", label: "COURSE", icon: "🎓", color: "text-warning" },
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
            onClick={() => setActiveTab(tab.key)}
            className={`text-xs font-black tracking-wider transition-all ${
              activeTab === tab.key
                ? tab.color
                : "text-muted-foreground/50 hover:text-muted-foreground"
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.key && (
              <span className="ml-1 text-[10px] font-mono">
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
      <div className="space-y-1.5">
        {isLoading ? (
          <div className="text-xs text-muted-foreground italic">Loading...</div>
        ) : displayItems.length > 0 ? (
          displayItems.map((item) => (
            <NoteItem key={item.id} item={item} isCourse={activeTab === "course"} />
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
        <span className="text-primary cursor-pointer hover:underline">view all →</span>
      </div>
    </div>
  );
}
