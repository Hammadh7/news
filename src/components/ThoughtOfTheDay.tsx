"use client";

import { useState, useRef, useEffect } from "react";

interface Quote {
  quote: string;
  author: string;
}

export default function ThoughtOfTheDay() {
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchQuote = async () => {
    if (quote) {
      setOpen(!open);
      return;
    }
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch("https://indian-quotes-api.vercel.app/api/quotes/random");
      const data = await res.json();
      setQuote({ quote: data.quote, author: data.author });
    } catch {
      setQuote({ quote: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" });
    }
    setLoading(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={fetchQuote}
        className="flex items-center gap-1.5 text-sm hover:text-gray-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Thought of the Day
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-xl rounded-lg p-5 z-50 w-[320px]">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : quote ? (
            <>
              <div className="text-gray-400 text-2xl font-serif leading-none mb-2">&ldquo;</div>
              <p className="text-sm text-gray-800 leading-relaxed font-serif italic">
                {quote.quote}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">
                  &mdash; {quote.author}
                </span>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setLoading(true);
                    try {
                      const res = await fetch("https://indian-quotes-api.vercel.app/api/quotes/random");
                      const data = await res.json();
                      setQuote({ quote: data.quote, author: data.author });
                    } catch { /* keep current */ }
                    setLoading(false);
                  }}
                  className="text-[10px] text-gray-400 hover:text-gray-600 uppercase tracking-wider"
                >
                  New quote
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
