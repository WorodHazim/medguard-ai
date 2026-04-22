"use client";

import { RecommendationResult } from "@/lib/recommendation";

interface AlternativeHospitalCardProps {
  result: RecommendationResult;
  rank: number;
}

export default function AlternativeHospitalCard({ result, rank }: AlternativeHospitalCardProps) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 transition-all duration-200 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
              #{rank}
            </span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
              {result.matchTag || "Alternative"}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 leading-tight">
            {result.hospitalName}
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{result.hospitalType}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-slate-800">{result.travelTime}</div>
          <div className="text-[10px] font-bold text-slate-400">{result.distance}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            result.availability === "High" ? "bg-emerald-500" : "bg-yellow-500"
          }`} />
          <span className="text-[10px] font-bold text-slate-500 uppercase">{result.availability} Availability</span>
        </div>
        {result.whyNotReason && (
          <div className="text-[10px] font-medium text-slate-400 italic">
            {result.whyNotReason}
          </div>
        )}
      </div>
    </div>
  );
}
