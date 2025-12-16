import { NextRequest, NextResponse } from "next/server";

// Blinko API configuration
const BLINKO_URL = process.env.BLINKO_URL || "https://blinko.geniuscai.com";
const BLINKO_API_TOKEN = process.env.BLINKO_API_TOKEN;

interface BlinkoNote {
  id: number;
  content: string;
  type: number; // 0 = blinko, 1 = note, 2 = todo
  isArchived: boolean;
  isTop: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoItem {
  id: number;
  content: string;
  done: boolean;
  column: "today" | "later"; // Determined by tag or content
  createdAt: string;
  updatedAt: string;
}

// Parse todo item from Blinko note
function parseTodo(note: BlinkoNote): TodoItem {
  const content = note.content;

  // Check if done (starts with ✓ or [x])
  const done = content.startsWith("✓") || content.startsWith("[x]") || content.startsWith("[X]") || note.isArchived;

  // Check column by tag
  const isToday = content.includes("#today") || content.includes("#今天");
  const isLater = content.includes("#later") || content.includes("#稍后") || content.includes("#以后");

  // Clean content (remove tags and done markers)
  let cleanContent = content
    .replace(/^[✓\[x\]\[X\]]\s*/i, "")
    .replace(/#today\s*/gi, "")
    .replace(/#今天\s*/gi, "")
    .replace(/#later\s*/gi, "")
    .replace(/#稍后\s*/gi, "")
    .replace(/#以后\s*/gi, "")
    .replace(/- \[ \]/g, "")
    .replace(/- \[x\]/gi, "")
    .trim();

  return {
    id: note.id,
    content: cleanContent,
    done,
    column: isLater ? "later" : "today", // Default to today
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

// Format todo for Blinko
function formatTodoContent(content: string, column: "today" | "later", done: boolean): string {
  const columnTag = column === "today" ? "#today" : "#later";
  const prefix = done ? "✓ " : "";
  return `${prefix}${content} ${columnTag}`;
}

// GET - Fetch all todos from Blinko
export async function GET() {
  if (!BLINKO_API_TOKEN) {
    return NextResponse.json({
      success: false,
      data: [],
      source: "mock",
      error: "Blinko API token not configured",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Blinko supports type=2 for todos natively
    const response = await fetch(`${BLINKO_URL}/api/v1/note/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLINKO_API_TOKEN}`,
      },
      body: JSON.stringify({
        type: 2, // todo type (native Blinko todo)
        size: 100,
        isArchived: false,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Blinko API error:", response.status, await response.text());
      return NextResponse.json({
        success: false,
        data: [],
        source: "mock",
        error: `Blinko API error: ${response.status}`,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();
    const notes: BlinkoNote[] = data.data || data || [];
    const todos = notes.map(parseTodo);

    // Sort: incomplete first, then by updatedAt
    todos.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return NextResponse.json({
      success: true,
      data: todos,
      source: "blinko",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Blinko fetch error:", error);
    return NextResponse.json({
      success: false,
      data: [],
      source: "mock",
      error: "Failed to fetch todos from Blinko",
      timestamp: new Date().toISOString(),
    });
  }
}

// POST - Create or update a todo
export async function POST(request: NextRequest) {
  if (!BLINKO_API_TOKEN) {
    return NextResponse.json({
      success: false,
      error: "Blinko API token not configured",
    }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, content, done, column } = body;

    const formattedContent = formatTodoContent(content, column || "today", done || false);

    const response = await fetch(`${BLINKO_URL}/api/v1/note/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLINKO_API_TOKEN}`,
      },
      body: JSON.stringify({
        id: id || undefined, // undefined for new todos
        content: formattedContent,
        type: 2, // native todo type
      }),
    });

    if (!response.ok) {
      console.error("Blinko upsert error:", response.status, await response.text());
      return NextResponse.json({
        success: false,
        error: `Failed to save todo: ${response.status}`,
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: parseTodo(data),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Blinko upsert error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to save todo",
    }, { status: 500 });
  }
}

// DELETE - Delete a todo
export async function DELETE(request: NextRequest) {
  if (!BLINKO_API_TOKEN) {
    return NextResponse.json({
      success: false,
      error: "Blinko API token not configured",
    }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Todo ID required",
      }, { status: 400 });
    }

    const response = await fetch(`${BLINKO_URL}/api/v1/note/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLINKO_API_TOKEN}`,
      },
      body: JSON.stringify({
        ids: [parseInt(id)],
      }),
    });

    if (!response.ok) {
      console.error("Blinko delete error:", response.status);
      return NextResponse.json({
        success: false,
        error: `Failed to delete todo: ${response.status}`,
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Blinko delete error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to delete todo",
    }, { status: 500 });
  }
}

// PATCH - Toggle todo done status
export async function PATCH(request: NextRequest) {
  if (!BLINKO_API_TOKEN) {
    return NextResponse.json({
      success: false,
      error: "Blinko API token not configured",
    }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, done, content, column } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Todo ID required",
      }, { status: 400 });
    }

    const formattedContent = formatTodoContent(content, column || "today", done);

    const response = await fetch(`${BLINKO_URL}/api/v1/note/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLINKO_API_TOKEN}`,
      },
      body: JSON.stringify({
        id,
        content: formattedContent,
        type: 2, // native todo type
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Failed to update todo: ${response.status}`,
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: parseTodo(data),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Blinko patch error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update todo",
    }, { status: 500 });
  }
}
