"use client";

import { useState } from "react";
import type { RecommendationResult, UrgencyLevel, CaseType } from "@/lib/recommendation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  caseSummary: string;
  symptoms: string;
  urgency: UrgencyLevel;
  caseType: CaseType;
  patientAge: string;
  location: string;
  notes: string;
}

// ─── Case type metadata ───────────────────────────────────────────────────────

const CASE_TYPES: { value: CaseType; label: string; icon: string; desc: string }[] = [
  { value: "cardiac", label: "Cardiac", icon: "❤️", desc: "Heart attack, arrhythmia" },
  { value: "trauma", label: "Trauma", icon: "🩹", desc: "Injury, fracture, bleeding" },
  { value: "stroke", label: "Stroke", icon: "🧠", desc: "Neurological emergency" },
  { value: "other", label: "Other", icon: "🏥", desc: "General emergency" },
];

const URGENCY_LEVELS: { value: UrgencyLevel; label: string; sub: string; color: "emerald" | "yellow" | "red" }[] = [
  { value: "low", label: "LOW", sub: "Stable", color: "emerald" },
  { value: "medium", label: "MEDIUM", sub: "Moderate", color: "yellow" },
  { value: "critical", label: "CRITICAL", sub: "High Risk", color: "red" },
];

// ─── Urgency badge colors ─────────────────────────────────────────────────────

const URGENCY_STYLES: Record<string, { active: string; passive: string; dot: string; text: string }> = {
  emerald: {
    active: "border-emerald-400/50 bg-emerald-400/10 shadow-[0_0_28px_rgba(16,185,129,0.18)]",
    passive: "border-emerald-400/15 bg-emerald-400/[0.04] hover:border-emerald-400/30",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
  yellow: {
    active: "border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_28px_rgba(250,204,21,0.14)]",
    passive: "border-yellow-400/15 bg-yellow-400/[0.04] hover:border-yellow-400/30",
    dot: "bg-yellow-400",
    text: "text-yellow-300",
  },
  red: {
    active: "border-red-400/55 bg-red-400/10 shadow-[0_0_30px_rgba(248,113,113,0.2)]",
    passive: "border-red-400/15 bg-red-400/[0.04] hover:border-red-400/30",
    dot: "bg-red-400",
    text: "text-red-300",
  },
};

// ─── Priority display helpers ─────────────────────────────────────────────────

const PRIORITY_DISPLAY: Record<string, { bg: string; border: string; text: string; label: string }> = {
  CRITICAL: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-300",
    label: "CRITICAL — Immediate Action Required",
  },
  MEDIUM: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-300",
    label: "MEDIUM — Prompt Transfer Recommended",
  },
  LOW: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-300",
    label: "LOW — Transfer When Ready",
  },
};

const AVAIL_STYLES: Record<string, string> = {
  High: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Medium: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  Low: "border-red-400/20 bg-red-400/10 text-red-300",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [form, setForm] = useState<FormState>({
    caseSummary: "",
    symptoms:
      "65-year-old male presenting with severe chest pain radiating to left arm, diaphoresis, shortness of breath, and elevated blood pressure (180/110 mmHg).",
    urgency: "critical",
    caseType: "cardiac",
    patientAge: "65",
    location: "Abu Dhabi, Corniche Street",
    notes: "",
  });

  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRecommend = async () => {
    setLoading(true);
    setApiError("");

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseSummary: form.caseSummary,
          symptoms: form.symptoms,
          urgency: form.urgency,
          caseType: form.caseType,
          patientAge: form.patientAge ? Number(form.patientAge) : undefined,
          location: form.location,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get recommendation.");
      }

      setResult(data as RecommendationResult);
      setHasSearched(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const priorityDisplay =
    result ? (PRIORITY_DISPLAY[result.priority] ?? PRIORITY_DISPLAY.CRITICAL) : PRIORITY_DISPLAY.CRITICAL;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="hidden w-[270px] shrink-0 border-r border-cyan-500/10 bg-[#050d18] px-5 py-6 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl shadow-[0_0_30px_rgba(34,211,238,0.18)]">
              🛡️
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">MedGuard</h1>
              <p className="mt-0.5 text-sm text-slate-400">AI Emergency Agent</p>
            </div>
          </div>

          <button className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-left text-base font-semibold shadow-[0_0_30px_rgba(59,130,246,0.28)] transition hover:scale-[1.01]">
            <span className="text-xl">＋</span>
            <span>New Case</span>
          </button>

          <nav className="space-y-1">
            {["Dashboard", "Hospitals", "Analytics", "Alerts", "History", "Settings"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white cursor-pointer"
                >
                  {item}
                </div>
              )
            )}
          </nav>

          <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-[#091424] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">System Status</p>
            <div className="mt-3 flex items-center gap-2 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]" />
              <span className="text-sm font-medium">All Systems Online</span>
            </div>
            <div className="mt-5 flex h-32 items-center justify-center rounded-2xl border border-cyan-500/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),rgba(0,0,0,0)_55%)]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-3xl text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                ✓
              </div>
            </div>
            <div className="mt-4 space-y-1 text-xs text-slate-400">
              <p>• Live Network Active</p>
              <p>• 27 Hospitals Indexed</p>
              <p>• Real-time Monitoring</p>
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-white/5 bg-[#091424] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-sm text-[#07111f]">
                W
              </div>
              <div>
                <p className="text-sm font-medium">Worod Hazem</p>
                <p className="text-xs text-slate-400">Emergency Unit</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Main Content ──────────────────────────────────────────────────── */}
        <section className="flex-1 overflow-x-hidden px-4 py-4 md:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="mb-5 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-cyan-500/10 bg-[#081321] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xl font-semibold text-cyan-300">Good evening, Paramedic 👋</p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    Let&apos;s find the best care for your patient.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl border border-cyan-400/15 bg-[#091728] px-4 py-2.5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">AI Status</p>
                    <p className="mt-0.5 text-sm font-medium text-cyan-300">
                      {loading ? "Analyzing hospitals…" : "Ready"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                    <p className="text-xs uppercase tracking-[0.18em] text-red-300/70">
                      Emergency Mode
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-red-300">ON</p>
                  </div>
                </div>
              </div>

              {/* ECG line */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#06101d] px-4 py-3">
                <div className="relative h-9">
                  <div className="absolute inset-0 top-1/2 h-px -translate-y-1/2 bg-cyan-400/15" />
                  <svg
                    viewBox="0 0 600 60"
                    className="absolute inset-0 h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 35 L60 35 L85 35 L95 15 L110 50 L125 25 L145 35 L200 35 L225 35 L235 18 L245 52 L260 22 L280 35 L335 35 L360 35 L370 17 L382 50 L395 20 L420 35 L600 35"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-4">
              <StatCard title="Hospitals" value="27" sub="Analysed" />
              <StatCard title="Accuracy" value="96%" sub="Prediction" />
              <StatCard title="Time Saved" value="21 min" sub="vs. manual" />
              <StatCard title="Confidence" value="96%" sub="Very High" />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-5 xl:grid-cols-[1.05fr_1.35fr]">
            {/* ─── Left: Patient Input ──────────────────────────────────────── */}
            <div className="space-y-5">
              <Card>
                {/* Card header */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
                    🚑
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">New Emergency Case</h2>
                    <p className="mt-0.5 text-sm text-slate-400">
                      Fill in patient details to receive an AI hospital recommendation
                    </p>
                  </div>
                </div>

                <div className="space-y-5 rounded-2xl border border-cyan-500/10 bg-[#07111e] p-5">
                  {/* Case Summary */}
                  <div>
                    <FieldLabel>Case Summary</FieldLabel>
                    <input
                      value={form.caseSummary}
                      onChange={(e) => updateField("caseSummary", e.target.value)}
                      className="field-input"
                      placeholder="Brief one-line summary of the emergency…"
                    />
                  </div>

                  {/* Symptoms */}
                  <div>
                    <FieldLabel>Symptoms / Condition</FieldLabel>
                    <textarea
                      value={form.symptoms}
                      onChange={(e) => updateField("symptoms", e.target.value)}
                      rows={4}
                      className="field-input resize-none"
                      placeholder="Describe the patient's symptoms in detail…"
                    />
                  </div>

                  {/* Urgency */}
                  <div>
                    <FieldLabel>Urgency Level</FieldLabel>
                    <div className="grid grid-cols-3 gap-3">
                      {URGENCY_LEVELS.map((u) => {
                        const s = URGENCY_STYLES[u.color];
                        const isActive = form.urgency === u.value;
                        return (
                          <button
                            key={u.value}
                            type="button"
                            onClick={() => updateField("urgency", u.value)}
                            className={`cursor-pointer rounded-2xl border px-3 py-4 text-center transition ${
                              isActive ? s.active : s.passive
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                              <p className={`text-sm font-bold ${isActive ? s.text : "text-slate-300"}`}>
                                {u.label}
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{u.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Case Type */}
                  <div>
                    <FieldLabel>Case Type</FieldLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {CASE_TYPES.map((ct) => {
                        const isActive = form.caseType === ct.value;
                        return (
                          <button
                            key={ct.value}
                            type="button"
                            onClick={() => updateField("caseType", ct.value)}
                            className={`cursor-pointer rounded-2xl border px-4 py-4 text-left transition ${
                              isActive
                                ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                                : "border-cyan-500/10 bg-[#081523] hover:border-cyan-400/25"
                            }`}
                          >
                            <div className="text-2xl">{ct.icon}</div>
                            <p className={`mt-2 text-sm font-semibold ${isActive ? "text-cyan-300" : "text-white"}`}>
                              {ct.label}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">{ct.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Age & Location */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Patient Age</FieldLabel>
                      <input
                        type="number"
                        value={form.patientAge}
                        onChange={(e) => updateField("patientAge", e.target.value)}
                        min={0}
                        max={130}
                        className="field-input"
                        placeholder="e.g. 65"
                      />
                    </div>
                    <div>
                      <FieldLabel>Pickup / Location</FieldLabel>
                      <input
                        value={form.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="field-input"
                        placeholder="Street, area, or landmark"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <FieldLabel>Additional Notes <span className="text-slate-500 font-normal">(Optional)</span></FieldLabel>
                    <input
                      value={form.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      className="field-input"
                      placeholder="Allergies, medical history, medications…"
                    />
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleRecommend}
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 via-blue-600 to-cyan-400 px-5 py-4 text-base font-semibold text-white shadow-[0_0_40px_rgba(34,211,238,0.2)] transition hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(34,211,238,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Analysing hospitals…
                      </>
                    ) : (
                      <>
                        <span>🔍</span>
                        Find Best Hospital
                      </>
                    )}
                  </button>

                  {apiError && (
                    <div className="mt-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      ⚠️ {apiError}
                    </div>
                  )}
                </div>
              </Card>

              {/* How It Works */}
              <Card>
                <h3 className="mb-4 text-lg font-semibold">How MedGuard Works</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <StepCard
                    step="Step 1"
                    title="Enter Patient Data"
                    text="Provide condition, urgency, and location."
                  />
                  <StepCard
                    step="Step 2"
                    title="AI Evaluates Options"
                    text="Hospitals, capacity, and specialty are scored."
                  />
                  <StepCard
                    step="Step 3"
                    title="Get Recommendation"
                    text="Receive the best hospital and fastest route."
                  />
                </div>
              </Card>
            </div>

            {/* ─── Right: Recommendation Panel ──────────────────────────────── */}
            <div className="space-y-5">
              <Card className="border-emerald-400/15">
                {/* Panel header */}
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
                      AI Recommendation
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Real-time decision based on condition, availability, and location
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Best Match
                  </div>
                </div>

                {/* Live recommendation text */}
                <div className="rounded-2xl border border-cyan-500/10 bg-[#07111e] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                    Live Recommendation
                  </p>
                  {result ? (
                    <p className="mt-3 text-lg font-semibold leading-7 text-white">
                      {result.recommendation}
                    </p>
                  ) : (
                    <p className="mt-3 text-base text-slate-500 italic">
                      {hasSearched
                        ? "No recommendation returned."
                        : "Fill in the patient details and click ‘Find Best Hospital’ to receive an AI-powered recommendation."}
                    </p>
                  )}
                  {result && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Confidence:</span>
                      <span className="text-xs font-semibold text-emerald-300">{result.confidence}</span>
                    </div>
                  )}
                </div>

                {/* Hospital card + side panels */}
                <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  {/* Hospital card */}
                  <div className="overflow-hidden rounded-3xl border border-cyan-500/10 bg-[#07111e]">
                    <div className="h-52 bg-[linear-gradient(135deg,#0a1830,#0d2545_45%,#112b52)] p-5">
                      <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        Best Match
                      </div>
                      <div className="mt-5 flex h-32 items-end justify-center rounded-2xl border border-white/5 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),rgba(0,0,0,0)_60%)]">
                        <div className="mb-3 rounded-2xl border border-cyan-400/10 bg-[#0a1426]/90 px-8 py-6 text-center shadow-[0_0_30px_rgba(0,0,0,0.25)]">
                          <p className="text-2xl font-bold">
                            {result ? result.hospitalShortName : "—"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {result ? "Recommended" : "Healthcare"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold tracking-tight">
                        {result ? result.hospitalName : "Awaiting Input"}
                      </h3>
                      <p className="mt-1.5 text-sm text-cyan-300">
                        {result ? result.hospitalType : "Submit patient data to see top match"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <MetricPill
                          label="Distance"
                          value={result?.distance ?? "—"}
                        />
                        <MetricPill
                          label="Travel Time"
                          value={result?.travelTime ?? "—"}
                        />
                        <MetricPill
                          label="Availability"
                          value={result?.availability ?? "—"}
                          availStyle={result ? (AVAIL_STYLES[result.availability] ?? "") : ""}
                        />
                      </div>

                      {/* Why this hospital */}
                      <div className="mt-5 rounded-2xl border border-cyan-500/10 bg-[#081523] p-4">
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
                          Why this hospital?
                        </h4>
                        {result ? (
                          <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                            {result.why.map((reason, i) => (
                              <Reason key={i} text={reason} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm italic text-slate-500">
                            Reasons will appear here after analysis.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Side panels */}
                  <div className="space-y-4">
                    {/* Priority badge */}
                    <div
                      className={`rounded-3xl border px-5 py-4 ${priorityDisplay.border} ${priorityDisplay.bg}`}
                    >
                      <p className={`text-xs font-bold uppercase tracking-[0.22em] ${priorityDisplay.text}`}>
                        Priority
                      </p>
                      <p className={`mt-1 text-sm font-semibold ${priorityDisplay.text}`}>
                        {result ? priorityDisplay.label : "Awaiting Input"}
                      </p>
                    </div>

                    {/* Map visual */}
                    <div className="overflow-hidden rounded-3xl border border-cyan-500/10 bg-[#07111e]">
                      <div className="relative h-56 bg-[linear-gradient(135deg,#0a1628,#08101d)] p-4">
                        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] [background-size:32px_32px]" />
                        <div className="absolute left-[18%] top-[72%] h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.9)]" />
                        <div className="absolute right-[16%] top-[16%] h-6 w-6 rounded-full bg-red-500 shadow-[0_0_24px_rgba(239,68,68,0.9)]" />

                        <svg
                          viewBox="0 0 400 260"
                          className="absolute inset-0 h-full w-full"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M80 190 C110 180,120 160,145 150 C180 135,170 120,210 110 C250 100,260 75,300 65"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </svg>

                        <div className="absolute left-[52%] top-[44%] rounded-2xl border border-cyan-400/15 bg-[#081523]/95 px-3 py-2 text-sm shadow-xl">
                          <p className="font-semibold">{result?.travelTime ?? "—"}</p>
                          <p className="text-xs text-slate-400">{result?.distance ?? "—"}</p>
                        </div>

                        <button className="absolute bottom-3 right-3 rounded-xl border border-cyan-400/15 bg-[#0a1830] px-3 py-2 text-xs font-medium text-cyan-300">
                          View Full Route
                        </button>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="rounded-3xl border border-cyan-500/10 bg-[#07111e] p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                        AI Insights
                      </p>
                      <div className="mt-3 flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xl">
                          🧠
                        </div>
                        <p className="text-xs leading-6 text-slate-300">
                          Our engine analysed{" "}
                          <span className="font-semibold text-white">27 hospitals</span> across{" "}
                          <span className="font-semibold text-white">25+ factors</span> including
                          specialty, real-time availability, travel time, and patient condition.
                          {result && (
                            <>
                              {" "}
                              Confidence:{" "}
                              <span className="font-semibold text-emerald-300">{result.confidence}</span>.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alternative hospital */}
                <div className="mt-5 rounded-3xl border border-cyan-500/10 bg-[#07111e] p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
                    Alternative Option
                  </p>
                  <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">
                        {result?.alternativeHospital.name ?? "Apollo Hospital"}
                      </h4>
                      <p className="mt-0.5 text-sm text-slate-400">
                        {result?.alternativeHospital.type ?? "Multi-speciality Hospital"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <MetricPill label="Distance" value={result?.alternativeHospital.distance ?? "2.7 km"} />
                      <MetricPill label="Travel Time" value={result?.alternativeHospital.travelTime ?? "12 min"} />
                      <MetricPill
                        label="Availability"
                        value={result?.alternativeHospital.availability ?? "Medium"}
                        availStyle={
                          result
                            ? (AVAIL_STYLES[result.alternativeHospital.availability] ?? "")
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Priority banner */}
                {result && (
                  <div
                    className={`mt-5 rounded-3xl border px-5 py-5 bg-gradient-to-r ${
                      result.priority === "CRITICAL"
                        ? "from-red-500/20 to-red-600/10 border-red-500/25"
                        : result.priority === "MEDIUM"
                        ? "from-yellow-500/20 to-yellow-600/10 border-yellow-500/25"
                        : "from-emerald-500/20 to-emerald-600/10 border-emerald-500/25"
                    }`}
                  >
                    <p
                      className={`text-xl font-bold ${
                        result.priority === "CRITICAL"
                          ? "text-red-300"
                          : result.priority === "MEDIUM"
                          ? "text-yellow-300"
                          : "text-emerald-300"
                      }`}
                    >
                      Priority Level: {result.priority}
                    </p>
                    <p className="mt-2 text-sm text-slate-300/80">
                      {result.priority === "CRITICAL"
                        ? "Immediate medical attention required. The recommended hospital offers the fastest and most capable response."
                        : result.priority === "MEDIUM"
                        ? "Prompt transfer recommended. Patient needs timely specialist care."
                        : "Patient is stable. Transfer when ready; standard emergency protocols apply."}
                    </p>
                  </div>
                )}
              </Card>

              {/* Bottom Stats */}
              <div className="grid gap-4 md:grid-cols-5">
                <BottomStat title="Time Saved" value="21 min" sub="vs. manual search" />
                <BottomStat title="Accuracy" value="96%" sub="AI prediction" />
                <BottomStat title="Hospitals" value="27" sub="Live indexed" />
                <BottomStat title="Data Sources" value="12+" sub="Live sources" />
                <BottomStat title="Confidence" value="96%" sub="Very high" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// ─── Shared Components ─────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[28px] border border-cyan-500/10 bg-[#081321] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-[#081321] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-300">{children}</label>
  );
}

function MetricPill({
  label,
  value,
  availStyle = "",
}: {
  label: string;
  value: string;
  availStyle?: string;
}) {
  const base = availStyle
    ? availStyle
    : "border-cyan-500/10 bg-[#081523] text-white";

  return (
    <div className={`rounded-xl border px-3 py-2 ${base}`}>
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Reason({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[10px] text-emerald-300">
        ✓
      </span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function StepCard({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#07111e] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">{step}</p>
      <h4 className="mt-2 text-sm font-semibold">{title}</h4>
      <p className="mt-1.5 text-xs leading-5 text-slate-400">{text}</p>
    </div>
  );
}

function BottomStat({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-[#081321] p-4 text-center">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
    </div>
  );
}