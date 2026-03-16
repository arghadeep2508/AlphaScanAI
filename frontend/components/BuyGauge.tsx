"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
  value: number;
};

export default function BuyGauge({ value }: Props) {

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 
    border border-slate-700 
    rounded-xl 
    p-6 
    shadow-lg 
    h-[160px] 
    flex flex-col justify-center items-center">

      <div className="text-slate-400 text-sm mb-2">
        BUY Percentage
      </div>

      <div className="w-20 h-20">

        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textColor: "#22c55e",
            pathColor: "#22c55e",
            trailColor: "#1e293b"
          })}
        />

      </div>

      <div className="text-xs text-slate-400 mt-2">
        people are Buying
      </div>

    </div>
  );
}
