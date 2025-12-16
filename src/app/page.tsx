"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ASCIIProgress } from "@/components/ui/ascii-progress";
import {
  PixelStatusOnline,
  PixelHome,
  PixelCoffee,
  PixelPark,
  PixelPin,
  PixelArrowUp,
  PixelArrowDown,
  PixelBitcoin,
  PixelChart,
} from "@/components/ui/pixel-icons";
import { QuickAccess } from "@/components/widgets/quick-access";
import { Clock } from "@/components/widgets/clock";
import { CalendarWidget } from "@/components/widgets/calendar-widget";
import { ServicesCard } from "@/components/widgets/services-card";
import { SystemOverview } from "@/components/widgets/system-overview";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-3 md:p-4">
      {/* Header with decorations */}
      <header className="mb-6 border-b-2 border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <Clock />
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

        {/* Right: RSS Sticky Note - Brutalist Style */}
        <div className="p-4 bg-primary/5 border-l-4 border-primary relative">
          {/* Corner fold effect */}
          <div className="absolute top-0 right-0 w-6 h-6 bg-primary/10"
               style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black tracking-wider text-primary">📡 RSS FEED</span>
            <span className="text-[10px] text-muted-foreground font-mono">[starred]</span>
          </div>

          <div className="space-y-1.5">
            <NoteItem title="Next.js 16 正式发布" isNew />
            <NoteItem title="Claude 4.5 重大更新" isNew />
            <NoteItem title="Docker 容器最佳实践" />
            <NoteItem title="Homelab 完整搭建指南" />
          </div>

          <div className="mt-3 pt-2 border-t border-border/30 flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>[6 items · 2 new]</span>
            <span className="text-primary cursor-pointer hover:underline">view all →</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {/* Services Card */}
        <ServicesCard />

        {/* System Overview Card - Large */}
        <SystemOverview />

        {/* Today's Journey Card */}
        <Card className="lg:row-span-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PixelPin size={16} />
              TODAY&apos;S JOURNEY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6">
              {/* Vertical timeline line */}
              <div className="absolute left-[7px] top-2 bottom-8 w-0.5 border-l-2 border-dashed border-border" />

              <JourneyItem time="09:23" label="HOME" icon={<PixelHome size={16} />} current={false} />
              <JourneyItem time="10:15" label="CAFE" icon={<PixelCoffee size={16} />} current={false} />
              <JourneyItem time="12:20" label="PARK" icon={<PixelPark size={16} />} current={false} />
              <JourneyItem time="13:25" label="NOW" icon={<PixelPin size={16} />} current={true} />
            </div>

            <div className="mt-6 pt-3 border-t border-border/50 flex gap-4 text-xs text-muted-foreground font-mono">
              <span>[9.2km traveled]</span>
              <span>[3 stops]</span>
            </div>
          </CardContent>
        </Card>

        {/* Markets Card */}
        <Card className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PixelChart size={16} />
              MARKETS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <TickerItem symbol="BTC" price="$104.2k" change={2.3} icon={<PixelBitcoin size={14} />} />
            <TickerItem symbol="ETH" price="$3,891" change={-0.8} />
            <TickerItem symbol="NVDA" price="$138.2" change={1.2} />
            <TickerItem symbol="QQQ" price="$527.8" change={0.5} />
          </CardContent>
        </Card>

        {/* TODO Card */}
        <Card className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
          <CardHeader>
            <CardTitle>☐ TODO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <TodoItem text="买菜" done={false} />
            <TodoItem text="写代码" done={false} />
            <TodoItem text="吃饭" done={true} />
            <div className="mt-4 pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-mono">[3 items · 1 done]</p>
            </div>
          </CardContent>
        </Card>

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

function JourneyItem({
  time,
  label,
  icon,
  current
}: {
  time: string;
  label: string;
  icon: React.ReactNode;
  current: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${current ? "font-bold" : ""}`}>
      <div className={`relative z-10 p-1 border-2 border-border bg-card ${current ? "animate-pulse" : ""}`}>
        {icon}
      </div>
      <div className="flex-1">
        <span className="text-xs text-muted-foreground font-mono">{time}</span>
        <p className={current ? "text-primary" : ""}>{label}</p>
      </div>
      {current && (
        <Badge variant="default" className="text-[10px]">NOW</Badge>
      )}
    </div>
  );
}

function TickerItem({
  symbol,
  price,
  change,
  icon,
}: {
  symbol: string;
  price: string;
  change: number;
  icon?: React.ReactNode;
}) {
  const isPositive = change >= 0;

  return (
    <div className="grid grid-cols-[70px_1fr_80px] items-center text-sm font-mono group hover:bg-accent/50 p-1 -mx-1 transition-colors cursor-pointer">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-bold">{symbol}</span>
      </div>
      <span className="tabular-nums text-right pr-4">{price}</span>
      <div className="flex items-center gap-1 justify-end">
        {isPositive ? <PixelArrowUp size={10} /> : <PixelArrowDown size={10} />}
        <span className={`tabular-nums ${isPositive ? "text-success" : "text-destructive"}`}>
          {isPositive ? "+" : ""}{change.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function TodoItem({ text, done }: { text: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent/50 p-1 -mx-1 transition-colors group">
      <span className={`h-4 w-4 border-2 border-border flex items-center justify-center font-mono text-xs
        ${done ? "bg-primary text-primary-foreground" : "group-hover:bg-accent"}`}>
        {done ? "✓" : " "}
      </span>
      <span className={done ? "line-through text-muted-foreground" : ""}>{text}</span>
    </div>
  );
}

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

function NoteItem({ title, isNew }: { title: string; isNew?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs cursor-pointer hover:bg-primary/10 p-1 -mx-1 transition-colors">
      <span className={isNew ? "text-primary" : "text-muted-foreground/50"}>
        {isNew ? "●" : "○"}
      </span>
      <span className="truncate flex-1">{title}</span>
      {isNew && (
        <span className="text-[9px] px-1 bg-primary text-primary-foreground font-bold shrink-0">
          NEW
        </span>
      )}
    </div>
  );
}

