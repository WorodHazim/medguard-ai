"use client";

interface CaseTypeCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
  urgencyLevel?: "low" | "medium" | "critical";
}

export default function CaseTypeCard({ id, title, description, icon, isSelected, onClick, urgencyLevel }: CaseTypeCardProps) {
  const isEmergency = urgencyLevel === "critical";
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden group ${
        isSelected
          ? "bg-white border-medical-blue shadow-2xl shadow-blue-100 scale-[1.02] z-10"
          : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-100"
      }`}
    >
      {/* Background Icon Watermark */}
      <span className="absolute -right-4 -bottom-4 text-8xl grayscale opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
        {icon}
      </span>

      {/* Pulse Animation for Emergency */}
      {isEmergency && isSelected && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <span className="text-[9px] font-black text-red-600 uppercase tracking-widest animate-pulse">Critical Priority</span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-all duration-500 ${
          isSelected ? "bg-medical-blue text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-medical-blue"
        }`}>
          {icon}
        </div>
        
        <h3 className={`text-xl font-black tracking-tight mb-2 transition-colors ${
          isSelected ? "text-medical-blue" : "text-slate-800"
        }`}>
          {title}
        </h3>
        
        <p className={`text-sm font-bold leading-relaxed pr-4 ${
          isSelected ? "text-slate-600" : "text-slate-400"
        }`}>
          {description}
        </p>

        <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
          isSelected ? "opacity-100 translate-x-0 text-medical-blue" : "opacity-0 -translate-x-4 text-slate-300"
        }`}>
          <span className="p-1.5 bg-blue-50 rounded-lg">SELECTED OPTION</span>
          <span>✓</span>
        </div>
      </div>

      {/* Border Glow for selection */}
      {isSelected && (
        <div className="absolute inset-0 rounded-[2rem] border-4 border-medical-blue/10 animate-pulse pointer-events-none"></div>
      )}
    </button>
  );
}
