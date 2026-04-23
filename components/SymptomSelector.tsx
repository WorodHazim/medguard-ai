"use client";

import { useState, useMemo, useEffect } from "react";

const CATEGORIES = [
  { id: "cardiac", label: "Cardiac", icon: "❤️" },
  { id: "respiratory", label: "Respiratory", icon: "🫁" },
  { id: "neurological", label: "Neurological", icon: "🧠" },
  { id: "general", label: "General", icon: "🩹" },
];

const ALL_SYMPTOMS = [
  { id: "chest-pain", label: "Chest Pain", category: "cardiac", related: ["shortness-of-breath", "dizziness"] },
  { id: "palpitations", label: "Heart Palpitations", category: "cardiac", related: ["chest-pain"] },
  { id: "shortness-of-breath", label: "Shortness of Breath", category: "respiratory", related: ["chest-pain", "cough"] },
  { id: "cough", label: "Severe Cough", category: "respiratory", related: ["fever"] },
  { id: "facial-droop", label: "Facial Droop", category: "neurological", related: ["slurred-speech"] },
  { id: "slurred-speech", label: "Slurred Speech", category: "neurological", related: ["facial-droop", "confusion"] },
  { id: "confusion", label: "Sudden Confusion", category: "neurological", related: ["dizziness"] },
  { id: "dizziness", label: "Severe Dizziness", category: "neurological", related: ["nausea"] },
  { id: "fever", label: "High Fever", category: "general", related: ["nausea"] },
  { id: "nausea", label: "Nausea/Vomiting", category: "general", related: ["dizziness"] },
  { id: "bleeding", label: "Active Bleeding", category: "general", related: ["severe-pain"] },
  { id: "severe-pain", label: "Unbearable Pain", category: "general", related: ["nausea"] },
];

interface SymptomSelectorProps {
  onChange: (val: string) => void;
}

export default function SymptomSelector({ onChange }: SymptomSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const toggleSymptom = (id: string) => {
    const nextIds = selectedIds.includes(id) 
      ? selectedIds.filter(i => i !== id) 
      : [...selectedIds, id];
    
    setSelectedIds(nextIds);
    setQuery("");

    // Notify parent immediately
    const labels = ALL_SYMPTOMS
      .filter(s => nextIds.includes(s.id))
      .map(s => s.label)
      .join(", ");
    onChange(labels);
  };

  const filteredSymptoms = useMemo(() => {
    if (!query) return [];
    return ALL_SYMPTOMS.filter(s => 
      s.label.toLowerCase().includes(query.toLowerCase()) && !selectedIds.includes(s.id)
    );
  }, [query, selectedIds]);

  const suggestions = useMemo(() => {
    const related = new Set<string>();
    selectedIds.forEach(id => {
      const sym = ALL_SYMPTOMS.find(s => s.id === id);
      sym?.related?.forEach(rid => {
        if (!selectedIds.includes(rid)) related.add(rid);
      });
    });
    return Array.from(related).map(rid => ALL_SYMPTOMS.find(s => s.id === rid)!).filter(Boolean);
  }, [selectedIds]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'ring-4 ring-blue-50' : ''}`}>
          <span className="absolute left-5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search symptoms (e.g. Chest pain, Fever...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 pl-14 pr-6 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-medical-blue transition-all"
          />
        </div>

        {/* Dropdown Results */}
        {filteredSymptoms.length > 0 && isFocused && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl border border-slate-100 shadow-2xl p-2 z-50 max-h-64 overflow-y-auto overflow-x-hidden">
            {filteredSymptoms.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSymptom(s.id)}
                className="w-full text-left px-5 py-3 hover:bg-slate-50 rounded-2xl flex items-center justify-between group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-800">{s.label}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.category}</span>
                </div>
                <span className="text-medical-blue opacity-0 group-hover:opacity-100 font-black text-xs">+ ADD</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Chips */}
      <div className="flex flex-wrap gap-2 min-h-[48px]">
        {selectedIds.length === 0 ? (
          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic py-3">No symptoms selected yet...</p>
        ) : (
          selectedIds.map(id => {
            const sym = ALL_SYMPTOMS.find(s => s.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleSymptom(id)}
                className="bg-medical-blue text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 transition-all duration-300 group"
              >
                {sym?.label}
                <span className="text-[14px] leading-none group-hover:hidden">×</span>
                <span className="text-[10px] hidden group-hover:block">REMOVE</span>
              </button>
            );
          })
        )}
      </div>

      {/* Contextual Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-medical-blue animate-pulse"></span>
            AI Recommended pairing:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSymptom(s.id)}
                className="bg-blue-50 text-medical-blue border border-blue-100 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-medical-blue hover:text-white transition-all shadow-sm"
              >
                + {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Fast-Picks */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select from categories:</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="space-y-1">
              <span className="text-[9px] font-black text-slate-300 uppercase block mb-1 text-center">{cat.icon} {cat.label}</span>
              <div className="flex flex-col gap-1">
                {ALL_SYMPTOMS.filter(s => s.category === cat.id).slice(0, 3).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSymptom(s.id)}
                    className={`text-[9px] font-black uppercase tracking-tight py-2 px-1 rounded-lg border text-center transition-all ${
                      selectedIds.includes(s.id) 
                        ? 'bg-medical-blue text-white border-medical-blue shadow-lg shadow-blue-100' 
                        : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-medical-blue'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
