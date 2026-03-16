"use client";

import { useState } from "react";

import PriceCard from "../components/PriceCard";
import BuyGauge from "../components/BuyGauge";
import SellGauge from "../components/SellGauge";
import PredictionCard from "../components/PredictionCard";
import StockChart from "../components/StockChart";
import StockSearch from "../components/StockSearch";
import Timeframe from "../components/Timeframe";

const API_URL = "https://alphascanai-backend.onrender.com";

type PredictionType = {
  price: number;
  prediction: "UP" | "DOWN";
  confidence: number;
  probabilities: {
    bullish: number;
    bearish: number;
  };
};

export default function Page() {

  const [symbol, setSymbol] = useState("AAPL");
  const [prediction, setPrediction] = useState<PredictionType | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (ticker: string) => {

    try {

      setLoading(true);

      const res = await fetch(`${API_URL}/predict/${ticker}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        console.error("API error:", data.error);
        return;
      }

      setPrediction(data);
      setPrice(data.price);
      setSymbol(ticker);

    } catch (err) {

      console.error("API request failed:", err);

    } finally {

      setLoading(false);

    }
  };

  const buyPercent =
    prediction?.probabilities
      ? Math.round(prediction.probabilities.bullish * 100)
      : 0;

  const sellPercent =
    prediction?.probabilities
      ? Math.round(prediction.probabilities.bearish * 100)
      : 0;

  return (

    <div className="p-6">

      {/* Search */}
      <StockSearch onAnalyze={handleAnalyze} loading={loading} />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">

        {/* Current Price */}
        <PriceCard price={price ?? 0} />

        {/* BUY Gauge */}
        <BuyGauge value={buyPercent} />

        {/* SELL Gauge */}
        <SellGauge value={sellPercent} />

        {/* AI Prediction */}
        <PredictionCard prediction={prediction} />

      </div>

      {/* Chart */}
      <div className="mt-8">

        <Timeframe />

        <StockChart symbol={symbol} />

      </div>

    </div>

  );
}
