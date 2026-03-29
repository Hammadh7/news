import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYMBOLS = {
  "NIFTY 50": "^NSEI",
  SENSEX: "^BSESN",
  GOLD: "GC=F",
  SILVER: "SI=F",
  "CRUDE OIL": "CL=F",
  "NIFTY NEXT 50": "^NSMIDCP50",
};

interface MarketItem {
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

let cache: { data: MarketItem[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  // Return cached data if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const tickers = Object.values(SYMBOLS).join(",");
    const url = `https://query2.finance.yahoo.com/v6/finance/quote?symbols=${encodeURIComponent(tickers)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      // Try fallback endpoint
      return await fetchFallback();
    }

    const json = await res.json();
    const quotes = json?.quoteResponse?.result || [];

    const entries = Object.entries(SYMBOLS);
    const data: MarketItem[] = entries.map(([name, symbol]) => {
      const quote = quotes.find(
        (q: { symbol: string }) => q.symbol === symbol
      );
      if (!quote) return { name, price: 0, change: 0, changePercent: 0 };
      return {
        name,
        price: quote.regularMarketPrice ?? 0,
        change: quote.regularMarketChange ?? 0,
        changePercent: quote.regularMarketChangePercent ?? 0,
      };
    });

    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch {
    return await fetchFallback();
  }
}

async function fetchFallback(): Promise<NextResponse> {
  try {
    const entries = Object.entries(SYMBOLS);
    const data: MarketItem[] = [];

    for (const [name, symbol] of entries) {
      try {
        const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (meta) {
          const price = meta.regularMarketPrice ?? 0;
          const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
          const change = price - prevClose;
          const changePercent = prevClose ? (change / prevClose) * 100 : 0;
          data.push({ name, price, change, changePercent });
        } else {
          data.push({ name, price: 0, change: 0, changePercent: 0 });
        }
      } catch {
        data.push({ name, price: 0, change: 0, changePercent: 0 });
      }
    }

    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch {
    // Return cached data even if stale, or empty array
    return NextResponse.json(cache?.data || []);
  }
}
