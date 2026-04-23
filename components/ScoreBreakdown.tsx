"use client";

interface ScoreBreakdownItem {
  label: string;
  points: number;
  isNegative?: boolean;
}

interface ScoreBreakdownProps {
  items: ScoreBreakdownItem[];
}

export default function ScoreBreakdown({ items }: ScoreBreakdownProps) {
  return (
    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden h-full">
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-medical-blue rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="text-xl">📊</span>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Confidence Breakdown</h3>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-default">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">
                {item.label}
              </span>
              <span className={`text-xs font-black p-1.5 rounded-lg min-w-[45px] text-center ${item.isNegative ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {item.isNegative ? '-' : '+'}{item.points}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-2">
          <p className="text-[9px] font-bold text-slate-500 italic leading-relaxed">
            * Dynamic weights calculated based on clinical fit, transit time, and resource availability algorithms.
          </p>
        </div>
      </div>
    </div>
  );
}
