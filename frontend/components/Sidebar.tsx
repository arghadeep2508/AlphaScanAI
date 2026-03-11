"use client";

export default function Sidebar() {
  return (
    <div
      style={{
        width: 220,
        background: "#020617",
        borderRight: "1px solid #1e293b",
        padding: 20,
        height: "100vh",
        color: "white"
      }}
    >
      <h2 style={{ marginBottom: 30 }}>AlphaScanAI</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>Dashboard</div>
        <div>Portfolio</div>
        <div>Market</div>
        <div>Settings</div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h4>Popular Stocks</h4>
        <div style={{ marginTop: 10 }}>AAPL</div>
        <div>TSLA</div>
        <div>NVDA</div>
        <div>AMZN</div>
      </div>
    </div>
  );
}