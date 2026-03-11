"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import StockChart from "../components/StockChart";
import PriceCard from "../components/PriceCard";
import BuyGauge from "../components/BuyGauge";
import SellGauge from "../components/SellGauge";
import PredictionCard from "../components/PredictionCard";
import Footer from "../components/Footer";

/**
 * API BASE URL
 * Uses environment variable in production.
 * Falls back to localhost for development.
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [input, setInput] = useState("AAPL");

  const [chartData, setChartData] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timeframe, setTimeframe] = useState("1M");

  async function loadStock(sym: string, tf: string = timeframe) {
    try {
      setLoading(true);
      setError(null);

      const normalized = sym.toUpperCase().trim();

      setSymbol(normalized);
      setInput(normalized);

      /** -------- CHART API -------- */
      const chartRes = await fetch(
        `${API_BASE}/chart/${normalized}?range=${tf}`,
        { cache: "no-store" }
      );

      if (!chartRes.ok) {
        throw new Error("Chart API failed");
      }

      const chart = await chartRes.json();

      if (!Array.isArray(chart)) {
        throw new Error("Invalid chart response");
      }

      setChartData(chart);

      /** -------- PREDICTION API -------- */
      const predRes = await fetch(
        `${API_BASE}/predict/${normalized}`,
        { cache: "no-store" }
      );

      if (!predRes.ok) {
        throw new Error("Prediction API failed");
      }

      const pred = await predRes.json();

      if (!pred || typeof pred !== "object") {
        throw new Error("Invalid prediction response");
      }

      setPrediction(pred);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setChartData([]);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  }

  /** Reload when timeframe changes */
  useEffect(() => {
    loadStock(symbol, timeframe);
  }, [timeframe]);

  /** Initial load */
  useEffect(() => {
    loadStock("AAPL", "1M");
  }, []);

  function analyze() {
    if (!input) return;
    loadStock(input, timeframe);
  }

  const buyPercent = prediction
    ? Math.round((prediction.confidence || 0) * 100)
    : 0;

  const sellPercent = 100 - buyPercent;

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-72 p-6 border-r border-slate-800 flex flex-col">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/logo.png"
            alt="AlphaScanAI Logo"
            width={120}
            height={120}
            className="rounded-full object-contain"
            priority
          />

          <h1 className="mt-3 text-xl font-bold tracking-wide">
            AlphaScanAI
          </h1>
        </div>

        {/* USER CARD */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded-lg bg-slate-900 border border-slate-700">
          <Image
            src="/logo.png"
            alt="User Avatar"
            width={36}
            height={36}
            className="rounded-full"
          />

          <div>
            <p className="text-sm font-semibold text-slate-200">
              User
            </p>
            <p className="text-xs text-slate-400">ID 393829</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-1 text-slate-400">
          {["Dashboard", "Portfolio", "Market", "Settings"].map(
            (item) => (
              <div
                key={item}
                className="cursor-pointer px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                {item}
              </div>
            )
          )}
        </nav>

        {/* POPULAR STOCKS */}
        <div className="mt-10">
          <p className="text-slate-400 mb-3 text-sm">
            Popular Stocks
          </p>

          {["AAPL", "TSLA", "NVDA", "AMZN"].map((s) => (
            <div
              key={s}
              onClick={() => loadStock(s, timeframe)}
              className="cursor-pointer hover:text-green-400 mb-2 text-sm"
            >
              {s}
            </div>
          ))}
        </div>
      </aside>

      {/* CONTENT COLUMN */}
      <div className="flex flex-col flex-1">
        {/* MAIN CONTENT */}
        <main className="flex-1 p-8">
          {/* SEARCH */}
          <div className="flex items-center gap-4 mb-8">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value.toUpperCase())
              }
              className="bg-slate-900 border border-slate-700 px-5 py-2 rounded-lg w-64 focus:outline-none focus:border-green-400"
            />

            <button
              onClick={analyze}
              className="bg-green-500 hover:bg-green-400 px-5 py-2 rounded-lg text-black font-semibold transition"
            >
              Analyze
            </button>

            {loading && (
              <span className="text-slate-400 text-sm">
                Loading...
              </span>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 text-red-400">{error}</div>
          )}

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <PriceCard price={prediction?.price || 0} />
            <BuyGauge value={buyPercent} />
            <SellGauge value={sellPercent} />
            <PredictionCard prediction={prediction} />
          </div>

          {/* CHART */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
            <div className="flex justify-end gap-3 mb-4">
              {["1D", "5D", "1M", "6M", "1Y"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm transition ${
                    timeframe === tf
                      ? "bg-green-500 text-black"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <StockChart data={chartData} />
          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
