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

// All services - will come from API later
const allServices = [
  { name: "Jellyfin", status: "online" as const, icon: "media" as const },
  { name: "Sonarr", status: "online" as const, icon: "database" as const },
  { name: "Radarr", status: "online" as const, icon: "database" as const },
  { name: "Ollama", status: "online" as const, icon: "cloud" as const },
  { name: "ComfyUI", status: "offline" as const, icon: "cloud" as const },
  { name: "n8n", status: "online" as const, icon: "server" as const },
  { name: "Portainer", status: "online" as const, icon: "server" as const },
  { name: "AdGuard", status: "online" as const, icon: "server" as const },
  { name: "Prowlarr", status: "online" as const, icon: "database" as const },
  { name: "Bazarr", status: "online" as const, icon: "database" as const },
  { name: "qBittorrent", status: "online" as const, icon: "cloud" as const },
  { name: "Jellyseerr", status: "online" as const, icon: "media" as const },
  { name: "FreshRSS", status: "online" as const, icon: "server" as const },
  { name: "Uptime Kuma", status: "online" as const, icon: "server" as const },
  { name: "Beszel", status: "online" as const, icon: "server" as const },
  { name: "Dawarich", status: "online" as const, icon: "server" as const },
  { name: "Blinko", status: "online" as const, icon: "server" as const },
  { name: "Forgejo", status: "online" as const, icon: "server" as const },
  { name: "Open WebUI", status: "online" as const, icon: "cloud" as const },
  { name: "Dozzle", status: "online" as const, icon: "server" as const },
  { name: "Syncthing", status: "online" as const, icon: "cloud" as const },
  { name: "MT Photos", status: "online" as const, icon: "media" as const },
  { name: "Reactive Resume", status: "online" as const, icon: "server" as const },
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
}: {
  name: string;
  status: "online" | "offline";
  icon: "server" | "media" | "database" | "cloud";
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
    <div className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-accent/50 p-1 -mx-1 transition-colors">
      <IconComponent
        size={14}
        className="text-muted-foreground group-hover:text-foreground transition-colors"
      />
      {status === "online" ? (
        <PixelStatusOnline size={8} />
      ) : (
        <PixelStatusOffline size={8} />
      )}
      <span className="flex-1">{name}</span>
      <Badge
        variant={status === "online" ? "success" : "destructive"}
        className="text-[10px] px-1.5 py-0 w-[52px] text-center justify-center"
      >
        {status.toUpperCase()}
      </Badge>
    </div>
  );
}
