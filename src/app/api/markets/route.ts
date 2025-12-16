import { NextResponse } from "next/server";

// CoinGecko API (free, no key needed)
const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Yahoo Finance API (via public endpoint)
const YAHOO_API = "https://query1.finance.yahoo.com/v8/finance/chart";

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  type: "crypto";
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  type: "stock";
}

type MarketData = CryptoData | StockData;

async function fetchCrypto(): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    return [
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: data.bitcoin?.usd || 0,
        change24h: data.bitcoin?.usd_24h_change || 0,
        type: "crypto",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: data.ethereum?.usd || 0,
        change24h: data.ethereum?.usd_24h_change || 0,
        type: "crypto",
      },
    ];
  } catch (error) {
    console.error("Failed to fetch crypto data:", error);
    return [];
  }
}

async function fetchStock(symbol: string): Promise<StockData | null> {
  try {
    const response = await fetch(
      `${YAHOO_API}/${symbol}?interval=1d&range=1d`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`Yahoo API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose || meta.previousClose;
    const change = previousClose ? ((price - previousClose) / previousClose) * 100 : 0;

    return {
      symbol: symbol,
      name: meta.shortName || symbol,
      price: price,
      change: change,
      type: "stock",
    };
  } catch (error) {
    console.error(`Failed to fetch stock ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // Fetch crypto and stocks in parallel
    const [cryptoData, nvda, qqq] = await Promise.all([
      fetchCrypto(),
      fetchStock("NVDA"),
      fetchStock("QQQ"),
    ]);

    const markets: MarketData[] = [
      ...cryptoData,
      ...(nvda ? [nvda] : []),
      ...(qqq ? [qqq] : []),
    ];

    return NextResponse.json({
      success: true,
      data: markets,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Markets API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
