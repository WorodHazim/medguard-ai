"use client";

interface DecisionReasoningProps {
  reasons: string[];
}

export default function DecisionReasoning({ reasons }: DecisionReasoningProps) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
        <span className="text-xl">🧠</span>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Clinical Reasoning</h3>
      </div>
      
      <div className="space-y-4">
        {reasons.map((reason, idx) => (
          <div key={idx} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-blue-50 text-medical-blue text-[10px] font-black flex items-center justify-center border border-blue-100 group-hover:bg-medical-blue group-hover:text-white transition-all duration-300">
                {idx + 1}
              </div>
              {idx < reasons.length - 1 && <div className="w-0.5 h-full bg-slate-50 mt-1"></div>}
            </div>
            <p className="text-sm font-bold text-slate-600 py-0.5 leading-relaxed">
              {reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
