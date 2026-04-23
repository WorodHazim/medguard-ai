"use client";

import { useMemo } from "react";
import type { RecommendationResult } from "@/lib/recommendation";
import DecisionReasoning from "./DecisionReasoning";
import ScoreBreakdown from "./ScoreBreakdown";
import HospitalComparison from "./HospitalComparison";

interface AIDecisionPanelProps {
  result: RecommendationResult;
}

export default function AIDecisionPanel({ result }: AIDecisionPanelProps) {
  const riskConfig = useMemo(() => {
    const risk = result.riskLevel || "LOW";
    const configs = {
      CRITICAL: { label: "CRITICAL", color: "bg-red-600", textColor: "text-red-50", icon: "🔴", bar: "w-full" },
      HIGH: { label: "HIGH RISK", color: "bg-orange-500", textColor: "text-orange-50", icon: "🟠", bar: "w-[75%]" },
      MODERATE: { label: "MODERATE", color: "bg-yellow-500", textColor: "text-yellow-50", icon: "🟡", bar: "w-[50%]" },
      LOW: { label: "LOW RISK", color: "bg-emerald-500", textColor: "text-emerald-50", icon: "🟢", bar: "w-[25%]" },
    };
    return configs[risk as keyof typeof configs];
  }, [result.riskLevel]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* 🟢 TOP SECTION: RISK + CONFIDENCE */}
      <section className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-100/50 border border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap items-center gap-4">
              <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] ${riskConfig.color} ${riskConfig.textColor} shadow-xl shadow-slate-200`}>
                AI RISK: {riskConfig.label} {riskConfig.icon}
              </span>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-medical-blue animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                  Precision Match v2.6.4
                </span>
              </div>
            </div>
            
            <div>
              <h2 className="text-5xl font-black tracking-tight text-slate-900 leading-none">
                {result.hospitalName}
              </h2>
              <p className="text-medical-blue font-black uppercase tracking-[0.3em] text-[10px] mt-3">
                {result.hospitalType} • Verified Specialty Centre
              </p>
            </div>

            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden max-w-sm">
              <div 
                className={`h-full ${riskConfig.color} transition-all duration-1000 ease-out`} 
                style={{ width: riskConfig.bar }}
              ></div>
            </div>
          </div>

          {/* Confidence Score Display */}
          <div className="flex items-center gap-8 bg-slate-900/5 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-28 h-28 -rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle 
                  cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="12" 
                  strokeDasharray={301.6} 
                  strokeDashoffset={301.6 * (1 - (result.score || 0) / 100)} 
                  className="text-medical-blue transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className="text-2xl font-black text-slate-900 leading-none">{result.score}%</span>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Match</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confidence Index</p>
              <p className="text-xs font-bold text-slate-600 leading-snug">Algorithmic probability of optimal outcome.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🟠 MIDDLE SECTION: DECISION + REASONING */}
      <section className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8">
        <div className="bg-medical-blue rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 relative group overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-100 mb-6 block opacity-70">Strategic Decision</span>
          <p className="text-2xl md:text-3xl font-bold leading-tight italic">
            "{result.recommendation}"
          </p>
        </div>
        
        <DecisionReasoning reasons={result.reasons} />
      </section>

      {/* 🔵 BOTTOM SECTION: BREAKDOWN + WARNING */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
        <ScoreBreakdown items={result.scoreBreakdown || []} />
        
        <div className="space-y-8">
          {/* If delayed... Warning */}
          <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 flex gap-6 relative overflow-hidden group h-full flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex gap-6 relative z-10">
               <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-2xl flex-shrink-0 animate-pulse">⏱️</div>
               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Temporal Criticality</h4>
                  <p className="text-lg font-bold text-red-900 leading-snug italic">
                    {result.consequence || "Immediate care is essential to mitigate long-term diagnostic complications."}
                  </p>
               </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-red-100 relative z-10">
               <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-relaxed">
                 AI Warning: Delay in treatment for high-acuity cases significantly correlates with adverse clinical trajectories.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Comparison Integration */}
      <div className="pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between mb-8 px-2">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
             <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg">📊</span>
             Facility Comparison Matrix
           </h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multi-Centric Data Sync Active</p>
        </div>
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
          <HospitalComparison hospitals={[result, ...(result.alternatives || [])].slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}
