"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ASCIIProgress } from "@/components/ui/ascii-progress";
import { PixelStatusOnline } from "@/components/ui/pixel-icons";
import { QuickAccess } from "@/components/widgets/quick-access";
import { Clock } from "@/components/widgets/clock";
import { CalendarWidget } from "@/components/widgets/calendar-widget";
import { ServicesCard } from "@/components/widgets/services-card";
import { SystemOverview } from "@/components/widgets/system-overview";
import { ThemeToggle } from "@/components/widgets/theme-toggle";
import { MarketsCard } from "@/components/widgets/markets-card";
import { TodoList } from "@/components/widgets/todo-list";
import { RSSFeed } from "@/components/widgets/rss-feed";
import { JourneyCard } from "@/components/widgets/journey-card";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-3 md:p-4">
      {/* Header with decorations */}
      <header className="mb-6 border-b-2 border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Pixel Avatar */}
            <div className="w-12 h-12 border-2 border-border bg-card overflow-hidden">
              <img
                src="/images/avatar.gif"
                alt="Steven's Avatar"
                className="w-full h-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            {/* Decorative brackets */}
            <span className="text-3xl font-black text-muted-foreground/40">[</span>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight">
                STEVEN&apos;S_HOMELAB
              </h1>
              <p className="text-[10px] text-muted-foreground/70 font-mono tracking-wider">
                // SYSTEM STATUS: NOMINAL
              </p>
            </div>
            <span className="text-3xl font-black text-muted-foreground/40">]</span>
            <Badge variant="success" className="animate-pulse ml-2">
              <PixelStatusOnline size={8} className="mr-1" />
              ONLINE
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Clock />
          </div>
        </div>

      </header>

      {/* Calendar + Quick Access + RSS Bar */}
      <div className="grid gap-0 md:grid-cols-[180px_1fr_520px] border-2 border-border bg-card shadow-md">
        {/* Left: Calendar */}
        <div className="border-r-2 border-border p-4 bg-muted/30">
          <CalendarWidget />
        </div>

        {/* Center: Quick Access */}
        <div className="border-r-2 border-border p-4">
          <QuickAccess />
        </div>

        {/* Right: RSS Feed - Live from Blinko */}
        <RSSFeed />
      </div>

      {/* Bento Grid */}
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {/* Services Card */}
        <ServicesCard />

        {/* System Overview Card - Large */}
        <SystemOverview />

        {/* Today's Journey Card - Live from Dawarich */}
        <JourneyCard />

        {/* Markets Card - Real-time data */}
        <MarketsCard />

        {/* TODO Card - Synced with Blinko */}
        <TodoList />

        {/* DNS Defense Card */}
        <Card className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
          <CardHeader>
            <CardTitle>🛡️ DNS DEFENSE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm font-mono">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Queries</span>
                <span className="font-bold tabular-nums">12,345</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Blocked</span>
                <span className="font-bold text-destructive tabular-nums">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Latency</span>
                <span className="font-bold tabular-nums">12ms</span>
              </div>

              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Block Rate</span>
                  <span className="text-xs text-success">10%</span>
                </div>
                <div className="h-3 bg-muted/30 border border-border/50 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-success" style={{ width: "10%" }} />
                  {/* Empty portion with dot pattern */}
                  <div
                    className="absolute inset-y-0 right-0"
                    style={{
                      left: "10%",
                      backgroundImage: `radial-gradient(circle, var(--muted-foreground) 1px, transparent 1px)`,
                      backgroundSize: "6px 6px",
                      opacity: 0.15,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
          <CardHeader>
            <CardTitle>📅 CALENDAR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <CalendarItem time="10:00" event="开会" active={false} />
            <CalendarItem time="14:30" event="牙医" active={true} />
            <CalendarItem time="19:00" event="约饭" active={false} />
            <div className="mt-4 pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-mono">[3 events today]</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Footer */}
      <footer className="mt-4 border-t-2 border-border pt-3 pb-2">
        <div className="text-center text-xs text-muted-foreground font-mono">
          <p className="mb-1">═══════════════════════════════════════════════════</p>
          <p>STEVEN&apos;S HOMELAB v0.1.0 // BRUTALIST NEO // {new Date().getFullYear()}</p>
          <p className="mt-1 text-muted-foreground/50">[ SYSTEM UPTIME: 99.9% ]</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-components

function CalendarItem({
  time,
  event,
  active
}: {
  time: string;
  event: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 text-sm font-mono p-1 -mx-1 ${active ? "bg-primary/10 border-l-2 border-primary pl-2" : ""}`}>
      <span className="w-12 text-xs text-muted-foreground">{time}</span>
      <span className={active ? "font-bold" : ""}>{event}</span>
      {active && <Badge variant="outline" className="text-[10px] ml-auto">NEXT</Badge>}
    </div>
  );
}


