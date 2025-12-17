"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PixelServer,
  PixelMedia,
  PixelDatabase,
  PixelCloud,
  PixelStatusOnline,
  PixelStatusOffline,
} from "@/components/ui/pixel-icons";
import { useUptime } from "@/hooks/use-uptime";

// Service configuration with local and external URLs
interface ServiceConfig {
  name: string;
  icon: "server" | "media" | "database" | "cloud";
  localUrl: string;
  externalUrl: string;
}

// All services configuration
const allServices: ServiceConfig[] = [
  { name: "Jellyfin", icon: "media", localUrl: "http://jellyfin.home.local", externalUrl: "https://jellyfin.geniuscai.com" },
  { name: "Sonarr", icon: "database", localUrl: "http://sonarr.home.local", externalUrl: "https://sonarr.geniuscai.com" },
  { name: "Radarr", icon: "database", localUrl: "http://radarr.home.local", externalUrl: "https://radarr.geniuscai.com" },
  { name: "Ollama", icon: "cloud", localUrl: "http://192.168.50.82:11434", externalUrl: "https://ollama.geniuscai.com" },
  { name: "ComfyUI", icon: "cloud", localUrl: "http://comfyui.home.local", externalUrl: "https://comfyui.geniuscai.com" },
  { name: "n8n", icon: "server", localUrl: "http://n8n.home.local", externalUrl: "https://n8n.geniuscai.com" },
  { name: "Portainer", icon: "server", localUrl: "http://portainer.home.local", externalUrl: "https://portainer.geniuscai.com" },
  { name: "AdGuard", icon: "server", localUrl: "http://adguard.home.local", externalUrl: "https://adguard.geniuscai.com" },
  { name: "Prowlarr", icon: "database", localUrl: "http://prowlarr.home.local", externalUrl: "https://prowlarr.geniuscai.com" },
  { name: "Bazarr", icon: "database", localUrl: "http://bazarr.home.local", externalUrl: "https://bazarr.geniuscai.com" },
  { name: "qBittorrent", icon: "cloud", localUrl: "http://qbit.home.local", externalUrl: "https://qbit.geniuscai.com" },
  { name: "Jellyseerr", icon: "media", localUrl: "http://jellyseerr.home.local", externalUrl: "https://jellyseerr.geniuscai.com" },
  { name: "FreshRSS", icon: "server", localUrl: "http://freshrss.home.local", externalUrl: "https://freshrss.geniuscai.com" },
  { name: "Uptime Kuma", icon: "server", localUrl: "http://uptime.home.local/dashboard", externalUrl: "https://uptime.geniuscai.com" },
  { name: "Beszel", icon: "server", localUrl: "http://beszel.home.local", externalUrl: "https://beszel.geniuscai.com" },
  { name: "Dawarich", icon: "server", localUrl: "http://dawarich.home.local", externalUrl: "https://dawarich.geniuscai.com" },
  { name: "Blinko", icon: "server", localUrl: "http://blinko.home.local", externalUrl: "https://blinko.geniuscai.com" },
  { name: "Forgejo", icon: "server", localUrl: "http://gitea.home.local", externalUrl: "https://gitea.geniuscai.com" },
  { name: "Open WebUI", icon: "cloud", localUrl: "http://chat.home.local", externalUrl: "https://chat.geniuscai.com" },
  { name: "Dozzle", icon: "server", localUrl: "http://dozzle.home.local", externalUrl: "https://dozzle.geniuscai.com" },
  { name: "Syncthing", icon: "cloud", localUrl: "http://syncthing.home.local", externalUrl: "https://syncthing.geniuscai.com" },
  { name: "MT Photos", icon: "media", localUrl: "http://photos.home.local", externalUrl: "https://photos.geniuscai.com" },
  { name: "Reactive Resume", icon: "server", localUrl: "http://resume.home.local", externalUrl: "https://resume.geniuscai.com" },
];

// Hook to detect if we're on local network
function useIsLocalNetwork() {
  const [isLocal, setIsLocal] = useState<boolean | null>(null);

  useEffect(() => {
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";

    if (hostname.includes("home.local") || hostname.includes("192.168.") || hostname === "localhost") {
      setIsLocal(true);
      return;
    }

    if (hostname.includes("geniuscai.com")) {
      setIsLocal(false);
      return;
    }

    setIsLocal(true);
  }, []);

  return isLocal;
}

export function ServicesCard() {
  const isLocalNetwork = useIsLocalNetwork();
  const { getServiceStatus, source, isLoading } = useUptime();

  // Calculate online count based on real data
  const onlineCount = allServices.filter((s) => getServiceStatus(s.name) === "online").length;

  return (
    <Card className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <PixelServer size={16} />
          SERVICES
          <Badge variant="outline" className="ml-auto text-[10px] px-1.5">
            {onlineCount}/{allServices.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Grid layout to show all services */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {allServices.map((service) => (
            <ServiceItem
              key={service.name}
              {...service}
              status={getServiceStatus(service.name)}
              isLocalNetwork={isLocalNetwork ?? true}
            />
          ))}
        </div>
        {/* Network and data source indicator */}
        <div className="mt-3 pt-2 border-t border-border/50 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <span className={`w-2 h-2 rounded-full ${isLocalNetwork ? "bg-success" : "bg-warning"}`} />
          <span>{isLocalNetwork ? "LOCAL" : "EXTERNAL"}</span>
          <span className="text-border">|</span>
          <span className={`${source === "uptime-kuma" ? "text-success" : "text-muted-foreground"}`}>
            {isLoading ? "LOADING..." : source === "uptime-kuma" ? "LIVE" : "CACHED"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceItem({
  name,
  status,
  icon,
  localUrl,
  externalUrl,
  isLocalNetwork,
}: ServiceConfig & { status: "online" | "offline"; isLocalNetwork: boolean }) {
  const IconComponent =
    icon === "media"
      ? PixelMedia
      : icon === "database"
        ? PixelDatabase
        : icon === "cloud"
          ? PixelCloud
          : PixelServer;

  const url = isLocalNetwork ? localUrl : externalUrl;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm group cursor-pointer hover:bg-accent/50 py-1 px-1 -mx-1 transition-colors"
      title={`${isLocalNetwork ? "Local" : "External"}: ${url}`}
    >
      {/* Icon container - fixed width for alignment */}
      <span className="w-4 h-4 flex items-center justify-center shrink-0">
        <IconComponent
          size={16}
          className="text-muted-foreground group-hover:text-foreground transition-colors"
        />
      </span>
      {/* Status dot - fixed width */}
      <span className="w-2 h-2 flex items-center justify-center shrink-0">
        {status === "online" ? (
          <PixelStatusOnline size={8} />
        ) : (
          <PixelStatusOffline size={8} />
        )}
      </span>
      <span className="flex-1 group-hover:underline truncate">{name}</span>
      <Badge
        variant={status === "online" ? "success" : "destructive"}
        className="text-[10px] px-1.5 py-0 w-[52px] text-center justify-center shrink-0"
      >
        {status.toUpperCase()}
      </Badge>
    </a>
  );
}
