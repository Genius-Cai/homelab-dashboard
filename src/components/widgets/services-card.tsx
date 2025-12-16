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

// Service configuration with local and external URLs
// Priority: localUrl > externalUrl
interface ServiceConfig {
  name: string;
  status: "online" | "offline";
  icon: "server" | "media" | "database" | "cloud";
  localUrl: string;      // Internal network URL (*.home.local)
  externalUrl: string;   // External URL via Cloudflare Tunnel (*.geniuscai.com)
}

// All services - will come from Uptime Kuma API later
const allServices: ServiceConfig[] = [
  { name: "Jellyfin", status: "online", icon: "media", localUrl: "http://jellyfin.home.local", externalUrl: "https://jellyfin.geniuscai.com" },
  { name: "Sonarr", status: "online", icon: "database", localUrl: "http://sonarr.home.local", externalUrl: "https://sonarr.geniuscai.com" },
  { name: "Radarr", status: "online", icon: "database", localUrl: "http://radarr.home.local", externalUrl: "https://radarr.geniuscai.com" },
  { name: "Ollama", status: "online", icon: "cloud", localUrl: "http://192.168.50.82:11434", externalUrl: "https://ollama.geniuscai.com" },
  { name: "ComfyUI", status: "offline", icon: "cloud", localUrl: "http://comfyui.home.local", externalUrl: "https://comfyui.geniuscai.com" },
  { name: "n8n", status: "online", icon: "server", localUrl: "http://n8n.home.local", externalUrl: "https://n8n.geniuscai.com" },
  { name: "Portainer", status: "online", icon: "server", localUrl: "http://portainer.home.local", externalUrl: "https://portainer.geniuscai.com" },
  { name: "AdGuard", status: "online", icon: "server", localUrl: "http://adguard.home.local", externalUrl: "https://adguard.geniuscai.com" },
  { name: "Prowlarr", status: "online", icon: "database", localUrl: "http://prowlarr.home.local", externalUrl: "https://prowlarr.geniuscai.com" },
  { name: "Bazarr", status: "online", icon: "database", localUrl: "http://bazarr.home.local", externalUrl: "https://bazarr.geniuscai.com" },
  { name: "qBittorrent", status: "online", icon: "cloud", localUrl: "http://qbit.home.local", externalUrl: "https://qbit.geniuscai.com" },
  { name: "Jellyseerr", status: "online", icon: "media", localUrl: "http://jellyseerr.home.local", externalUrl: "https://jellyseerr.geniuscai.com" },
  { name: "FreshRSS", status: "online", icon: "server", localUrl: "http://freshrss.home.local", externalUrl: "https://freshrss.geniuscai.com" },
  { name: "Uptime Kuma", status: "online", icon: "server", localUrl: "http://uptime.home.local/dashboard", externalUrl: "https://uptime.geniuscai.com" },
  { name: "Beszel", status: "online", icon: "server", localUrl: "http://beszel.home.local", externalUrl: "https://beszel.geniuscai.com" },
  { name: "Dawarich", status: "online", icon: "server", localUrl: "http://dawarich.home.local", externalUrl: "https://dawarich.geniuscai.com" },
  { name: "Blinko", status: "online", icon: "server", localUrl: "http://blinko.home.local", externalUrl: "https://blinko.geniuscai.com" },
  { name: "Forgejo", status: "online", icon: "server", localUrl: "http://gitea.home.local", externalUrl: "https://gitea.geniuscai.com" },
  { name: "Open WebUI", status: "online", icon: "cloud", localUrl: "http://chat.home.local", externalUrl: "https://chat.geniuscai.com" },
  { name: "Dozzle", status: "online", icon: "server", localUrl: "http://dozzle.home.local", externalUrl: "https://dozzle.geniuscai.com" },
  { name: "Syncthing", status: "online", icon: "cloud", localUrl: "http://syncthing.home.local", externalUrl: "https://syncthing.geniuscai.com" },
  { name: "MT Photos", status: "online", icon: "media", localUrl: "http://photos.home.local", externalUrl: "https://photos.geniuscai.com" },
  { name: "Reactive Resume", status: "online", icon: "server", localUrl: "http://resume.home.local", externalUrl: "https://resume.geniuscai.com" },
];

// Hook to detect if we're on local network
function useIsLocalNetwork() {
  const [isLocal, setIsLocal] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we can access local network by testing a known local endpoint
    // We'll use a simple heuristic: if hostname includes "home.local" or is a local IP
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";

    // If accessing via home.local domain, we're on local network
    if (hostname.includes("home.local") || hostname.includes("192.168.") || hostname === "localhost") {
      setIsLocal(true);
      return;
    }

    // If accessing via geniuscai.com, we're external
    if (hostname.includes("geniuscai.com")) {
      setIsLocal(false);
      return;
    }

    // For other cases (like localhost during dev), try to detect
    // Default to local for development
    setIsLocal(true);
  }, []);

  return isLocal;
}

export function ServicesCard() {
  const onlineCount = allServices.filter((s) => s.status === "online").length;
  const isLocalNetwork = useIsLocalNetwork();

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
              isLocalNetwork={isLocalNetwork ?? true}
            />
          ))}
        </div>
        {/* Network indicator */}
        <div className="mt-3 pt-2 border-t border-border/50 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <span className={`w-2 h-2 rounded-full ${isLocalNetwork ? "bg-success" : "bg-warning"}`} />
          <span>{isLocalNetwork ? "LOCAL NETWORK" : "EXTERNAL ACCESS"}</span>
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
}: ServiceConfig & { isLocalNetwork: boolean }) {
  const IconComponent =
    icon === "media"
      ? PixelMedia
      : icon === "database"
        ? PixelDatabase
        : icon === "cloud"
          ? PixelCloud
          : PixelServer;

  // Choose URL based on network location
  const url = isLocalNetwork ? localUrl : externalUrl;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-accent/50 p-1 -mx-1 transition-colors"
      title={`${isLocalNetwork ? "Local" : "External"}: ${url}`}
    >
      <IconComponent
        size={14}
        className="text-muted-foreground group-hover:text-foreground transition-colors"
      />
      {status === "online" ? (
        <PixelStatusOnline size={8} />
      ) : (
        <PixelStatusOffline size={8} />
      )}
      <span className="flex-1 group-hover:underline">{name}</span>
      <Badge
        variant={status === "online" ? "success" : "destructive"}
        className="text-[10px] px-1.5 py-0 w-[52px] text-center justify-center"
      >
        {status.toUpperCase()}
      </Badge>
    </a>
  );
}
