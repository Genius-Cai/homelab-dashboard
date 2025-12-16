"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useActivities } from "@/hooks/use-activities";

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

export function QuickAccess() {
  const totalServices = categories.reduce((acc, cat) => acc + cat.services.length, 0);
  const isLocalNetwork = useIsLocalNetwork();
  const { activities, isLoading, isLive } = useActivities();

  // Get appropriate URL based on network location
  const getUrl = (service: QuickService) =>
    isLocalNetwork ?? true ? service.localUrl : service.externalUrl;

  // Take the first 3 activities for display
  const displayActivities = activities.slice(0, 3);

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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] text-muted-foreground/50 font-mono">
              ACTIVITY
            </span>
            <span className={`text-[10px] font-mono ${isLive ? "text-success" : "text-muted-foreground/50"}`}>
              {isLoading ? "LOADING..." : isLive ? "● LIVE" : "○ OFFLINE"}
            </span>
          </div>

          {displayActivities.length > 0 ? (
            <div className="space-y-1.5">
              {displayActivities.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activity.status === "active" ? "bg-success animate-pulse" :
                    activity.status === "paused" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
                  <span>{activity.icon}</span>
                  <span className="font-medium truncate max-w-[120px]">{activity.title}</span>
                  {activity.subtitle && (
                    <span className="text-muted-foreground truncate max-w-[150px]">
                      {activity.subtitle}
                    </span>
                  )}
                  {activity.progress !== undefined && activity.progress < 100 && (
                    <span className="text-[10px] text-muted-foreground/70 tabular-nums">
                      {activity.progress}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground/50 italic">
              {isLoading ? "Loading activities..." : "No active streams or downloads"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
