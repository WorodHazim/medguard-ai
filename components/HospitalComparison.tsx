"use client";

import { RecommendationResult } from "@/lib/recommendation";

interface HospitalComparisonProps {
  hospitals: RecommendationResult[];
}

export default function HospitalComparison({ hospitals }: HospitalComparisonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility Metric</th>
            {hospitals.map((h, i) => (
              <th key={i} className="py-4 px-4 text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">
                {h.hospitalShortName}
                {i === 0 && <span className="ml-2 px-2 py-0.5 bg-blue-50 text-medical-blue rounded-lg text-[8px]">PRIMARY</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="py-4 px-2 text-xs font-bold text-slate-500 italic">Distance Fit</td>
            {hospitals.map((h, i) => (
              <td key={i} className="py-4 px-4 text-center">
                <div className="text-sm font-black text-slate-800">{h.distance}</div>
                <div className="text-[10px] font-bold text-slate-400">{h.travelTime}</div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="py-4 px-2 text-xs font-bold text-slate-500 italic">Availability</td>
            {hospitals.map((h, i) => (
              <td key={i} className="py-4 px-4 text-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  h.availability === 'High' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {h.availability}
                </span>
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="py-4 px-2 text-xs font-bold text-slate-500 italic">Clinical Score</td>
            {hospitals.map((h, i) => (
              <td key={i} className="py-4 px-4 text-center">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[80px] mx-auto">
                   <div 
                     className="h-full bg-medical-blue" 
                     style={{ width: `${h.subScores?.clinical || 0}%` }}
                   ></div>
                </div>
                <span className="text-[10px] font-black text-slate-700 mt-1 block">
                  {h.subScores?.clinical}%
                </span>
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="py-4 px-2 text-xs font-bold text-slate-500 italic">Differentiators</td>
            {hospitals.map((h, i) => (
              <td key={i} className="py-4 px-4 text-center">
                <p className={`text-[10px] font-bold leading-relaxed max-w-[120px] mx-auto ${i === 0 ? 'text-medical-blue uppercase tracking-widest' : 'text-slate-400 italic'}`}>
                  {i === 0 ? "PRIMARY MATCHED PROTOCOLS" : h.whyNotReason}
                </p>
              </td>
            ))}
          </tr>
          <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="py-4 px-2 text-xs font-bold text-slate-500 italic">Final AI Fit</td>
            {hospitals.map((h, i) => (
              <td key={i} className="py-4 px-4 text-center">
                <span className={`text-lg font-black ${i === 0 ? 'text-medical-blue' : 'text-slate-400'}`}>
                  {h.score}%
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
