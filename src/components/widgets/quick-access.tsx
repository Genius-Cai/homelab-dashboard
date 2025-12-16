"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Service categories
const categories = [
  {
    name: "常用",
    services: [
      { name: "Blinko", url: "http://192.168.50.80:1111", icon: "📝", hot: true },
      { name: "MT Photos", url: "http://192.168.50.184:8063", icon: "📷" },
      { name: "Open WebUI", url: "http://192.168.50.80:8085", icon: "🤖", hot: true },
    ],
  },
  {
    name: "媒体",
    services: [
      { name: "Jellyseerr", url: "http://jellyseerr.home.local", icon: "🎬" },
      { name: "Jellyfin", url: "http://jellyfin.home.local", icon: "📺" },
      { name: "qBit", url: "http://qbit.home.local", icon: "⬇️" },
    ],
  },
  {
    name: "开发",
    services: [
      { name: "Forgejo", url: "http://192.168.50.100:3030", icon: "💻" },
      { name: "n8n", url: "http://n8n.home.local", icon: "⚡" },
      { name: "Portainer", url: "http://portainer.home.local", icon: "🐳" },
    ],
  },
];

// Recent activities mock data
const recentActivities = [
  { action: "Jellyfin", detail: "正在播放 · 绝命毒师 S5E12", time: "now" },
  { action: "qBit", detail: "下载完成 · Ubuntu 24.04.iso", time: "5m" },
];

export function QuickAccess() {
  const totalServices = categories.reduce((acc, cat) => acc + cat.services.length, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground/50">//</span>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          QUICK ACCESS
        </span>
        <span className="text-xs text-muted-foreground/50 font-mono">
          [{totalServices} services]
        </span>
      </div>

      {/* All Services - Flat Grid */}
      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5 content-start">
          {categories.flatMap((category) =>
            category.services.map((service) => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-7 px-2 text-xs group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all relative"
                >
                  <span>{service.icon}</span>
                  <span>{service.name}</span>
                  {service.hot && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </Button>
              </a>
            ))
          )}
        </div>

        {/* Recent Activity - Below services */}
        <div className="mt-3 pt-2 border-t border-border/30">
          <div className="flex gap-4">
            {recentActivities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs"
              >
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shrink-0" />
                <span className="font-medium">{activity.action}</span>
                <span className="text-muted-foreground">{activity.detail}</span>
                <span className="text-[10px] text-muted-foreground/50">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
