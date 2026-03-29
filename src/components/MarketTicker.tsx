"use client";

import { useState, useEffect } from "react";

interface MarketItem {
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function MarketTicker() {
  const [data, setData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/market");
        const json = await res.json();
        if (Array.isArray(json)) setData(json);
      } catch {
        // silently fail
      }
      setLoading(false);
    };

    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto text-xs font-sans">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 animate-pulse">
              <div className="h-3 w-16 bg-gray-800 rounded" />
              <div className="h-3 w-12 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) return null;

  return (
    <div className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide py-1.5">
          {data.map((item) => {
            const isUp = item.change >= 0;
            const hasData = item.price > 0;

            return (
              <div
                key={item.name}
                className="flex items-center gap-2 px-3 shrink-0 border-r border-gray-800 last:border-0"
              >
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  {item.name}
                </span>
                {hasData ? (
                  <>
                    <span className="text-xs font-semibold tabular-nums">
                      {item.price.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span
                      className={`text-[10px] font-medium tabular-nums flex items-center gap-0.5 ${
                        isUp ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      <svg
                        className={`w-2.5 h-2.5 ${isUp ? "" : "rotate-180"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {Math.abs(item.changePercent).toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-600">--</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
