# Homelab Dashboard - 项目文档

## 项目概述

使用 **Brutalist Neo + Pixel Art** 风格构建的自定义 Homelab Dashboard，替代 Homarr。

- **项目名称**: STEVEN'S_HOMELAB
- **技术栈**: Next.js 15 + Tailwind CSS 4 + TypeScript
- **设计风格**: Brutalist Neo (0px border-radius, 2px borders, 4px offset shadows)
- **开发服务器**: http://localhost:3000
- **生产域名**: dashboard.geniuscai.com

---

## Phase 1 完成功能 (2025-12-16)

| 功能 | 状态 | 说明 |
|------|------|------|
| Brutalist Neo UI | ✅ | 0px 圆角, 2px 边框, 4px 阴影 |
| 像素风图标库 | ✅ | 自定义 SVG 像素图标 (20+) |
| 暗色/亮色模式 | ✅ | next-themes, 像素太阳/星星切换 |
| 像素头像动画 | ✅ | 喝咖啡 GIF 动画 |
| 服务卡片 (23个) | ✅ | 可点击跳转外部链接 |
| 系统概览 | ✅ | 3节点 + 2存储池 + 2云备份 |
| 快速访问 | ✅ | 9个常用服务 |
| 响应式布局 | ✅ | Bento Grid |
| 日历组件 | ✅ | 小型月历 + 当日高亮 |
| 时钟组件 | ✅ | 像素风数字时钟 |

---

## 设计规范

### Brutalist Neo 核心样式

```css
:root {
  /* === 边框 === */
  --border: 2px solid;
  --radius: 0px;           /* 所有元素强制锐角 */

  /* === 阴影 (Offset 风格) === */
  --shadow: 4px 4px 0px 0px;

  /* === 字体 (等宽) === */
  --font-sans: 'Geist Mono', 'JetBrains Mono', monospace;
}
```

### OKLCH 调色板

#### 亮色模式 (Light)
```css
:root {
  --primary: oklch(0.5066 0.2501 271.8903);        /* 紫色 */
  --background: oklch(0.9721 0.0158 110.5501);     /* 奶油色 */
  --foreground: oklch(0.5066 0.2501 271.8903);     /* 紫色文字 */
  --border: oklch(0.5066 0.2501 271.8903);         /* 紫色边框 */
  --success: oklch(0.7 0.15 145);                  /* 绿色 */
  --warning: oklch(0.75 0.15 85);                  /* 橙色 */
  --destructive: oklch(0.63 0.19 23.03);           /* 红色 */
}
```

#### 暗色模式 (Dark) - 深蓝灰色调
```css
.dark {
  --background: oklch(0.18 0.035 265);             /* 深蓝灰背景 */
  --foreground: oklch(0.92 0.01 110);              /* 浅色文字 */
  --card: oklch(0.22 0.04 265);                    /* 卡片背景 */
  --muted: oklch(0.25 0.04 265);                   /* 静音区域 */
  --border: oklch(0.35 0.06 270);                  /* 边框 */
  --primary: oklch(0.92 0.01 110);                 /* 主色 (反转) */
}
```

### 进度条颜色阈值

```tsx
if (percentage > 85) return "bg-destructive";  // 红色 - 危险
if (percentage > 70) return "bg-warning";      // 橙色 - 警告
return "bg-success";                            // 绿色 - 正常
```

---

## 暗色模式实现

### 技术方案: next-themes

```tsx
// src/app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

<ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### 主题切换组件

```tsx
// src/components/widgets/theme-toggle.tsx
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <PixelSun /> : <PixelStar />}
    </button>
  );
}
```

### 图标设计

- **亮色模式**: 像素星星 (⭐) - 多射线星芒，黄色 (#F7DD65) 填充 + 黑色轮廓
- **暗色模式**: 像素太阳 (☀️) - 中心 + 8射线，warning 颜色

---

## 像素头像实现

### 文件位置
```
public/images/avatar.gif
```

### 设计规格
- **尺寸**: 32x32 像素
- **动画**: 喝咖啡循环动画
- **风格**: 像素风，黑色轮廓

### 使用方式
```tsx
<img
  src="/images/avatar.gif"
  alt="Steven's Avatar"
  style={{ imageRendering: "pixelated" }}
/>
```

---

## 像素图标库

### 文件位置
```
src/components/ui/pixel-icons.tsx
```

### 可用图标

| 图标 | 组件名 | 用途 |
|------|--------|------|
| 状态在线 | `PixelStatusOnline` | 服务状态 |
| 状态离线 | `PixelStatusOffline` | 服务状态 |
| 向上箭头 | `PixelArrowUp` | 股票涨 |
| 向下箭头 | `PixelArrowDown` | 股票跌 |
| 比特币 | `PixelBitcoin` | 加密货币 |
| 图表 | `PixelChart` | 市场 |
| 家 | `PixelHome` | 旅程位置 |
| 咖啡 | `PixelCoffee` | 旅程位置 |
| 公园 | `PixelPark` | 旅程位置 |
| 定位 | `PixelPin` | 当前位置 |
| 播放/暂停 | `PixelPlay/Pause` | 媒体控制 |
| 展开/收起 | `PixelChevron*` | UI 交互 |

---

## 组件架构

### 页面布局 (`src/app/page.tsx`)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: Avatar + Title + Badge + ThemeToggle + Clock           │
├─────────────────────────────────────────────────────────────────┤
│  TOP BAR: Calendar | Quick Access | RSS Feed                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BENTO GRID (3 columns):                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Services     │  │ System       │  │ Today's Journey      │  │
│  │ (23 items)   │  │ Overview     │  │ (timeline)           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Markets      │  │ TODO         │  │ DNS Defense          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │ Calendar     │  │ (reserved)   │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER: Version + Uptime                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 组件清单

| 组件 | 文件 | 功能 |
|------|------|------|
| ThemeToggle | `widgets/theme-toggle.tsx` | 暗色/亮色切换 |
| Clock | `widgets/clock.tsx` | 实时时钟 |
| CalendarWidget | `widgets/calendar-widget.tsx` | 小型月历 |
| QuickAccess | `widgets/quick-access.tsx` | 快速访问栏 |
| ServicesCard | `widgets/services-card.tsx` | 23个服务状态 |
| SystemOverview | `widgets/system-overview.tsx` | 节点/存储/备份 |

---

## 后端架构规划 (Phase 2)

### BFF (Backend for Frontend) 模式

使用 Next.js API Routes 作为 BFF 层，代理各内部服务 API：

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Dashboard     │────▶│  Next.js API    │────▶│  Homelab APIs   │
│   (React)       │     │  Routes (BFF)   │     │  (Internal)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ├── /api/uptime     → Uptime Kuma
                              ├── /api/beszel     → Beszel
                              ├── /api/dawarich   → Dawarich
                              ├── /api/adguard    → AdGuard Home
                              ├── /api/freshrss   → FreshRSS
                              ├── /api/weather    → Open-Meteo
                              ├── /api/markets    → CoinGecko/Yahoo
                              └── /api/calendar   → Google Calendar
```

### API 集成优先级

| 优先级 | API | 功能 | 难度 |
|--------|-----|------|------|
| P0 | Uptime Kuma | 服务状态实时监控 | 简单 |
| P0 | Open-Meteo | 天气数据 | 简单 |
| P1 | Beszel | 系统资源监控 | 中等 |
| P1 | AdGuard Home | DNS 统计 | 简单 |
| P1 | CoinGecko | 加密货币价格 | 简单 |
| P2 | Dawarich | 位置追踪/旅程 | 中等 |
| P2 | FreshRSS | RSS 内容 | 中等 |
| P2 | Google Calendar | 日历事件 | 复杂 (OAuth) |

### 数据刷新策略 (React Query)

```tsx
// 服务状态 - 30秒刷新
useQuery({ queryKey: ['services'], refetchInterval: 30000 })

// 系统资源 - 10秒刷新
useQuery({ queryKey: ['system'], refetchInterval: 10000 })

// 天气 - 5分钟刷新
useQuery({ queryKey: ['weather'], refetchInterval: 300000 })

// 股市 - 1分钟刷新 (交易时间)
useQuery({ queryKey: ['markets'], refetchInterval: 60000 })
```

---

## 部署方案

### 部署策略: 独立 LXC

**核心理念**: 监控系统不应该和被监控的系统放在一起

```
┌─────────────────────────────────────────────────────────┐
│                    PVE Node 1 (.200)                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │ Docker VM (.80) │    │ Monitor LXC     │            │
│  │ (49 containers) │    │ (.85)           │            │
│  │                 │    │                 │            │
│  │ ● Jellyfin      │    │ ● Dashboard     │            │
│  │ ● Sonarr/Radarr │    │ ● (Uptime Kuma) │            │
│  │ ● n8n           │    │                 │            │
│  └─────────────────┘    └─────────────────┘            │
│          │                      │                      │
│          └──────────┬───────────┘                      │
│                     ▼                                  │
│          Cloudflare Tunnel                            │
└─────────────────────────────────────────────────────────┘
```

### 目标配置

| 项目 | 值 |
|------|-----|
| **LXC ID** | 104 (Monitor) |
| **IP** | 192.168.50.85 |
| **资源** | 2 vCPU / 2GB RAM / 20GB |
| **系统** | Debian 12 |
| **端口** | 3000 (Dashboard) |
| **域名** | dashboard.geniuscai.com |

### 部署命令

```bash
# 1. 创建 LXC (PVE)
pct create 104 local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst \
  --hostname monitor \
  --memory 2048 \
  --cores 2 \
  --rootfs local-lvm:20 \
  --net0 name=eth0,bridge=vmbr0,ip=192.168.50.85/24,gw=192.168.50.1 \
  --unprivileged 1 \
  --features nesting=1

# 2. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# 3. 部署 Dashboard
git clone https://github.com/Genius-Cai/homelab-dashboard.git /opt/dashboard
cd /opt/dashboard
npm ci && npm run build

# 4. PM2 进程管理
npm install -g pm2
pm2 start npm --name "dashboard" -- start
pm2 save && pm2 startup
```

---

## 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

---

## Phase 2 完成功能 (2025-12-17)

| 功能 | 状态 | 说明 |
|------|------|------|
| Blinko Todo 集成 | ✅ | 双列布局 (Today/Later)，双向同步 |
| Jellyfin 播放状态 | ✅ | 实时显示正在播放内容 |
| qBittorrent 下载 | ✅ | 活动流显示下载进度，过滤慢速 |
| Backblaze B2 备份 | ✅ | 显示云备份状态 |
| Beszel 系统监控 | ✅ | CPU/内存/温度实时数据 |
| 天气组件 | ✅ | Open-Meteo API 集成 |
| 市场行情 | ✅ | 加密货币 + 股票价格 |

### API 端点

| 端点 | 服务 | 刷新间隔 |
|------|------|----------|
| `/api/blinko` | Blinko Todo | 30s |
| `/api/jellyfin` | Jellyfin Sessions | 10s |
| `/api/qbittorrent` | qBit Downloads | 10s |
| `/api/backups` | B2 + S3 Status | 5min |
| `/api/beszel` | System Metrics | 10s |
| `/api/uptime` | Uptime Kuma | 30s |
| `/api/weather` | Open-Meteo | 5min |
| `/api/markets` | CoinGecko/Yahoo | 1min |

### 关键修复 (2025-12-17)

| 问题 | 原因 | 修复 |
|------|------|------|
| Todo 删除不生效 | Blinko API 端点错误 | `/note/delete` → `/note/batch-delete` |
| Services 全部 OFFLINE | API 调用无超时导致挂起 | 添加 3 秒 AbortController 超时 |
| Jellyfin 连接失败 | URL 指向错误 IP | `.80:8096` → `.184:8096` (fnOS) |
| B2 备份不显示 | accountId 获取错误 | 使用 auth response 中的 accountId |

---

## 待实现功能

- [ ] Today's Journey 右侧像素风悉尼地图
- [ ] Dawarich API 集成 (位置数据)
- [x] ~~Uptime Kuma API 集成~~ ✅ 2025-12-17 (带超时 fallback)
- [x] ~~Beszel API 集成~~ ✅ 2025-12-17
- [ ] FreshRSS API 集成 (RSS 内容)
- [ ] AdGuard API 集成 (DNS 统计)
- [x] ~~暗色模式支持~~ ✅ 2025-12-16
- [ ] 拖拽自定义布局
- [x] ~~天气组件~~ ✅ 2025-12-17 (Open-Meteo)
- [x] ~~股市/加密 Ticker~~ ✅ 2025-12-17 (CoinGecko)
- [x] ~~Blinko Todo 集成~~ ✅ 2025-12-17

---

## 版本历史

### v0.2.0 (2025-12-17)

**新增功能:**
- Blinko Todo 双向同步 (type=2 原生 todo)
- 双列 Todo 布局 (Today / Later)
- Jellyfin 实时播放状态
- qBittorrent 下载活动流 (过滤 <1MB/s 慢速下载)
- Backblaze B2 云备份状态
- 天气组件 (Open-Meteo)
- 市场行情 (BTC/ETH/SOL + 股票)

**Bug 修复:**
- 修复 Blinko 删除 API 端点 (`batch-delete`)
- 修复 Uptime Kuma API 超时问题
- 修复 Jellyfin URL 指向 fnOS
- 修复 B2 accountId 获取逻辑

**技术细节:**
- SWR 数据获取 + 乐观更新
- AbortController 超时处理
- Docker 部署 (192.168.50.80:3080)
- Cloudflare Tunnel 外部访问

### v0.1.0 (2025-12-16)

**新增功能:**
- Brutalist Neo + Pixel Art 设计系统
- 23 个服务快速访问
- 系统概览 (3节点 + 2存储池 + 2云备份)
- 暗色/亮色模式切换
- 像素风头像动画
- 自定义像素星星图标
- 响应式 Bento Grid 布局

**技术细节:**
- Next.js 15 App Router
- Tailwind CSS 4 + OKLCH 颜色
- next-themes 主题管理
- TypeScript 严格模式

---

*最后更新: 2025-12-17*
*状态: Phase 2 完成，已部署到 Docker VM (192.168.50.80:3080)*
