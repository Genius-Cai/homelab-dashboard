"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useActivities } from "@/hooks/use-activities";

// Official brand icons as inline SVG
const ClaudeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="8"/>
    <line x1="12" y1="16" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="8" y2="12"/>
    <line x1="16" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="4.93" x2="8.76" y2="8.76"/>
    <line x1="15.24" y1="15.24" x2="19.07" y2="19.07"/>
    <line x1="4.93" y1="19.07" x2="8.76" y2="15.24"/>
    <line x1="15.24" y1="8.76" x2="19.07" y2="4.93"/>
  </svg>
);

const ChatGPTIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#10A37F">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

const GitHubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const RocketIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const MoodleIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#F98012">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
  </svg>
);

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

// External links (no uptime monitoring needed)
interface ExternalLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const externalLinks: ExternalLink[] = [
  { name: "Moodle", url: "https://moodle.telt.unsw.edu.au", icon: <MoodleIcon size={14} /> },
  { name: "Claude", url: "https://claude.ai", icon: <ClaudeIcon size={14} /> },
  { name: "ChatGPT", url: "https://chat.openai.com", icon: <ChatGPTIcon size={14} /> },
  { name: "GitHub", url: "https://github.com", icon: <GitHubIcon size={14} /> },
  { name: "Sense 2026", url: "https://github.com/SensLiao/2026-Innovation-project", icon: <RocketIcon size={14} /> },
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

        {/* External Links */}
        <div className="mt-2 pt-2 border-t border-border/30">
          <div className="text-[10px] text-muted-foreground/50 font-mono mb-1.5">
            LINKS
          </div>
          <div className="flex flex-wrap gap-1.5">
            {externalLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 h-6 px-2 text-[11px] group-hover:bg-primary/10"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Button>
              </a>
            ))}
          </div>
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
