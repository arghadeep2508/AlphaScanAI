"use client";

export default function PredictionCard({ prediction }: any) {

  if (!prediction || !prediction.forecasts) return null;

  // 1 Day forecast used as main signal
  const forecast1D = prediction.forecasts[0];

  const isUp = forecast1D.direction === "UP";

  const signalText = isUp ? "BUY" : "SELL";

  const confidence = forecast1D.confidence * 100;

  const expectedMove = forecast1D.expected_move_pct;

  return (

    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg h-[180px] flex flex-col justify-between">

      {/* Header */}
      <div className="flex items-center gap-2 text-slate-400 text-sm">

        <img
          src="/logo.png"
          alt="AlphaScanAI"
          className="w-5 h-5"
        />

        <span>AlphaScanAI Prediction</span>

      </div>

      {/* Prediction Signal */}

      <div
        className={`text-3xl font-bold ${
          isUp ? "text-green-400" : "text-red-400"
        }`}
      >
        {signalText}
      </div>

      {/* Confidence + Move */}

      <div className="flex justify-between">

        <div>
          <div className="text-slate-400 text-sm">
            Confidence
          </div>

          <div className="text-xl font-semibold">
            {confidence.toFixed(2)}%
          </div>
        </div>

        <div>
          <div className="text-slate-400 text-sm">
            Expected Move
          </div>

          <div className="text-xl font-semibold">
            {expectedMove.toFixed(2)}%
          </div>
        </div>

      </div>

    </div>

  );
}
