"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PixelCPU,
  PixelTemp,
  PixelMemory,
  PixelDisk,
  PixelServer,
  PixelStatusOnline,
  PixelDocker,
  PixelCloud,
} from "@/components/ui/pixel-icons";

// Mock data - will come from Beszel API later
const nodes = [
  {
    id: "pve-main",
    name: "PVE",
    type: "proxmox",
    status: "online" as const,
    cpu: 68,
    memory: 82,
    temp: 52,
    containers: 49,
    gpuLoad: 15,  // Intel Iris Xe 核显
  },
  {
    id: "pve-3090",
    name: "3090-NODE",
    type: "gpu-node",
    status: "online" as const,
    cpu: 35,
    memory: 56,
    temp: 45,
    gpuLoad: 28,
  },
  {
    id: "rtx4090",
    name: "4090-PC",
    type: "workstation",
    status: "online" as const,
    cpu: 23,
    memory: 45,
    temp: 38,
    gpuLoad: 12,
  },
];

const storagePools = [
  {
    name: "TANK",
    used: 14.2,
    total: 27.3,
    status: "healthy" as const,
    type: "media/docker",
  },
  {
    name: "COLD",
    used: 8.5,
    total: 14.5,
    status: "healthy" as const,
    type: "backup/archive",
  },
];

const backups = [
  {
    name: "Backblaze B2",
    lastRun: "2025-12-15 04:00",
    status: "success" as const,
    size: "138 GB",
    isRunning: false,
    progress: 0,
  },
  {
    name: "AWS S3",
    lastRun: "2025-12-14 02:00",
    status: "success" as const,
    size: "892 GB",
    isRunning: true,  // 模拟正在备份
    progress: 67,
  },
];

export function SystemOverview() {
  return (
    <Card className="lg:col-span-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <PixelServer size={16} />
          SYSTEM OVERVIEW
          <Badge variant="success" className="ml-auto text-[10px]">
            <PixelStatusOnline size={8} className="mr-1" />
            ALL SYSTEMS GO
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {nodes.map((node) => (
            <NodeCard key={node.id} node={node} />
          ))}
        </div>

        {/* Storage Pools Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t-2 border-dashed border-border/50">
          {storagePools.map((pool) => (
            <div key={pool.name} className="border-2 border-border p-3 bg-muted/10">
              <div className="flex items-center gap-2 mb-2">
                <PixelDisk size={14} />
                <span className="text-xs font-bold tracking-wider">{pool.name} POOL</span>
                <span className="text-[10px] text-muted-foreground font-mono">[{pool.type}]</span>
                <Badge variant="success" className="ml-auto text-[10px] px-1">
                  {pool.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-mono text-lg shrink-0">
                  <span className="font-black">{pool.used}T</span>
                  <span className="text-muted-foreground"> / {pool.total}T</span>
                </div>
                {/* Full-width progress bar */}
                <div className="flex-1 h-4 bg-muted/30 border border-border/50 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-success"
                    style={{ width: `${(pool.used / pool.total) * 100}%` }}
                  />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, var(--background) 4px, var(--background) 5px)`,
                    }}
                  />
                </div>
                <span className="font-mono text-sm tabular-nums text-success shrink-0">
                  {((pool.used / pool.total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cloud Backups Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
          {backups.map((backup) => (
            <div key={backup.name} className="border-2 border-border p-3 bg-muted/10 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <PixelCloud size={14} />
                <span className="text-xs font-bold tracking-wider">{backup.name}</span>
                <Badge
                  variant={backup.isRunning ? "default" : backup.status === "success" ? "success" : "destructive"}
                  className="ml-auto text-[10px] px-1"
                >
                  {backup.isRunning ? "SYNCING" : backup.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-3 flex-1">
                <div className="font-mono text-lg shrink-0">
                  <span className="font-black">{backup.size}</span>
                </div>
                {backup.isRunning ? (
                  /* Progress bar when backup is running */
                  <>
                    <div className="flex-1 h-4 bg-muted/30 border border-border/50 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary animate-pulse"
                        style={{ width: `${backup.progress}%` }}
                      />
                      <div
                        className="absolute inset-y-0 left-0 opacity-20"
                        style={{
                          width: `${backup.progress}%`,
                          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, var(--background) 4px, var(--background) 5px)`,
                        }}
                      />
                      <div
                        className="absolute inset-y-0 right-0"
                        style={{
                          left: `${backup.progress}%`,
                          backgroundImage: `radial-gradient(circle, var(--muted-foreground) 0.5px, transparent 0.5px)`,
                          backgroundSize: "4px 4px",
                          opacity: 0.2,
                        }}
                      />
                    </div>
                    <span className="font-mono text-sm tabular-nums text-primary shrink-0">
                      {backup.progress}%
                    </span>
                  </>
                ) : (
                  /* Idle state - show last backup info */
                  <>
                    <div className="flex-1 text-xs font-mono text-muted-foreground">
                      Last: {backup.lastRun}
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1 shrink-0">
                      IDLE
                    </Badge>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NodeCard({ node }: { node: typeof nodes[0] }) {
  // Badge based on node type
  const getBadge = () => {
    if (node.type === "proxmox") return { label: "HOST", variant: "default" as const };
    if (node.type === "gpu-node" || node.type === "workstation") return { label: "GPU", variant: "outline" as const };
    return null;
  };
  const badge = getBadge();

  return (
    <div className="border-2 border-border p-3 bg-card hover:bg-accent/30 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50 h-6">
        <PixelStatusOnline size={8} />
        <span className="text-xs font-black tracking-wider">{node.name}</span>
        {/* Spacer to push items to right */}
        <div className="flex-1" />
        {/* Docker container count */}
        {node.containers && (
          <div className="flex items-center gap-1">
            <PixelDocker size={10} />
            <span className="text-[10px] font-mono font-bold">{node.containers}</span>
          </div>
        )}
        {/* Node type badge */}
        {badge && (
          <Badge variant={badge.variant} className="text-[10px] px-1.5">
            {badge.label}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <StatRow icon={<PixelCPU size={10} />} label="CPU" value={node.cpu} />
        <StatRow icon={<PixelMemory size={10} />} label="MEM" value={node.memory} />
        <StatRow icon={<PixelTemp size={10} />} label="TMP" value={node.temp} unit="°C" max={100} />
        {"gpuLoad" in node && (
          <StatRow icon={<PixelCPU size={10} />} label="GPU" value={node.gpuLoad as number} />
        )}
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  unit = "%",
  max = 100,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  max?: number;
}) {
  const percentage = (value / max) * 100;
  const getBgClass = () => {
    if (percentage > 85) return "bg-destructive";
    if (percentage > 70) return "bg-warning";
    return "bg-success";
  };
  const getTextClass = () => {
    if (percentage > 85) return "text-destructive";
    if (percentage > 70) return "text-warning";
    return "text-success";
  };

  return (
    <div className="flex items-center gap-2 text-[10px] font-mono">
      {icon}
      <span className="w-7 text-muted-foreground shrink-0">{label}</span>
      {/* Simple progress bar with vertical stripes */}
      <div className="flex-1 h-2.5 bg-muted/30 border border-border/50 relative overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${getBgClass()}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Vertical stripes overlay */}
        <div
          className="absolute inset-y-0 left-0 opacity-20"
          style={{
            width: `${percentage}%`,
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 3px, var(--background) 3px, var(--background) 4px)`,
          }}
        />
        {/* Dot pattern on empty portion */}
        <div
          className="absolute inset-y-0 right-0"
          style={{
            left: `${percentage}%`,
            backgroundImage: `radial-gradient(circle, var(--muted-foreground) 0.5px, transparent 0.5px)`,
            backgroundSize: "4px 4px",
            opacity: 0.2,
          }}
        />
      </div>
      <span className={`w-9 text-right tabular-nums shrink-0 ${getTextClass()}`}>
        {value}{unit}
      </span>
    </div>
  );
}
