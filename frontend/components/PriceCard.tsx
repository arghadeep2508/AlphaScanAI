"use client";

export default function PriceCard({ price }: { price: number }) {

  return (

    <div className="bg-gradient-to-br from-slate-900 to-slate-800
    border border-slate-700 rounded-xl p-6 shadow-lg h-[160px]">

      <div className="text-slate-400 text-sm">
        Current Price
      </div>

      <div className="text-4xl font-bold mt-3 text-white">
        ${price?.toFixed(2)}
      </div>

      <div className="text-green-400 text-sm mt-2">
        Live Market
      </div>

    </div>

  );

}