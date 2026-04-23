"use client";

interface ScenarioBannerProps {
  title: string;
  description: string;
  icon: string;
}

export default function ScenarioBanner({ title, description, icon }: ScenarioBannerProps) {
  return (
    <div className="bg-slate-900 text-white rounded-[2rem] p-6 mb-8 relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-medical-blue rounded-full blur-3xl opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity"></div>
      
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-16 h-16 rounded-[1.25rem] bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-2xl">
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-medical-blue text-[8px] font-black uppercase tracking-widest text-white ring-1 ring-white/20">Active Scenario</span>
            <h3 className="text-xl font-black tracking-tight">{title}</h3>
          </div>
          <p className="text-sm font-bold text-slate-400 italic">
            "{description}"
          </p>
        </div>
      </div>
    </div>
  );
}
