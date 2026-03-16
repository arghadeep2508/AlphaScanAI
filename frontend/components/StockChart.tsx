"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries
} from "lightweight-charts";

const API_URL = "https://alphascanai-backend.onrender.com";

export default function StockChart({ symbol }: { symbol: string }) {

  const mainChartRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<HTMLDivElement>(null);
  const rsiChartRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<any[]>([]);

  /* -------- FETCH DATA FROM BACKEND -------- */

  useEffect(() => {

    async function load() {
      try {

        const res = await fetch(`${API_URL}/chart/${symbol}`);
        const json = await res.json();

        setData(json);

      } catch (err) {
        console.error("Chart API error", err);
      }
    }

    load();

  }, [symbol]);

  /* -------- RENDER CHART -------- */

  useEffect(() => {

    if (!data || data.length === 0) return;
    if (!mainChartRef.current || !macdChartRef.current || !rsiChartRef.current) return;

    const formatted = data.map((d: any) => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume
    }));

    const closes = formatted.map((d: any) => d.close);

    /* -------- MAIN CHART -------- */

    const chart = createChart(mainChartRef.current, {
      width: mainChartRef.current.clientWidth,
      height: 420,
      layout: {
        background: { color: "#020617" },
        textColor: "#cbd5f5"
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" }
      }
    });

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444"
    });

    candles.setData(formatted);

    /* -------- VOLUME -------- */

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume"
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.75, bottom: 0 }
    });

    volumeSeries.setData(
      formatted.map((d: any) => ({
        time: d.time,
        value: d.volume,
        color: d.close > d.open ? "#22c55e" : "#ef4444"
      }))
    );

    /* -------- SMA -------- */

    function SMA(period: number) {

      const result: any[] = [];

      for (let i = period; i < closes.length; i++) {

        let sum = 0;

        for (let j = 0; j < period; j++) {
          sum += closes[i - j];
        }

        result.push({
          time: formatted[i].time,
          value: sum / period
        });

      }

      return result;
    }

    const sma20 = chart.addSeries(LineSeries, { color: "#3b82f6", lineWidth: 2 });
    sma20.setData(SMA(20));

    const sma50 = chart.addSeries(LineSeries, { color: "#f59e0b", lineWidth: 2 });
    sma50.setData(SMA(50));

    chart.timeScale().fitContent();

    /* -------- MACD -------- */

    function EMA(period: number, values: number[]) {

      const k = 2 / (period + 1);
      const ema: number[] = [];
      ema[0] = values[0];

      for (let i = 1; i < values.length; i++) {
        ema[i] = values[i] * k + ema[i - 1] * (1 - k);
      }

      return ema;
    }

    const ema12 = EMA(12, closes);
    const ema26 = EMA(26, closes);

    const macd = ema12.map((v, i) => v - ema26[i]);
    const signal = EMA(9, macd);
    const histogram = macd.map((v, i) => v - signal[i]);

    const macdChart = createChart(macdChartRef.current, {
      width: macdChartRef.current.clientWidth,
      height: 180,
      layout: { background: { color: "#020617" }, textColor: "#cbd5f5" }
    });

    const macdLine = macdChart.addSeries(LineSeries, { color: "#22c55e" });

    macdLine.setData(
      macd.map((v, i) => ({ time: formatted[i].time, value: v }))
    );

    const signalLine = macdChart.addSeries(LineSeries, { color: "#ef4444" });

    signalLine.setData(
      signal.map((v, i) => ({ time: formatted[i].time, value: v }))
    );

    const hist = macdChart.addSeries(HistogramSeries);

    hist.setData(
      histogram.map((v, i) => ({
        time: formatted[i].time,
        value: v,
        color: v > 0 ? "#22c55e" : "#ef4444"
      }))
    );

    macdChart.timeScale().fitContent();

    /* -------- RSI -------- */

    function RSI(period: number) {

      const rsi: any[] = [];

      for (let i = period; i < closes.length; i++) {

        let gain = 0;
        let loss = 0;

        for (let j = 1; j <= period; j++) {

          const diff = closes[i - j + 1] - closes[i - j];

          if (diff > 0) gain += diff;
          else loss -= diff;

        }

        const rs = gain / (loss || 1);
        const value = 100 - 100 / (1 + rs);

        rsi.push({
          time: formatted[i].time,
          value
        });

      }

      return rsi;
    }

    const rsiChart = createChart(rsiChartRef.current, {
      width: rsiChartRef.current.clientWidth,
      height: 160,
      layout: { background: { color: "#020617" }, textColor: "#cbd5f5" }
    });

    const rsiSeries = rsiChart.addSeries(LineSeries, {
      color: "#a855f7",
      lineWidth: 2
    });

    rsiSeries.setData(RSI(14));

    rsiChart.timeScale().fitContent();

    return () => {
      chart.remove();
      macdChart.remove();
      rsiChart.remove();
    };

  }, [data]);

  return (
    <>
      <div ref={mainChartRef} style={{ width: "100%", height: "420px" }} />
      <div ref={macdChartRef} style={{ width: "100%", height: "180px", marginTop: "10px" }} />
      <div ref={rsiChartRef} style={{ width: "100%", height: "160px", marginTop: "10px" }} />
    </>
  );

}
