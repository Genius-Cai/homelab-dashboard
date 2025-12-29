import { NextRequest, NextResponse } from "next/server";

// Blinko API configuration (reuse same config)
const BLINKO_URL = process.env.BLINKO_URL || "https://blinko.geniuscai.com";
const BLINKO_API_TOKEN = process.env.BLINKO_API_TOKEN;

interface BlinkoNote {
  id: number;
  content: string;
  type: number;
  isArchived: boolean;
  isTop: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RSSItem {
  id: number;
  title: string;
  url: string;
  source?: string;
  summary?: string;
  isNew: boolean; // within 24h
  isStarred: boolean; // has #starred tag
  publishedAt: string;
}

// Parse RSS item from Blinko note with #rss tag
function parseRSSItem(note: BlinkoNote): RSSItem {
  const content = note.content;
  const lines = content.split("\n").filter((l) => l.trim());

  // Extract title (first line, remove emoji prefix if any)
  let title = lines[0] || "Untitled";
  title = title.replace(/^[📰📡🔗]\s*/, "").trim();

  // Extract URL (look for http/https)
  const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
  const url = urlMatch ? urlMatch[1] : "";

  // Extract source from URL domain
  let source = "";
  if (url) {
    try {
      const urlObj = new URL(url);
      source = urlObj.hostname.replace("www.", "");
    } catch {
      source = "";
    }
  }

  // Extract summary (lines between title and URL, excluding tags)
  const summary = lines
    .slice(1)
    .filter((l) => !l.startsWith("http") && !l.startsWith("#"))
    .join(" ")
    .trim();

  // Check if new (within 24 hours)
  const createdDate = new Date(note.createdAt);
  const now = new Date();
  const isNew = now.getTime() - createdDate.getTime() < 24 * 60 * 60 * 1000;

  // Check if starred
  const isStarred = content.includes("#starred") || content.includes("#star") || note.isTop;

  return {
    id: note.id,
    title,
    url,
    source,
    summary: summary || undefined,
    isNew,
    isStarred,
    publishedAt: note.createdAt,
  };
}

// GET - Fetch RSS items from Blinko (notes with #rss or #course tag)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateFilter = searchParams.get("date"); // Optional: filter by date (YYYY-MM-DD)
  const tagFilter = searchParams.get("tag") || "rss"; // Default to #rss, can be "course" for course notifications

  if (!BLINKO_API_TOKEN) {
    // Return mock data when not configured
    return NextResponse.json({
      success: true,
      data: [
        { id: 1, title: "Next.js 16 正式发布", url: "https://nextjs.org", source: "nextjs.org", isNew: true, isStarred: false, publishedAt: new Date().toISOString() },
        { id: 2, title: "Claude 4.5 重大更新", url: "https://anthropic.com", source: "anthropic.com", isNew: true, isStarred: true, publishedAt: new Date().toISOString() },
        { id: 3, title: "Docker 容器最佳实践", url: "https://docker.com", source: "docker.com", isNew: false, isStarred: false, publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 4, title: "Homelab 完整搭建指南", url: "https://reddit.com/r/homelab", source: "reddit.com", isNew: false, isStarred: false, publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      source: "mock",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Search for notes with specified tag using Blinko's search
    const searchTag = `#${tagFilter}`;
    const response = await fetch(`${BLINKO_URL}/api/v1/note/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLINKO_API_TOKEN}`,
      },
      body: JSON.stringify({
        type: 0, // blinko type (short notes)
        size: 50,
        isArchived: false,
        searchText: searchTag,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Blinko RSS API error:", response.status);
      return NextResponse.json({
        success: false,
        data: [],
        source: "error",
        error: `Blinko API error: ${response.status}`,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();
    const notes: BlinkoNote[] = data.data || data || [];

    // Filter notes that actually contain the searched tag
    let rssNotes = notes.filter((note) => note.content.includes(searchTag));

    // Optional: filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      rssNotes = rssNotes.filter((note) => {
        const noteDate = new Date(note.createdAt);
        return (
          noteDate.getFullYear() === filterDate.getFullYear() &&
          noteDate.getMonth() === filterDate.getMonth() &&
          noteDate.getDate() === filterDate.getDate()
        );
      });
    }

    const rssItems = rssNotes.map(parseRSSItem);

    // Sort: starred first, then by date (newest first)
    rssItems.sort((a, b) => {
      if (a.isStarred !== b.isStarred) return a.isStarred ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Stats
    const newCount = rssItems.filter((item) => item.isNew).length;
    const starredCount = rssItems.filter((item) => item.isStarred).length;

    return NextResponse.json({
      success: true,
      data: rssItems,
      stats: {
        total: rssItems.length,
        new: newCount,
        starred: starredCount,
      },
      source: "blinko",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("RSS fetch error:", error);
    return NextResponse.json({
      success: false,
      data: [],
      source: "error",
      error: "Failed to fetch RSS items",
      timestamp: new Date().toISOString(),
    });
  }
}
