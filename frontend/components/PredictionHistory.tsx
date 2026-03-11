"use client";

export default function PredictionHistory({ history }: any) {

  if (!history || history.length === 0) {
    return (
      <div style={{ marginTop: 20 }}>
        <h3>Prediction History</h3>
        <p>No predictions yet</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0f172a",
        padding: 20,
        borderRadius: 10,
        marginTop: 20
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Prediction History</h3>

      {history.map((h: any, i: number) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #1e293b",
            padding: "8px 0"
          }}
        >
          <span>{h.symbol}</span>

          <span style={{ color: h.signal === "UP" ? "#22c55e" : "#ef4444" }}>
            {h.signal}
          </span>

          <span>{h.price.toFixed(2)}</span>

          <span>{h.confidence}%</span>
        </div>
      ))}
    </div>
  );
}