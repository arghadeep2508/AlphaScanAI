"use client";

export default function SignalCards({ prediction }: any) {

  if (!prediction) return null;

  const buy = prediction.prediction === "UP" ? 80 : 20;
  const sell = prediction.prediction === "DOWN" ? 80 : 20;

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        marginBottom: 20
      }}
    >

      <div
        style={{
          background: "#0f172a",
          padding: 20,
          borderRadius: 10,
          width: 200
        }}
      >
        <h4>BUY</h4>
        <h2 style={{ color: "#22c55e" }}>{buy}%</h2>
      </div>

      <div
        style={{
          background: "#0f172a",
          padding: 20,
          borderRadius: 10,
          width: 200
        }}
      >
        <h4>SELL</h4>
        <h2 style={{ color: "#ef4444" }}>{sell}%</h2>
      </div>

      <div
        style={{
          background: "#0f172a",
          padding: 20,
          borderRadius: 10,
          width: 200
        }}
      >
        <h4>Confidence</h4>
        <h2>{(prediction.confidence * 100).toFixed(1)}%</h2>
      </div>

    </div>
  );
}