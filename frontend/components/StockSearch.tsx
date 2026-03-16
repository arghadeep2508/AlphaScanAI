"use client";

import { useState } from "react";

export default function StockSearch({ onAnalyze }: any) {

  const [symbol, setSymbol] = useState("AAPL");

  const submit = () => {
    if (!symbol) return;
    onAnalyze(symbol.toUpperCase());
  };

  return (

    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>

      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Search stock (AAPL)"
        style={{
          padding: 10,
          borderRadius: 6,
          border: "1px solid #334155",
          background: "#020617",
          color: "white"
        }}
      />

      <button
        onClick={submit}
        style={{
          padding: "10px 20px",
          background: "#22c55e",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Analyze
      </button>

    </div>

  );
}
