import { NextResponse } from "next/server";

// Jellyfin API configuration
const JELLYFIN_URL = process.env.JELLYFIN_URL || "http://192.168.50.80:8096";
const JELLYFIN_API_KEY = process.env.JELLYFIN_API_KEY || "0bd6c45bb089411f97a52c4a80b79020";

export interface JellyfinSession {
  type: "jellyfin";
  user: string;
  title: string;
  seriesName?: string;
  episodeInfo?: string;
  mediaType: "movie" | "episode" | "music" | "other";
  progress: number; // percentage
  isPlaying: boolean;
  client: string;
  timestamp: string;
}

export interface ActivityItem {
  type: "jellyfin" | "qbittorrent" | "docker";
  title: string;
  subtitle?: string;
  progress?: number;
  status: "active" | "paused" | "completed";
  timestamp: string;
  icon?: string;
}

async function fetchJellyfinSessions(): Promise<JellyfinSession[]> {
  try {
    const response = await fetch(`${JELLYFIN_URL}/Sessions`, {
      headers: {
        "X-Jellyfin-Token": JELLYFIN_API_KEY,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Jellyfin API error:", response.status);
      return [];
    }

    const sessions = await response.json();
    const activeSessions: JellyfinSession[] = [];

    for (const session of sessions) {
      // Only include sessions with NowPlayingItem
      if (session.NowPlayingItem) {
        const item = session.NowPlayingItem;
        const playState = session.PlayState;

        // Determine media type
        let mediaType: "movie" | "episode" | "music" | "other" = "other";
        if (item.Type === "Movie") mediaType = "movie";
        else if (item.Type === "Episode") mediaType = "episode";
        else if (item.Type === "Audio") mediaType = "music";

        // Calculate progress
        const progress = playState?.PositionTicks && item.RunTimeTicks
          ? Math.round((playState.PositionTicks / item.RunTimeTicks) * 100)
          : 0;

        // Build episode info
        let episodeInfo: string | undefined;
        if (mediaType === "episode" && item.ParentIndexNumber && item.IndexNumber) {
          episodeInfo = `S${item.ParentIndexNumber}E${item.IndexNumber}`;
        }

        activeSessions.push({
          type: "jellyfin",
          user: session.UserName || "Unknown",
          title: item.Name,
          seriesName: item.SeriesName,
          episodeInfo,
          mediaType,
          progress,
          isPlaying: !playState?.IsPaused,
          client: session.Client || "Unknown",
          timestamp: new Date().toISOString(),
        });
      }
    }

    return activeSessions;
  } catch (error) {
    console.error("Jellyfin fetch error:", error);
    return [];
  }
}

export async function GET() {
  try {
    const sessions = await fetchJellyfinSessions();

    // Convert to activity items
    const activities: ActivityItem[] = sessions.map((session) => {
      let title = session.title;
      let subtitle = session.user;

      if (session.mediaType === "episode" && session.seriesName) {
        title = session.seriesName;
        subtitle = `${session.episodeInfo} - ${session.title}`;
      }

      return {
        type: "jellyfin",
        title,
        subtitle,
        progress: session.progress,
        status: session.isPlaying ? "active" : "paused",
        timestamp: session.timestamp,
        icon: session.mediaType === "movie" ? "🎬" :
              session.mediaType === "episode" ? "📺" :
              session.mediaType === "music" ? "🎵" : "▶️",
      };
    });

    return NextResponse.json({
      success: true,
      data: activities,
      sessions,
      source: "jellyfin",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Jellyfin API error:", error);
    return NextResponse.json({
      success: false,
      data: [],
      sessions: [],
      source: "mock",
      error: "Failed to fetch Jellyfin sessions",
      timestamp: new Date().toISOString(),
    });
  }
}
