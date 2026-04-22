"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import SymptomSelector from "@/components/SymptomSelector";
import CaseTypeCard from "@/components/CaseTypeCard";
import ResultCard from "@/components/ResultCard";
import type { RecommendationResult, UrgencyLevel, CaseType } from "@/lib/recommendation";

// Dynamically import HospitalMap to avoid SSR issues with Leaflet
const HospitalMap = dynamic(() => import("@/components/HospitalMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-slate-50 animate-pulse rounded-3xl border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-widest">Initialising Map Engine...</div>
});

// ─── Constants ────────────────────────────────────────────────────────────────
// Patient center coordinate (Abu Dhabi Corniche area for demo)
const PATIENT_COORDS: [number, number] = [24.485, 54.368];

const URGENCY_OPTIONS = [
  { value: "low" as UrgencyLevel, title: "Routine", desc: "Non-life-threatening condition requiring standard care.", icon: "✅" },
  { value: "medium" as UrgencyLevel, title: "Urgent", desc: "Significant medical issue requiring prompt attention.", icon: "⚠️" },
  { value: "critical" as UrgencyLevel, title: "Emergency", desc: "Life-threatening situation requiring immediate intervention.", icon: "🚨" },
];

const CASE_TYPE_OPTIONS = [
  { value: "cardiac" as CaseType, title: "Cardiac", desc: "Heart attack, chest pain, arrhythmia.", icon: "❤️" },
  { value: "trauma" as CaseType, title: "Trauma", desc: "Severe injury, fracture, major bleeding.", icon: "🩹" },
  { value: "stroke" as CaseType, title: "Stroke", desc: "Slurred speech, facial droop, numbness.", icon: "🧠" },
  { value: "other" as CaseType, title: "General", desc: "Other medical emergencies or infections.", icon: "🏥" },
];

interface FormState {
  symptoms: string;
  urgency: UrgencyLevel | null;
  caseType: CaseType | null;
  patientAge: string;
  location: string;
}

export default function Home() {
  const [form, setForm] = useState<FormState>({
    symptoms: "",
    urgency: null,
    caseType: null,
    patientAge: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // ─── Validation ─────────────────────────────────────────────────────────────
  
  const validation = useMemo(() => {
    return {
      symptoms: form.symptoms.trim().length > 0,
      urgency: form.urgency !== null,
      caseType: form.caseType !== null,
      location: form.location.trim().length > 0,
    };
  }, [form]);

  const isFormValid = validation.symptoms && validation.urgency && validation.caseType && validation.location;

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setHasSubmitted(true);
    
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        // Scroll to result on desktop
        if (window.innerWidth >= 1024) {
           window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-6 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-medical-blue rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
              M
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">MedGuard AI</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hospital Recommendation System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500">
            <span className="text-emerald-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Online
            </span>
            <span>v2.1.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className={`grid gap-12 ${result ? 'lg:grid-cols-[1fr_1.2fr]' : 'max-w-3xl mx-auto'}`}>
          
          {/* Input Section */}
          <section className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">New Patient Evaluation</h2>
              <p className="text-slate-500 font-medium italic">Complete the triage form to identify the optimal care facility.</p>
            </div>

            {/* Emergency Alert Banner (Top of Form) */}
            {form.urgency === "critical" && (
              <div className="p-4 bg-red-600 rounded-2xl flex items-start gap-4 shadow-lg shadow-red-200 animate-in fade-in slide-in-from-top-4 duration-500">
                <span className="text-2xl mt-1">🚨</span>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-sm">Emergency Alert Triggered</h4>
                  <p className="text-red-50 text-xs font-bold leading-relaxed mt-1">
                    If the patient brandishes life-threatening symptoms or is in immediate danger, call <span className="underline decoration-2 underline-offset-4">999</span> immediately. Use this tool only for destination routing.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* 1. Symptoms */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest">
                  1. Clinical Symptoms & Conditions <span className="text-red-500">*</span>
                </label>
                <SymptomSelector 
                  onChange={(val) => setForm(prev => ({ ...prev, symptoms: val }))}
                />
                {!validation.symptoms && hasSubmitted && (
                   <p className="text-xs font-bold text-red-500 mt-2">※ Please select or enter at least one symptom</p>
                )}
              </div>

              {/* 2. Urgency */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest">
                  2. Urgency Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {URGENCY_OPTIONS.map((opt) => (
                    <CaseTypeCard
                      key={opt.value}
                      id={opt.value}
                      title={opt.title}
                      description={opt.desc}
                      icon={opt.icon}
                      isSelected={form.urgency === opt.value}
                      onClick={() => setForm(prev => ({ ...prev, urgency: opt.value }))}
                    />
                  ))}
                </div>
                {!validation.urgency && hasSubmitted && (
                   <p className="text-xs font-bold text-red-500 mt-2">※ Urgency level is required for triage</p>
                )}
              </div>

              {/* 3. Case Type */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest">
                  3. Primary Case Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CASE_TYPE_OPTIONS.map((opt) => (
                    <CaseTypeCard
                      key={opt.value}
                      id={opt.value}
                      title={opt.title}
                      description={opt.desc}
                      icon={opt.icon}
                      isSelected={form.caseType === opt.value}
                      onClick={() => setForm(prev => ({ ...prev, caseType: opt.value }))}
                    />
                  ))}
                </div>
                {!validation.caseType && hasSubmitted && (
                   <p className="text-xs font-bold text-red-500 mt-2">※ Please select the primary medical specialty</p>
                )}
              </div>

              {/* 4 & 5. Age & Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest">
                    4. Patient Age
                  </label>
                  <input
                    type="number"
                    value={form.patientAge}
                    onChange={(e) => setForm(prev => ({ ...prev, patientAge: e.target.value }))}
                    placeholder="Enter age (e.g. 45)"
                    className="field-input"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-widest">
                    5. Location / Landmark <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Street, City or District"
                    className="field-input"
                  />
                   {!validation.location && hasSubmitted && (
                     <p className="text-xs font-bold text-red-500 mt-2">※ Pickup location is required for routing</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={() => setHasSubmitted(true)}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                    loading 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : (isFormValid 
                          ? "bg-medical-blue text-white hover:bg-blue-700 shadow-blue-200" 
                          : "bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-300")
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-slate-300 border-t-medical-blue rounded-full animate-spin"></div>
                      Finding best hospital...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🩺</span>
                      Find Best Hospital
                    </>
                  )}
                </button>
                {hasSubmitted && !isFormValid && (
                  <p className="text-center text-sm font-bold text-red-500 mt-4 animate-bounce">
                    Please correct the errors above to continue
                  </p>
                )}
              </div>
            </form>
          </section>

          {/* Result Section */}
          <section id="results" className={`transition-all duration-700 ${result ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute hidden'}`}>
            <div className="sticky top-8 pb-10 space-y-8">
               {result && (
                 <>
                   <ResultCard result={result} />
                   
                   {/* Map Section */}
                   <div className="space-y-4">
                     <div className="flex flex-col gap-1 px-2">
                       <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                         <span className="text-xl">🗺️</span>
                         Hospital Proximity Map
                       </h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">
                         Showing live transit routing from incident location
                       </p>
                     </div>
                     <HospitalMap result={result} patientCoords={PATIENT_COORDS} />
                   </div>
                 </>
               )}
               
               <button 
                 onClick={() => {setResult(null); setHasSubmitted(false);}}
                 className="w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
               >
                 Evaluate New Patient
               </button>
            </div>
          </section>

          {/* Empty Result Placeholder */}
          {!result && (
            <section className="hidden lg:flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 rounded-[3rem] text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 grayscale opacity-20">
                🏥
              </div>
              <h3 className="text-xl font-bold text-slate-300 uppercase tracking-[0.2em]">Ready for Evaluation</h3>
              <p className="mt-2 text-slate-300 font-medium max-w-xs mx-auto">
                Once submitted, AI-driven recommendations will appear here.
              </p>
            </section>
          )}

        </div>
      </main>

      <footer className="mt-20 border-t border-slate-100 py-10 text-center">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">
          MedGuard AI Emergency Response Network · © 2024
        </p>
      </footer>
    </div>
  );
}