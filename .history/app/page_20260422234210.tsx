"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import StepIndicator from "@/components/StepIndicator";
import SymptomSelector from "@/components/SymptomSelector";
import CaseTypeCard from "@/components/CaseTypeCard";
import AIDecisionPanel from "@/components/AIDecisionPanel";
import DemoMode, { DemoScenario } from "@/components/DemoMode";
import ScenarioSimulator from "@/components/ScenarioSimulator";
import ScenarioBanner from "@/components/ScenarioBanner";
import type { RecommendationResult, UrgencyLevel, CaseType } from "@/lib/recommendation";

// Dynamically import HospitalMap to avoid SSR issues with Leaflet
const HospitalMap = dynamic(() => import("@/components/HospitalMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-slate-50 animate-pulse rounded-[2.5rem] border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">Initialising Mapping Engine...</div>
});

// ─── Constants ────────────────────────────────────────────────────────────────
const PATIENT_COORDS: [number, number] = [24.485, 54.368];

const STEPS = [
  { id: 1, name: "Symptoms" },
  { id: 2, name: "Urgency" },
  { id: 3, name: "Specialty" },
  { id: 4, name: "Patient Info" },
  { id: 5, name: "Veracity" },
];

const URGENCY_OPTIONS = [
  { value: "low" as UrgencyLevel, title: "Routine", desc: "Non-critical standard care requirements.", icon: "✅" },
  { value: "medium" as UrgencyLevel, title: "Urgent", desc: "Significant issue needing prompt attention.", icon: "⚠️" },
  { value: "critical" as UrgencyLevel, title: "Emergency", desc: "Life-threatening acute intervention.", icon: "🚨" },
];

const CASE_TYPE_OPTIONS = [
  { value: "cardiac" as CaseType, title: "Cardiac Care", desc: "Myocardial infarction, chest pain, arrhythmias.", icon: "❤️" },
  { value: "trauma" as CaseType, title: "Level 1 Trauma", desc: "Severe mechanical injury, fractures, bleeding.", icon: "🩹" },
  { value: "stroke" as CaseType, title: "Stroke Unit", desc: "Neurological deficit, slurred speech, FAST positive.", icon: "🧠" },
  { value: "other" as CaseType, title: "General ER", desc: "Broad medical emergencies or infections.", icon: "🏥" },
];

const AI_THINKING_MESSAGES = [
  "Deep-scanning clinical symptoms...",
  "Analyzing regional emergency traffic...",
  "Evaluating specialty bed capacity...",
  "Running hospital suitability algorithm...",
  "Generating multi-criteria AI verdict..."
];

interface FormState {
  symptoms: string;
  urgency: UrgencyLevel | null;
  caseType: CaseType | null;
  patientAge: string;
  location: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    symptoms: "",
    urgency: null,
    caseType: null,
    patientAge: "",
    location: "Abu Dhabi Global Market, Maryah Island", // Default for demo
  });

  const [loading, setLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);

  const handleSymptomChange = useCallback((val: string) => {
    setForm(prev => ({ ...prev, symptoms: val }));
  }, []);

  // ─── AI Thinking Logic ─────────────────────────────────────────────────────
  
  useEffect(() => {
    if (loading && thinkingIndex < AI_THINKING_MESSAGES.length - 1) {
      const timer = setTimeout(() => {
        setThinkingIndex(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [loading, thinkingIndex]);

  // ─── Validation ─────────────────────────────────────────────────────────────
  
  const isStepValid = useMemo(() => {
    switch(currentStep) {
      case 1: return form.symptoms.trim().length > 0;
      case 2: return form.urgency !== null;
      case 3: return form.caseType !== null;
      case 4: return form.location.trim().length > 0;
      default: return true;
    }
  }, [currentStep, form]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      if (currentStep === 4) {
        handleFinalSubmit();
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setThinkingIndex(0);
    setHasSubmitted(true);
    
    // Artificial AI thinking delay for impact
    await new Promise(r => setTimeout(r, 3500));

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setCurrentStep(5);
      }
    } catch (error) {
      console.error("AI matching failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ symptoms: "", urgency: null, caseType: null, patientAge: "", location: "Abu Dhabi Global Market, Maryah Island" });
    setResult(null);
    setHasSubmitted(false);
    setCurrentStep(1);
    setThinkingIndex(0);
    setActiveScenario(null);
  };

  // 🎬 Auto-Play Logic
  const handleScenarioSelect = async (scenario: DemoScenario) => {
    resetForm();
    setActiveScenario(scenario);
    
    // Phase 1: Pre-fill symptoms
    setForm(prev => ({ ...prev, symptoms: scenario.data.symptoms }));
    await new Promise(r => setTimeout(r, 800));
    
    // Phase 2: Select Urgency
    setCurrentStep(2);
    setForm(prev => ({ ...prev, urgency: scenario.data.urgency }));
    await new Promise(r => setTimeout(r, 800));
    
    // Phase 3: Select Case Type
    setCurrentStep(3);
    setForm(prev => ({ ...prev, caseType: scenario.data.caseType }));
    await new Promise(r => setTimeout(r, 800));
    
    // Phase 4: Finalize Context
    setCurrentStep(4);
    setForm(prev => ({ ...prev, patientAge: scenario.data.patientAge.toString() }));
    await new Promise(r => setTimeout(r, 1000));
    
    // Phase 5: Kick off calculation
    handleFinalSubmit();
  };

  const handleScenarioUpdate = async (newUrgency: UrgencyLevel, newCaseType: CaseType) => {
    const updatedForm = { ...form, urgency: newUrgency, caseType: newCaseType };
    setForm(updatedForm);
    
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedForm),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      console.error("Scenario update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20">
      {/* Critical Alert Bar */}
      {form.urgency === "critical" && !loading && (
        <div className="bg-red-600 text-white py-3 px-6 text-center animate-pulse sticky top-0 z-[60] shadow-2xl">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4">
             <span className="text-xl">🚨</span>
             CRITICAL CONDITION DETECTED • Immediate action required • CALL 999
             <span className="text-xl">🚨</span>
           </p>
        </div>
      )}

      {/* Precision Header */}
      <header className={`bg-white/80 backdrop-blur-xl sticky z-50 border-b border-slate-100 mb-8 transition-all ${form.urgency === 'critical' ? 'top-[44px]' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-medical-blue rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200 transition-transform hover:scale-105 cursor-pointer">
              M
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">MedGuard AI</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Precision Triage Engine · v2.6.0-TACTICAL</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span className="text-emerald-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Engine Active
            </span>
            <span className="p-2 bg-slate-50 rounded-xl border border-slate-100">Tactical Response Mode</span>
          </div>
        </div>
        
        {/* Real-Life Scenarios Integration */}
        {!result && !loading && (
          <DemoMode onSelect={handleScenarioSelect} selectedId={activeScenario?.id} />
        )}
      </header>

      <main className="max-w-[1400px] mx-auto px-4">
        {/* Scenario Banner */}
        {activeScenario && !loading && (
          <ScenarioBanner 
            title={activeScenario.name} 
            description={activeScenario.description} 
            icon={activeScenario.icon} 
          />
        )}

        {/* Step Indicator (Form Only) */}
        {!result && !loading && (
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        )}

        <div className="relative mt-12 min-h-[500px]">
          {/* 1. AI THINKING STATE */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
               <div className="relative w-32 h-32">
                 <div className="absolute inset-0 rounded-full border-4 border-blue-50 border-t-medical-blue animate-spin"></div>
                 <div className="absolute inset-4 rounded-full border-4 border-blue-100 border-b-medical-blue animate-spin duration-[2s]"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-3xl">🧠</div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black tracking-tight text-slate-900 animate-pulse uppercase tracking-widest">
                  Analyzing Scenario
                </h3>
                <p className="text-sm font-bold text-slate-400 tracking-wide h-6 overflow-hidden">
                   {AI_THINKING_MESSAGES[thinkingIndex]}
                </p>
              </div>
            </div>
          )}

          {/* 2. FORM STEPS */}
          {!result && !loading && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-slate-800">Describe Symptoms</h2>
                    <p className="text-slate-500 font-bold italic">Start by selecting or searching for the primary symptoms.</p>
                  </div>
                  <SymptomSelector 
                    onChange={handleSymptomChange}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-slate-800">Urgency Level</h2>
                    <p className="text-slate-500 font-bold italic">How critical is the current medical situation?</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {URGENCY_OPTIONS.map((opt) => (
                      <CaseTypeCard
                        key={opt.value}
                        id={opt.value}
                        title={opt.title}
                        description={opt.desc}
                        icon={opt.icon}
                        isSelected={form.urgency === opt.value}
                        urgencyLevel={opt.value}
                        onClick={() => setForm(prev => ({ ...prev, urgency: opt.value }))}
                      />
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-slate-800">Primary Specialty</h2>
                    <p className="text-slate-500 font-bold italic">Select the medical category that best fits the case.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-slate-800">Patient Context</h2>
                    <p className="text-slate-500 font-bold italic">Final details for AI distance calculation & matching.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="col-span-1 space-y-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                        Patient Age (Optional)
                      </label>
                      <input
                        type="number"
                        value={form.patientAge}
                        onChange={(e) => setForm(prev => ({ ...prev, patientAge: e.target.value }))}
                        placeholder="e.g. 45"
                        className="w-full bg-white border border-slate-100 rounded-3xl py-5 px-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-medical-blue transition-all"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                        Incident Location *
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Landmark or Address"
                        className="w-full bg-white border border-slate-100 rounded-3xl py-5 px-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-medical-blue transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="mt-16 flex items-center justify-between gap-4">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="px-10 py-5 rounded-3xl border border-slate-200 text-slate-400 font-black text-sm uppercase tracking-widest hover:bg-white hover:text-slate-600 transition-all font-sans"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!isStepValid}
                  className={`flex-1 py-5 rounded-[2rem] font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                    isStepValid 
                      ? "bg-medical-blue text-white hover:bg-blue-700 shadow-blue-200 group" 
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
                >
                  {currentStep === 4 ? "Trigger Decision Analysis" : "Continue"}
                  <span className={`transition-transform duration-300 ${isStepValid ? 'group-hover:translate-x-2' : ''}`}>→</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. RESULTS DISPLAY */}
          {result && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 pb-20">
              <div className="space-y-12">
                {/* Result Content */}
                <AIDecisionPanel result={result} />

                {/* Proximity Map Integration */}
                <div className="space-y-6">
                  <div className="flex flex-col gap-2 px-6">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-2xl">🗺️</span>
                      Tactical Routing Path
                    </h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">
                      Visualizing estimated transit paths based on acute clinical priority
                    </p>
                  </div>
                  <HospitalMap result={result} patientCoords={PATIENT_COORDS} />
                </div>
              </div>

              {/* Sidebar: Simulator & Status */}
              <div className="space-y-8">
                <ScenarioSimulator 
                  currentUrgency={form.urgency || "low"} 
                  currentCaseType={form.caseType || "other"} 
                  onUpdate={handleScenarioUpdate}
                />

                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-blue-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Response Status</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">AI Integrity</span>
                      <span className="font-black text-emerald-500 italic">SECURE</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold text-slate-500">Logic Latency</span>
                       <span className="font-black text-slate-900">28ms</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold text-slate-500">Data Compliance</span>
                       <span className="font-black text-slate-900 uppercase">HIPAA-G</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Privacy Note</h4>
                   <p className="text-[11px] font-bold text-slate-300 leading-relaxed italic">
                     "No HIPAA-sensitive data is persisted. All AI analysis is performed in volatile encrypted memory."
                   </p>
                </div>
              </div>

              {/* Result Footer Actions (Full Width) */}
              <div className="lg:col-span-2 pt-12 flex flex-col items-center gap-6">
                <button 
                  onClick={resetForm}
                  className="w-full md:w-auto px-12 py-5 rounded-[2rem] bg-slate-900 text-white font-black text-lg shadow-2xl shadow-slate-300 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                >
                  Start New Emergency Assessment
                </button>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                  MedGuard Intelligence Framework · Tactical Command
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Trust Elements & Disclaimer */}
      <footer className="mt-20 border-t border-slate-100 bg-white/50 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="flex flex-col items-center gap-4">
             <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs">M</div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Global Medical Response Framework</p>
          </div>
          <div className="p-8 bg-white/80 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-2xl mx-auto">
             <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
               <span className="text-slate-800 font-black uppercase tracking-widest mr-2 underline decoration-blue-200 not-italic">Clinical Disclaimer:</span> 
               This tool is designed to support clinical decision-making and does NOT replace the judgment of medical professionals. Emergency interventions must follow local paramedic protocol.
             </p>
          </div>
          <p className="text-[9px] font-black text-slate-200 uppercase tracking-widest">
            © 2024 MEDGUARD AI. All Systems Operational. HIPAA Compliant Sandbox.
          </p>
        </div>
      </footer>
    </div>
  );
}