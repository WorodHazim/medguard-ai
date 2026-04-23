"use client";

import { UrgencyLevel, CaseType } from "@/lib/recommendation";

export interface DemoScenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  data: {
    symptoms: string;
    urgency: UrgencyLevel;
    caseType: CaseType;
    patientAge: number;
  };
}

const SCENARIOS: DemoScenario[] = [
  {
    id: "school",
    name: "School Emergency",
    icon: "🏫",
    description: "A student experiences chest pain during PE class",
    data: {
      symptoms: "Sudden sharp chest pain, shortness of breath, dizziness while running",
      urgency: "critical",
      caseType: "cardiac",
      patientAge: 14
    }
  },
  {
    id: "ambulance",
    name: "Ambulance Dispatch",
    icon: "🚑",
    description: "Para-transit dispatch for suspected stroke",
    data: {
      symptoms: "Slurred speech, right-sided weakness, confusion, facial drooping",
      urgency: "critical",
      caseType: "stroke",
      patientAge: 62
    }
  },
  {
    id: "workplace",
    name: "Workplace Incident",
    icon: "🏗️",
    description: "Construction site fall with massive bleeding",
    data: {
      symptoms: "Fall from 2nd floor, active bleeding from leg, suspected fracture, persistent pain",
      urgency: "critical",
      caseType: "trauma",
      patientAge: 34
    }
  }
];

interface DemoModeProps {
  onSelect: (scenario: DemoScenario) => void;
  selectedId?: string;
}

export default function DemoMode({ onSelect, selectedId }: DemoModeProps) {
  return (
    <div className="bg-white border-y border-slate-100 px-8 py-4 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar shadow-sm">
      <div className="flex items-center gap-3 min-w-fit">
        <div className="w-10 h-10 rounded-2xl bg-medical-blue flex items-center justify-center text-xl shadow-lg shadow-blue-100">
           🏢
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Demo Experience</p>
          <p className="text-xs font-bold text-slate-900">Real-Life Scenarios</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`group flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 min-w-[240px] border ${
              selectedId === s.id 
                ? 'bg-medical-blue border-medical-blue text-white shadow-xl shadow-blue-200' 
                : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50 hover:border-medical-blue'
            }`}
          >
            <span className={`text-2xl transition-transform duration-300 ${selectedId === s.id ? 'scale-110' : 'group-hover:scale-125'}`}>{s.icon}</span>
            <div className="text-left">
              <p className={`text-xs font-black ${selectedId === s.id ? 'text-white' : 'text-slate-900 group-hover:text-medical-blue'} transition-colors`}>{s.name}</p>
              <p className={`text-[9px] font-bold ${selectedId === s.id ? 'text-blue-100' : 'text-slate-400'} truncate w-32 uppercase tracking-tight`}>{s.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="text-right min-w-fit border-l border-slate-100 pl-6 ml-auto">
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic mb-1">Live Demo Active</p>
         <div className="flex items-center gap-2 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TACTICAL v2.6.0</span>
         </div>
      </div>
    </div>
  );
}
