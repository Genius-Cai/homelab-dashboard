# Homelab Dashboard - 项目文档

## 项目概述

使用 **Brutalist Neo + Pixel Art** 风格构建的自定义 Homelab Dashboard，替代 Homarr。

- **项目名称**: STEVEN'S_HOMELAB
- **技术栈**: Next.js 15 + Tailwind CSS + TypeScript
- **设计风格**: Brutalist Neo (0px border-radius, 2px borders, 4px offset shadows)
- **开发服务器**: http://localhost:3000

---

## 2025-12-16 修改记录

### 1. System Overview 组件 (`src/components/widgets/system-overview.tsx`)

#### 1.1 支持多个存储池
```tsx
// 从单个 storage 对象改为 storagePools 数组
const storagePools = [
  { name: "TANK", used: 14.2, total: 27.3, status: "healthy", type: "media/docker" },
  { name: "COLD", used: 8.5, total: 14.5, status: "healthy", type: "backup/archive" },
];
```

#### 1.2 支持多个备份目标
```tsx
// 从单个 backup 对象改为 backups 数组，增加运行状态
const backups = [
  { name: "Backblaze B2", lastRun: "2025-12-15 04:00", status: "success", size: "138 GB", isRunning: false, progress: 0 },
  { name: "AWS S3", lastRun: "2025-12-14 02:00", status: "success", size: "892 GB", isRunning: true, progress: 67 },
];
```

#### 1.3 备份卡片状态显示
- **正在备份** (`isRunning: true`): 显示 "SYNCING" Badge + 进度条 + 百分比
- **空闲状态** (`isRunning: false`): 显示 "SUCCESS" Badge + "Last: 日期" + "IDLE" 标签

#### 1.4 移除冗余虚线
- Storage Pools 和 Cloud Backups 之间不再有虚线分隔
- 只保留 Nodes 和 Storage 之间的虚线

#### 1.5 节点 Header 对齐修复
```tsx
// 添加固定高度确保三个节点卡片的横线对齐
<div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50 h-6">
```

#### 1.6 进度条空白部分点阵效果
```tsx
// StatRow 组件添加点阵背景
<div
  className="absolute inset-y-0 right-0"
  style={{
    left: `${percentage}%`,
    backgroundImage: `radial-gradient(circle, var(--muted-foreground) 0.5px, transparent 0.5px)`,
    backgroundSize: "4px 4px",
    opacity: 0.2,
  }}
/>
```

---

### 2. Quick Access 组件 (`src/components/widgets/quick-access.tsx`)

#### 2.1 布局从分类垂直改为扁平水平
```tsx
// 之前: 按分类分组垂直排列
// 之后: 所有服务扁平化，flex-wrap 自动换行
<div className="flex flex-wrap gap-1.5 content-start">
  {categories.flatMap((category) =>
    category.services.map((service) => (
      // 服务按钮
    ))
  )}
</div>
```

#### 2.2 实时动态移到底部
```tsx
// 从右侧垂直区域改为底部水平排列
<div className="mt-3 pt-2 border-t border-border/30">
  <div className="flex gap-4">
    {recentActivities.map((activity) => (...))}
  </div>
</div>
```

---

### 3. Services Card 组件 (`src/components/widgets/services-card.tsx`)

#### 3.1 移除展开/收起功能
```tsx
// 删除: useState, INITIAL_SHOW, expanded 状态
// 删除: "SHOW X MORE" 按钮
// 删除: PixelChevronDown, PixelChevronUp 导入
```

#### 3.2 改为双列网格布局
```tsx
// 一次显示全部 23 个服务
<div className="grid grid-cols-2 gap-x-4 gap-y-1">
  {allServices.map((service) => (
    <ServiceItem key={service.name} {...service} />
  ))}
</div>
```

---

### 4. DNS Defense 卡片 (`src/app/page.tsx`)

#### 4.1 ASCII 进度条改为 CSS 全宽进度条
```tsx
// 之前: <ASCIIProgress value={10} size="sm" showPercentage={false} />
// 之后: CSS 进度条 + 点阵效果
<div className="h-3 bg-muted/30 border border-border/50 relative overflow-hidden">
  <div className="absolute inset-y-0 left-0 bg-success" style={{ width: "10%" }} />
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
```

---

### 5. 顶部栏响应式布局 (`src/app/page.tsx`)

#### 5.1 固定像素改为弹性单位
```tsx
// 之前: 固定像素，150% 缩放时不对齐
md:grid-cols-[180px_1fr_650px]

// 之后: 弹性单位，任意缩放都保持比例
md:grid-cols-[minmax(160px,1fr)_3fr_minmax(300px,2fr)]
```

---

## 节点配置 (Mock Data)

```tsx
const nodes = [
  { id: "pve-main", name: "PVE", type: "proxmox", cpu: 68, memory: 82, temp: 52, containers: 49 },
  { id: "pve-3090", name: "3090-NODE", type: "gpu-node", cpu: 35, memory: 56, temp: 45, gpuLoad: 28 },
  { id: "rtx4090", name: "4090-PC", type: "workstation", cpu: 23, memory: 45, temp: 38, gpuLoad: 12 },
];
```

---

## 设计规范

### 颜色
- Primary: `#5046E5` (紫色)
- Background: `#F5F3EE` (奶油色)
- Success: 绿色 (在线/健康状态)
- Destructive: 红色 (离线/错误状态)
- Warning: 橙色 (>70% 使用率)

### 进度条颜色阈值
```tsx
if (percentage > 85) return "bg-destructive";  // 红色
if (percentage > 70) return "bg-warning";      // 橙色
return "bg-success";                            // 绿色
```

### Brutalist 元素
- 所有元素 `border-radius: 0`
- 边框: `2px solid`
- 阴影: `4px 4px 0 #000`
- 虚线分隔: `border-dashed border-border/50`

---

## 待实现功能

- [ ] Today's Journey 右侧像素风悉尼地图
- [ ] Dawarich API 集成 (位置数据)
- [ ] Uptime Kuma API 集成 (服务状态)
- [ ] Beszel API 集成 (系统资源)
- [ ] FreshRSS API 集成 (RSS 内容)
- [ ] AdGuard API 集成 (DNS 统计)
- [ ] 暗色模式支持
- [ ] 拖拽自定义布局

---

## 快速命令

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check
```

---

*最后更新: 2025-12-16*
