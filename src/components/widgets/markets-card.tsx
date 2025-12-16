"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PixelArrowUp,
  PixelArrowDown,
  PixelBitcoin,
  PixelChart,
} from "@/components/ui/pixel-icons";
import { useMarkets, formatPrice, getChange } from "@/hooks/use-markets";

// Pixel Ethereum icon
function PixelEthereum({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <rect x="7" y="1" width="2" height="2" />
      <rect x="6" y="3" width="1" height="2" />
      <rect x="9" y="3" width="1" height="2" />
      <rect x="5" y="5" width="1" height="2" />
      <rect x="10" y="5" width="1" height="2" />
      <rect x="4" y="7" width="1" height="1" />
      <rect x="11" y="7" width="1" height="1" />
      <rect x="7" y="3" width="2" height="5" opacity="0.5" />
      <rect x="5" y="8" width="6" height="1" />
      <rect x="6" y="9" width="4" height="1" />
      <rect x="5" y="10" width="1" height="1" />
      <rect x="10" y="10" width="1" height="1" />
      <rect x="6" y="11" width="1" height="2" />
      <rect x="9" y="11" width="1" height="2" />
      <rect x="7" y="13" width="2" height="2" />
    </svg>
  );
}

function TickerSkeleton() {
  return (
    <div className="grid grid-cols-[70px_1fr_80px] items-center text-sm font-mono p-1 -mx-1 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-muted rounded" />
        <div className="w-8 h-4 bg-muted rounded" />
      </div>
      <div className="w-16 h-4 bg-muted rounded ml-auto mr-4" />
      <div className="w-12 h-4 bg-muted rounded ml-auto" />
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
        <span
          className={`tabular-nums ${isPositive ? "text-success" : "text-destructive"}`}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

export function MarketsCard() {
  const { data, isLoading, isError, dataUpdatedAt } = useMarkets();

  const getIcon = (symbol: string) => {
    switch (symbol) {
      case "BTC":
        return <PixelBitcoin size={14} />;
      case "ETH":
        return <PixelEthereum size={14} />;
      default:
        return <PixelChart size={14} />;
    }
  };

  return (
    <Card className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PixelChart size={16} />
            MARKETS
          </span>
          {dataUpdatedAt && (
            <span className="text-[10px] font-normal text-muted-foreground">
              {new Date(dataUpdatedAt).toLocaleTimeString("en-AU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <>
            <TickerSkeleton />
            <TickerSkeleton />
            <TickerSkeleton />
            <TickerSkeleton />
          </>
        ) : isError ? (
          <div className="text-sm text-destructive font-mono">
            Failed to load market data
          </div>
        ) : (
          data?.data.map((item) => (
            <TickerItem
              key={item.symbol}
              symbol={item.symbol}
              price={formatPrice(item.price, item.symbol)}
              change={getChange(item)}
              icon={getIcon(item.symbol)}
            />
          ))
        )}

        {!isLoading && !isError && (
          <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-muted-foreground font-mono">
            [auto-refresh: 60s]
          </div>
        )}
      </CardContent>
    </Card>
  );
}
