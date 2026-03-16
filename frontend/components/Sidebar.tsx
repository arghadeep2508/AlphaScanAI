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

      {/* LOGO SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 28
        }}
      >
        <img
          src="/logo.png"
          alt="AlphaScanAI"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            marginBottom: 10
          }}
        />

        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            textAlign: "center"
          }}
        >
          AlphaScanAI
        </h2>
      </div>

      {/* USER CARD */}
      <div
        style={{
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: 12,
          marginBottom: 28,
          background: "#0f172a"
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500 }}>User</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>ID 393829</div>
      </div>

      {/* MENU */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        <div style={{ cursor: "pointer" }}>Dashboard</div>
        <div style={{ cursor: "pointer" }}>Portfolio</div>
        <div style={{ cursor: "pointer" }}>Market</div>
        <div style={{ cursor: "pointer" }}>Settings</div>
      </div>

      {/* POPULAR STOCKS */}
      <div style={{ marginTop: 40 }}>
        <h4 style={{ marginBottom: 10 }}>Popular Stocks</h4>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}
        >
          <div>AAPL</div>
          <div>TSLA</div>
          <div>NVDA</div>
          <div>AMZN</div>
        </div>
      </div>

    </div>
  );
}
