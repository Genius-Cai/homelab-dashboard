"use client";

import { Badge } from "@/components/ui/badge";

// Mock data - will come from FreshRSS API later
const rssItems = [
  { id: 1, title: "新技术发布：Next.js 16", isNew: true },
  { id: 2, title: "Claude 4.5 发布", isNew: true },
  { id: 3, title: "Docker 最佳实践", isNew: false },
  { id: 4, title: "Homelab 搭建指南", isNew: false },
];

export function RSSWidget() {
  const newCount = rssItems.filter((item) => item.isNew).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-foreground/50">//</span>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          RSS FEED
        </span>
        {newCount > 0 && (
          <Badge variant="default" className="text-[10px] px-1 ml-auto">
            {newCount} NEW
          </Badge>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 space-y-1 overflow-hidden">
        {rssItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent/50 p-1 -mx-1 transition-colors truncate"
          >
            <span className={item.isNew ? "text-primary" : "text-muted-foreground"}>
              {item.isNew ? "●" : "○"}
            </span>
            <span className="truncate flex-1">{item.title}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 mt-auto border-t border-border/50">
        <p className="text-[10px] text-muted-foreground font-mono">
          [★ starred items]
        </p>
      </div>
    </div>
  );
}
