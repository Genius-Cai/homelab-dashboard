"use client";

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

// All services - will come from Uptime Kuma API later
const allServices = [
  { name: "Jellyfin", status: "online" as const, icon: "media" as const, url: "https://jellyfin.geniuscai.com" },
  { name: "Sonarr", status: "online" as const, icon: "database" as const, url: "https://sonarr.geniuscai.com" },
  { name: "Radarr", status: "online" as const, icon: "database" as const, url: "https://radarr.geniuscai.com" },
  { name: "Ollama", status: "online" as const, icon: "cloud" as const, url: "https://ollama.geniuscai.com" },
  { name: "ComfyUI", status: "offline" as const, icon: "cloud" as const, url: "https://comfyui.geniuscai.com" },
  { name: "n8n", status: "online" as const, icon: "server" as const, url: "https://n8n.geniuscai.com" },
  { name: "Portainer", status: "online" as const, icon: "server" as const, url: "https://portainer.geniuscai.com" },
  { name: "AdGuard", status: "online" as const, icon: "server" as const, url: "https://adguard.geniuscai.com" },
  { name: "Prowlarr", status: "online" as const, icon: "database" as const, url: "https://prowlarr.geniuscai.com" },
  { name: "Bazarr", status: "online" as const, icon: "database" as const, url: "https://bazarr.geniuscai.com" },
  { name: "qBittorrent", status: "online" as const, icon: "cloud" as const, url: "https://qbit.geniuscai.com" },
  { name: "Jellyseerr", status: "online" as const, icon: "media" as const, url: "https://jellyseerr.geniuscai.com" },
  { name: "FreshRSS", status: "online" as const, icon: "server" as const, url: "https://freshrss.geniuscai.com" },
  { name: "Uptime Kuma", status: "online" as const, icon: "server" as const, url: "https://uptime.geniuscai.com" },
  { name: "Beszel", status: "online" as const, icon: "server" as const, url: "https://beszel.geniuscai.com" },
  { name: "Dawarich", status: "online" as const, icon: "server" as const, url: "https://dawarich.geniuscai.com" },
  { name: "Blinko", status: "online" as const, icon: "server" as const, url: "https://blinko.geniuscai.com" },
  { name: "Forgejo", status: "online" as const, icon: "server" as const, url: "https://gitea.geniuscai.com" },
  { name: "Open WebUI", status: "online" as const, icon: "cloud" as const, url: "https://chat.geniuscai.com" },
  { name: "Dozzle", status: "online" as const, icon: "server" as const, url: "https://dozzle.geniuscai.com" },
  { name: "Syncthing", status: "online" as const, icon: "cloud" as const, url: "https://syncthing.geniuscai.com" },
  { name: "MT Photos", status: "online" as const, icon: "media" as const, url: "https://photos.geniuscai.com" },
  { name: "Reactive Resume", status: "online" as const, icon: "server" as const, url: "https://resume.geniuscai.com" },
];

export function ServicesCard() {
  const onlineCount = allServices.filter((s) => s.status === "online").length;

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
            <ServiceItem key={service.name} {...service} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceItem({
  name,
  status,
  icon,
  url,
}: {
  name: string;
  status: "online" | "offline";
  icon: "server" | "media" | "database" | "cloud";
  url: string;
}) {
  const IconComponent =
    icon === "media"
      ? PixelMedia
      : icon === "database"
        ? PixelDatabase
        : icon === "cloud"
          ? PixelCloud
          : PixelServer;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-accent/50 p-1 -mx-1 transition-colors"
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
