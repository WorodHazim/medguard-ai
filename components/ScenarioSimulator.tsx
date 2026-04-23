"use client";

import { UrgencyLevel, CaseType } from "@/lib/recommendation";

interface ScenarioSimulatorProps {
  currentUrgency: UrgencyLevel;
  currentCaseType: CaseType;
  onUpdate: (urgency: UrgencyLevel, caseType: CaseType) => void;
}

export default function ScenarioSimulator({ currentUrgency, currentCaseType, onUpdate }: ScenarioSimulatorProps) {
  const urgencyOptions: { value: UrgencyLevel; label: string; icon: string }[] = [
    { value: "low", label: "Routine", icon: "🟢" },
    { value: "medium", label: "Urgent", icon: "🟡" },
    { value: "critical", label: "Emergency", icon: "🔴" },
  ];

  const caseOptions: { value: CaseType; label: string }[] = [
    { value: "cardiac", label: "Cardiac" },
    { value: "stroke", label: "Stroke" },
    { value: "trauma", label: "Trauma" },
    { value: "other", label: "General" },
  ];

  return (
    <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-medical-blue rounded-full blur-3xl opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity"></div>
      
      <div className="relative z-10 space-y-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-1">
            <span className="text-xl">🔄</span>
            Scenario Simulator
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">
            Recalculate AI matching instantly by adjusting parameters
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adjust Urgency</p>
            <div className="flex gap-2">
              {urgencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate(opt.value, currentCaseType)}
                  className={`flex-1 py-3 px-1 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border ${
                    currentUrgency === opt.value
                      ? 'bg-medical-blue border-medical-blue text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span className="block text-xs mb-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Switch Clinical Context</p>
            <div className="grid grid-cols-2 gap-2">
              {caseOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate(currentUrgency, opt.value)}
                  className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                    currentCaseType === opt.value
                      ? 'bg-white border-white text-slate-900'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
           <p className="text-[9px] text-slate-500 leading-relaxed italic">
             * Adjusting these values re-weights distance, clinical specialty, and availability metrics in real-time.
           </p>
        </div>
      </div>
    </div>
  );
}
