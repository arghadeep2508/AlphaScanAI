"use client";

const frames = ["1D", "5D", "1M", "6M", "YTD"];

export default function Timeframe({ selected, setFrame }: any) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
      {frames.map((f) => (
        <button
          key={f}
          onClick={() => setFrame(f)}
          style={{
            padding: "6px 14px",
            background: selected === f ? "#22c55e" : "#1e293b",
            border: "none",
            borderRadius: 6,
            color: "white",
            cursor: "pointer"
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}