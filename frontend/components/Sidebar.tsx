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
        color: "white",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Logo + Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 30
        }}
      >
        <img
          src="/logo.png"
          alt="AlphaScanAI"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%"
          }}
        />

        <span style={{ fontSize: 18, fontWeight: 600 }}>
          AlphaScanAI
        </span>
      </div>

      {/* Main Menu */}
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div style={{ cursor: "pointer" }}>Dashboard</div>
        <div style={{ cursor: "pointer" }}>Portfolio</div>
        <div style={{ cursor: "pointer" }}>Market</div>
        <div style={{ cursor: "pointer" }}>Settings</div>
      </div>

      {/* Popular Stocks */}
      <div style={{ marginTop: 40 }}>
        <h4 style={{ marginBottom: 10 }}>Popular Stocks</h4>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div>AAPL</div>
          <div>TSLA</div>
          <div>NVDA</div>
          <div>AMZN</div>
        </div>
      </div>
    </div>
  );
}
