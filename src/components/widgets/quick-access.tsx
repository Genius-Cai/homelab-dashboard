"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Service configuration with local and external URLs
interface QuickService {
  name: string;
  localUrl: string;
  externalUrl: string;
  icon: string;
  hot?: boolean;
}

// Service categories with dual URLs
const categories: { name: string; services: QuickService[] }[] = [
  {
    name: "常用",
    services: [
      { name: "Blinko", localUrl: "http://blinko.home.local", externalUrl: "https://blinko.geniuscai.com", icon: "📝", hot: true },
      { name: "MT Photos", localUrl: "http://photos.home.local", externalUrl: "https://photos.geniuscai.com", icon: "📷" },
      { name: "Open WebUI", localUrl: "http://chat.home.local", externalUrl: "https://chat.geniuscai.com", icon: "🤖", hot: true },
    ],
  },
  {
    name: "媒体",
    services: [
      { name: "Jellyseerr", localUrl: "http://jellyseerr.home.local", externalUrl: "https://jellyseerr.geniuscai.com", icon: "🎬" },
      { name: "Jellyfin", localUrl: "http://jellyfin.home.local", externalUrl: "https://jellyfin.geniuscai.com", icon: "📺" },
      { name: "qBit", localUrl: "http://qbit.home.local", externalUrl: "https://qbit.geniuscai.com", icon: "⬇️" },
    ],
  },
  {
    name: "开发",
    services: [
      { name: "Forgejo", localUrl: "http://gitea.home.local", externalUrl: "https://gitea.geniuscai.com", icon: "💻" },
      { name: "n8n", localUrl: "http://n8n.home.local", externalUrl: "https://n8n.geniuscai.com", icon: "⚡" },
      { name: "Portainer", localUrl: "http://portainer.home.local", externalUrl: "https://portainer.geniuscai.com", icon: "🐳" },
    ],
  },
];

// Hook to detect if we're on local network
function useIsLocalNetwork() {
  const [isLocal, setIsLocal] = useState<boolean | null>(null);

  useEffect(() => {
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";

    if (hostname.includes("home.local") || hostname.includes("192.168.") || hostname === "localhost") {
      setIsLocal(true);
    } else if (hostname.includes("geniuscai.com")) {
      setIsLocal(false);
    } else {
      setIsLocal(true); // Default to local for development
    }
  }, []);

  return isLocal;
}

// Recent activities mock data
const recentActivities = [
  { action: "Jellyfin", detail: "正在播放 · 绝命毒师 S5E12", time: "now" },
  { action: "qBit", detail: "下载完成 · Ubuntu 24.04.iso", time: "5m" },
];

export function QuickAccess() {
  const totalServices = categories.reduce((acc, cat) => acc + cat.services.length, 0);
  const isLocalNetwork = useIsLocalNetwork();

  // Get appropriate URL based on network location
  const getUrl = (service: QuickService) =>
    isLocalNetwork ?? true ? service.localUrl : service.externalUrl;

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
                href={getUrl(service)}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                title={getUrl(service)}
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
