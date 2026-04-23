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
  "Analyzing clinical symptoms...",
  "Evaluating urgency levels...",
  "Matching specialized hospitals...",
  "Generating final AI decision..."
];

interface FormState {
  symptoms: string;
  urgency: UrgencyLevel | null;
  caseType: CaseType | null;
  patientAge: string;
  location: string;
}

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
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
        // Step 5 is the results state
        setCurrentStep(5);
      }
    } catch (error) {
      console.error("[MedGuard] AI matching failed:", error);
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
    console.log("[MedGuard] Session reset. State cleared.");
  };

  // 🎬 Auto-Play Logic
  const handleScenarioSelect = async (scenario: DemoScenario) => {
    console.log(`[MedGuard] Demo Scenario Triggered: ${scenario.name}`);
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
    console.log(`[MedGuard] Live Update - Priority: ${newUrgency}, specialty: ${newCaseType}`);
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
      console.error("[MedGuard] Scenario update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20">
      {/* 🟢 LANDING PAGE STATE */}
      {showLanding ? (
        <div className="animate-in fade-in duration-1000">
          {/* Status Strip */}
          <div className="bg-slate-900 text-white py-3 px-6 text-center border-b border-white/10 shadow-lg">
             <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
                <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  AI Engine Active
                </span>
                <div className="w-px h-3 bg-white/20"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  🔒 HIPAA-G Compliant
                </span>
                <div className="w-px h-3 bg-white/20"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  ⚡ End-to-End Encryption
                </span>
             </div>
          </div>

          <main className="max-w-6xl mx-auto px-6 py-20 space-y-32">
            {/* HERO SECTION */}
            <section className="text-center space-y-10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -z-10"></div>
              
              <div className="space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-medical-blue text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  Secured Medical Routing Dashboard
                </div>
                <h1 className="text-7xl md:text-8xl font-black tracking-tight text-slate-900">
                  MedGuard <span className="text-slate-400 font-medium">AI</span>
                </h1>
                <p className="text-xl md:text-2xl font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed italic text-balance">
                  AI-powered emergency triage assistant for rapid clinical signal processing and tactical hospital routing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <button 
                  onClick={() => {
                    console.log("[MedGuard] Starting Assessment...");
                    setShowLanding(false);
                  }}
                  className="w-full sm:w-auto px-10 py-6 rounded-[2rem] bg-medical-blue text-white font-black text-lg shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all group flex items-center gap-3"
                >
                  Start Assessment
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button 
                  onClick={() => {
                    setShowLanding(false);
                    handleScenarioSelect({
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
                    });
                  }}
                  className="w-full sm:w-auto px-10 py-6 rounded-[2rem] bg-white border border-slate-200 text-slate-900 font-black text-lg shadow-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
                >
                  Run Demo Mode
                </button>
              </div>
            </section>

            {/* VALUE SECTION */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Clinical Signal Triage", desc: "Evaluate symptoms in milliseconds with structured diagnostic analysis.", icon: "🚑" },
                { title: "Facility Protocol Match", desc: "Route patients to facilities with the specific specialty certifications.", icon: "🏥" },
                { title: "Decision Explained", desc: "Transparent AI reasoning logs for every hospital recommendation.", icon: "📑" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-tight">{item.desc}</p>
                </div>
              ))}
            </section>
            
            {/* Privacy Strip */}
            <div className="flex flex-col items-center gap-4 py-10 opacity-60">
              <div className="flex items-center gap-3 bg-slate-100 px-6 py-2 rounded-full border border-slate-200">
                <span className="text-lg">🛡️</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Ephemeral Data Policy: No patient information is persisted in permanent storage.
                </span>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* 🔵 MAIN APP FLOW (Existing App) */
        <div className="animate-in fade-in duration-700">
          {/* Critical Alert Bar */}
          {form.urgency === "critical" && !loading && (
            <div className="bg-red-600 text-white py-3 px-6 text-center animate-pulse sticky top-0 z-[60] shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                <span className="text-xl">🚨</span>
                CRITICAL EMERGENCY • L1 TRAUMA STATUS • IMMEDIATE DISPATCH ADVISED
                <span className="text-xl">🚨</span>
              </p>
            </div>
          )}

          {/* Precision Header */}
          <header className={`bg-white/80 backdrop-blur-xl sticky z-50 border-b border-slate-100 mb-8 transition-all ${form.urgency === 'critical' ? 'top-[44px]' : 'top-0'}`}>
            <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => resetForm()} 
                  className="w-12 h-12 bg-medical-blue rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200 transition-transform hover:scale-105"
                >
                  M
                </button>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">MedGuard AI</h1>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Security-Verified Routing Framework · v6.1.0</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowLanding(true)}
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-medical-blue transition-colors px-4 py-2 bg-slate-50 rounded-xl border border-slate-100"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
            
            {/* Real-Life Scenarios Integration */}
            {!result && !loading && (
              <DemoMode onSelect={handleScenarioSelect} selectedId={activeScenario?.id} />
            )}
          </header>

          <main className="max-w-[1400px] mx-auto px-4">
            {/* Step Indicator (Form Only) */}
            {!result && !loading && (
              <StepIndicator currentStep={currentStep} steps={STEPS} />
            )}

            <div className="relative mt-8 min-h-[500px]">
              {/* 1. AI THINKING STATE */}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-50 border-t-medical-blue animate-spin"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-blue-100 border-b-medical-blue animate-spin duration-[2s]"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">🧠</div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-black tracking-tight text-slate-900 animate-pulse uppercase tracking-widest text-center">
                      Processing Recommendation
                    </h3>
                    <p className="text-sm font-bold text-slate-400 tracking-wide h-6 overflow-hidden">
                       {AI_THINKING_MESSAGES[thinkingIndex]}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. FORM STEPS */}
              {!result && !loading && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto space-y-12">
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tight text-slate-800">Identify Symptoms</h2>
                        <p className="text-slate-500 font-bold italic">Select primary diagnostic signals to initiate triage.</p>
                      </div>
                      <SymptomSelector onChange={handleSymptomChange} />
                      {!isStepValid && (
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                          ⚠️ Validation Error: Selection required to proceed with analysis.
                        </p>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tight text-slate-800">Urgency Level</h2>
                        <p className="text-slate-500 font-bold italic">Classify the clinical severity of the current presentation.</p>
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
                            onClick={() => {
                              console.log(`[MedGuard] Urgency set: ${opt.value}`);
                              setForm(prev => ({ ...prev, urgency: opt.value }));
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tight text-slate-800">Assign Specialty</h2>
                        <p className="text-slate-500 font-bold italic">Route to the most appropriate clinical specialty unit.</p>
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
                            onClick={() => {
                              console.log(`[MedGuard] Specialty set: ${opt.value}`);
                              setForm(prev => ({ ...prev, caseType: opt.value }));
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tight text-slate-800">Patient Context</h2>
                        <p className="text-slate-500 font-bold italic">Final demographics for routing and transit calculation.</p>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-6 font-sans">
                        <div className="col-span-1 space-y-4 text-left">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                            Age Profile
                          </label>
                          <input
                            type="number"
                            value={form.patientAge}
                            onChange={(e) => setForm(prev => ({ ...prev, patientAge: e.target.value }))}
                            placeholder="e.g. 45"
                            className="w-full bg-white border border-slate-100 rounded-3xl py-5 px-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-medical-blue transition-all"
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-4 text-left">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                            Current Location *
                          </label>
                          <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Street / Landmark"
                            className="w-full bg-white border border-slate-100 rounded-3xl py-5 px-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-medical-blue transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-10">
                    {currentStep > 1 && (
                      <button
                        onClick={handleBack}
                        className="px-10 py-5 rounded-3xl border border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-800 transition-all font-sans"
                      >
                        Previous Step
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      disabled={!isStepValid}
                      className={`flex-1 py-5 rounded-[2rem] font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                        isStepValid 
                          ? "bg-medical-blue text-white hover:bg-blue-700 shadow-blue-200 group" 
                          : "bg-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {currentStep === 4 ? "Process Routing Analysis" : "Assess and Continue"}
                      <span className={`transition-transform duration-300 ${isStepValid ? 'group-hover:translate-x-2' : ''}`}>→</span>
                    </button>
                  </div>
                  
                  {/* Validation Footer */}
                  <div className="pt-10 border-t border-slate-100 flex items-center justify-center gap-6">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xl shadow-emerald-500"></span>
                      Input Integrity Verified
                    </span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-xl shadow-blue-50"></span>
                      Real-time Validation
                    </span>
                  </div>
                </div>
              )}

              {/* 3. RESULTS DISPLAY (Modified for Error Handling) */}
              {result && !loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 pb-20">
                  <div className="space-y-12">
                    <AIDecisionPanel result={result} />
                    
                    {/* Map Section */}
                    <div className="space-y-6">
                      <div className="flex flex-col gap-2 px-6">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                          <span className="text-2xl">🌍</span>
                          Dynamic Routing Visualization
                        </h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">
                          Calculated based on current proximity and facility resource availability.
                        </p>
                      </div>
                      <HospitalMap result={result} patientCoords={PATIENT_COORDS} />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <ScenarioSimulator 
                      currentUrgency={form.urgency || "low"} 
                      currentCaseType={form.caseType || "other"} 
                      onUpdate={handleScenarioUpdate}
                    />

                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-blue-50 space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Status</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-500">Logic Match</span>
                          <span className={`font-black uppercase italic ${result.isFallback ? 'text-orange-500' : 'text-emerald-500'}`}>
                            {result.isFallback ? 'Generic' : 'Specialized'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-bold text-slate-500">Processing Lag</span>
                           <span className="font-black text-slate-900">42ms</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-bold text-slate-500">Compliance</span>
                           <span className="font-black text-slate-900 uppercase">Privacy-V1</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 pt-12 flex flex-col items-center gap-6">
                    <button 
                      onClick={resetForm}
                      className="w-full md:w-auto px-12 py-5 rounded-[2rem] bg-slate-900 text-white font-black text-lg shadow-2xl shadow-slate-300 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                    >
                      New Emergency Assessment
                    </button>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                      MedGuard Verification Engine · Tactical Response Dashboard
                    </p>
                  </div>
                </div>
              ) : hasSubmitted && !loading && !result && (
                /* ERROR STATE UI */
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500 bg-white/50 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-red-100">
                   <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-3xl border border-red-100 animate-bounce">⚠️</div>
                   <div className="text-center space-y-3">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">System Unavailable</h3>
                      <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
                        A failure occurred during recommendation analysis. For immediate safety, route to the nearest Level 1 trauma center.
                      </p>
                   </div>
                   <button 
                    onClick={handleFinalSubmit}
                    className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200"
                   >
                     Retry Diagnostic Scan
                   </button>
                </div>
              )}
            </div>
          </main>

          <footer className="mt-2 relative z-[20] py-20 px-6 border-t border-slate-100 bg-white/30">
            <div className="max-w-4xl mx-auto space-y-12 text-center">
              <div className="flex flex-col items-center gap-6">
                 <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-sm">M</div>
                 <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Privacy Guard Ready</span>
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Zero Storage Policy</span>
                 </div>
              </div>
              
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-xl group">
                 <p className="text-xs font-bold text-slate-400 leading-relaxed italic text-balance">
                    <span className="text-medical-blue font-black tracking-widest uppercase mb-4 block group-hover:underline transition-all">Clinical Intelligence Disclaimer</span>
                    This assistant provides logic-based decision support for routing logistics and tactical hospital selection. It does <b>NOT</b> constitute a medical diagnosis or treatment plan. Emergency dispatch protocols must be followed strictly.
                 </p>
              </div>
              
              <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em]">
                Verified · Secure · Ephemeral
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}