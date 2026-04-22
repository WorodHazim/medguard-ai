"use client";

import type { RecommendationResult } from "@/lib/recommendation";
import AlternativeHospitalCard from "./AlternativeHospitalCard";

interface ResultCardProps {
  result: RecommendationResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="space-y-6">
      {/* Safety Warnings Section */}
      {result.safetyWarnings && result.safetyWarnings.length > 0 && (
        <div className="space-y-2">
          {result.safetyWarnings.map((warning, i) => (
            <div key={i} className={`p-4 rounded-2xl border flex items-start gap-3 shadow-sm ${
              warning.startsWith("CRITICAL") 
                ? "bg-red-50 border-red-100 text-red-700" 
                : "bg-blue-50 border-blue-100 text-blue-700"
            }`}>
              <span className="text-xl">{warning.startsWith("CRITICAL") ? "🚨" : "ℹ️"}</span>
              <p className="text-sm font-bold leading-relaxed">{warning}</p>
            </div>
          ))}
        </div>
      )}

      {/* Primary Result Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header with Hospital Name */}
        <div className="p-8 bg-medical-blue-light border-b border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-medical-blue text-[10px] font-bold uppercase tracking-wider mb-2">
                {result.matchTag || "Best Match Hospital"}
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {result.hospitalName}
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                {result.hospitalType}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`px-4 py-1.5 rounded-xl border font-bold text-sm shadow-sm ${
                result.priority.includes("CRITICAL") 
                  ? "bg-red-50 border-red-100 text-red-600" 
                  : result.priority.includes("MEDIUM") 
                    ? "bg-yellow-50 border-yellow-100 text-yellow-600" 
                    : "bg-emerald-50 border-emerald-100 text-emerald-600"
              }`}>
                {result.priority}
              </div>
              <div className="text-xs text-slate-400 font-medium tracking-wide bg-white px-3 py-1 rounded-full border border-slate-100 italic">
                 AI Confidence: {result.confidence}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <MetricItem label="Distance" value={result.distance} icon="📍" />
            <MetricItem label="Travel Time" value={result.travelTime} icon="⏱️" />
            <MetricItem label="Availability" value={result.availability} icon="🏥" color={
              result.availability === "High" ? "text-emerald-500" : "text-yellow-500"
            } />
          </div>

          {/* Explainability Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Why this hospital? */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-widest">
                <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 text-[10px]">✓</span>
                Why this hospital?
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {result.why.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-emerald-500 mt-0.5">●</span>
                    <span className="text-sm text-slate-600 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reasoning Chain */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-widest">
                <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-violet-100 text-violet-600 text-[10px]">⚙️</span>
                Decision reasoning
              </h4>
              <div className="space-y-3">
                {result.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-violet-200 text-[10px] font-bold text-violet-600">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-600 leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical Signals */}
          {result.matchedSignals.length > 0 && (
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
              <h4 className="text-xs font-bold text-medical-blue uppercase tracking-[0.2em] mb-4">
                Matched Clinical Signals
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedSignals.map((signal, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-blue-200 text-xs font-semibold text-medical-blue shadow-sm">
                    ⚡ {signal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alternative Recommendations Section */}
      {result.alternatives && result.alternatives.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-2">
            Alternative Care Facilities
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {result.alternatives.map((alt, i) => (
              <AlternativeHospitalCard key={i} result={alt} rank={i + 2} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricItem({ label, value, icon, color = "text-slate-900" }: { label: string, value: string, icon: string, color?: string }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col items-center text-center">
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</span>
      <span className={`text-lg font-black ${color}`}>{value}</span>
    </div>
  );
}
