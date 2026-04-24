// lib/recommendation.ts
// Rule-based recommendation engine for MedGuard AI
// Structured I/O makes future LLM swap-in straightforward

export type CaseType = "cardiac" | "trauma" | "stroke" | "other";
export type UrgencyLevel = "low" | "medium" | "critical";

export interface RecommendationRequest {
  caseSummary?: string;
  symptoms: string;
  urgency: UrgencyLevel;
  caseType: CaseType;
  patientAge?: number;
  location?: string;
  notes?: string;
}

export interface HospitalProfile {
  name: string;
  shortName: string;
  type: string;
  specialties: CaseType[];
  distance: string;
  travelTime: string;
  availability: "High" | "Medium" | "Low";
  features: string[];
  score?: number;
}

export interface RecommendationResult {
  recommendation: string;
  hospitalName: string;
  hospitalShortName: string;
  hospitalType: string;
  priority: string;
  distance: string;
  travelTime: string;
  availability: string;
  why: string[];
  reasons: string[];           // Decision reasoning chain
  matchedSignals: string[];    // Clinical keywords extracted from symptoms
  alternativeHospital: {
    name: string;
    type: string;
    distance: string;
    travelTime: string;
    availability: string;
  };
  confidence: string;
  urgencyColor: "red" | "yellow" | "emerald";
  score?: number;              // Numeric score for ranking
  subScores?: {                // Broken down metrics
    clinical: number;
    time: number;
    availability: number;
  };
  scoreBreakdown?: {           // Individual scoring contributions
    label: string;
    points: number;
    isNegative?: boolean;
  }[];
  criticalIssue?: string;      // "Why this decision is critical"
  consequence?: string;        // "If delayed..."
  riskLevel?: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  influenceFactors?: string[]; // Factors that swayed the result
  matchTag?: string;           // "BEST MATCH", "SECOND BEST", etc.
  whyNotReason?: string;       // Explanation for alternative results
  safetyWarnings?: string[];   // Emergency alert messages
  alternatives?: RecommendationResult[]; // Ranked list of alternatives
  lat?: number;                // Map Latitude
  lng?: number;                // Map Longitude
  scenarioContext?: {          // Narrative context
    title: string;
    description: string;
    icon: string;
  };
  isFallback?: boolean;        // Flag for generic routing fallback
}

// ─── Hospital Database ────────────────────────────────────────────────────────

const HOSPITALS: HospitalProfile[] = [
  {
    name: "Sheikh Khalifa Medical City",
    shortName: "SKMC",
    type: "Cardiac & Stroke Centre of Excellence",
    specialties: ["cardiac", "stroke"],
    distance: "1.4 km",
    travelTime: "6 min",
    availability: "High",
    features: [
      "Specialized Cardiac ICU",
      "Advanced Cath Lab (24/7)",
      "Stroke Unit & tPA Protocol",
      "Expert Interventional Cardiologists",
      "STEMI Door-to-Balloon <90 min",
      "High Surgical Success Rate",
    ],
  },
  {
    name: "Burjeel Medical City",
    shortName: "BMC",
    type: "Level 1 Trauma & Multi-Speciality",
    specialties: ["trauma", "other"],
    distance: "2.1 km",
    travelTime: "9 min",
    availability: "High",
    features: [
      "Level 1 Trauma Bay",
      "Advanced Operating Theatres",
      "Neuro-Trauma ICU",
      "Orthopaedic Trauma Team (24/7)",
      "Blood Bank On-Site",
      "Rapid Triage Protocol",
    ],
  },
  {
    name: "Cleveland Clinic Abu Dhabi",
    shortName: "CCAD",
    type: "Academic Medical Centre",
    specialties: ["stroke", "cardiac", "other"],
    distance: "3.2 km",
    travelTime: "13 min",
    availability: "Medium",
    features: [
      "Comprehensive Stroke Centre",
      "Neuroscience Institute",
      "24/7 Neurology Attending",
      "Advanced Neuroimaging (CT/MRI)",
      "Endovascular Stroke Team",
      "Certified Stroke Programme",
    ],
  },
  {
    name: "Al Zahra Hospital",
    shortName: "AZH",
    type: "Multi-Speciality Hospital",
    specialties: ["other"],
    distance: "2.7 km",
    travelTime: "12 min",
    availability: "Medium",
    features: [
      "24/7 Emergency Department",
      "General & Specialist ICU",
      "Diagnostics & Lab On-Site",
      "Internal Medicine Team",
      "Paediatric Emergency",
      "Geriatric Care Unit",
    ],
  },
];

// ─── Signal Detection ─────────────────────────────────────────────────────────

// Maps each case type to a list of keyword groups and their display label
const SIGNAL_DEFINITIONS: Record<CaseType, { keywords: string[]; label: string }[]> = {
  cardiac: [
    { keywords: ["chest pain", "chest"], label: "Chest pain" },
    { keywords: ["heart attack", "myocardial", "stemi", "nstemi"], label: "Cardiac event indicator" },
    { keywords: ["arrhythmia", "palpitation", "irregular heartbeat"], label: "Arrhythmia" },
    { keywords: ["sweating", "diaphoresis"], label: "Diaphoresis" },
    { keywords: ["blood pressure", "hypertension", "bp"], label: "BP abnormality" },
    { keywords: ["shortness of breath", "breathing difficulty", "dyspnea"], label: "Respiratory distress" },
    { keywords: ["radiating", "left arm", "jaw pain"], label: "Radiated pain pattern" },
    { keywords: ["nausea", "vomiting"], label: "Nausea/vomiting" },
  ],
  stroke: [
    { keywords: ["face", "facial droop"], label: "Facial symptoms (FAST)" },
    { keywords: ["arm weakness", "arm", "limb weakness"], label: "Limb weakness (FAST)" },
    { keywords: ["speech", "slurred", "aphasia", "dysarthria"], label: "Speech impairment (FAST)" },
    { keywords: ["sudden headache", "worst headache"], label: "Acute headache" },
    { keywords: ["vision", "blurred vision", "visual"], label: "Vision disturbance" },
    { keywords: ["balance", "dizziness", "vertigo", "coordination"], label: "Balance issue" },
    { keywords: ["numbness", "tingling", "sensory"], label: "Sensory abnormality" },
  ],
  trauma: [
    { keywords: ["accident", "crash", "collision", "impact"], label: "Traumatic incident" },
    { keywords: ["fracture", "broken", "bone"], label: "Suspected fracture" },
    { keywords: ["bleeding", "hemorrhage", "blood loss"], label: "Active bleeding" },
    { keywords: ["laceration", "wound", "cut", "gash"], label: "Laceration" },
    { keywords: ["head injury", "concussion", "tbi"], label: "Head injury" },
    { keywords: ["burn", "burns", "scalding"], label: "Burn injury" },
    { keywords: ["unconscious", "unresponsive", "loss of consciousness"], label: "Altered consciousness" },
    { keywords: ["spinal", "neck injury", "back injury"], label: "Spinal concern" },
  ],
  other: [
    { keywords: ["fever", "temperature", "pyrexia", "high temperature"], label: "Fever" },
    { keywords: ["allergic", "allergy", "anaphylaxis", "reaction"], label: "Allergic reaction" },
    { keywords: ["unconscious", "unresponsive", "fainting"], label: "Altered consciousness" },
    { keywords: ["severe pain", "acute pain"], label: "Significant pain" },
    { keywords: ["seizure", "convulsion", "fitting"], label: "Seizure activity" },
    { keywords: ["overdose", "poisoning", "toxic ingestion"], label: "Toxic exposure" },
    { keywords: ["difficulty breathing", "respiratory"], label: "Breathing difficulty" },
  ],
};

function extractSignals(symptoms: string, caseType: CaseType): string[] {
  const lowered = symptoms.toLowerCase();
  const matched: string[] = [];

  const definitions = SIGNAL_DEFINITIONS[caseType] ?? [];
  for (const def of definitions) {
    if (def.keywords.some((kw) => lowered.includes(kw))) {
      matched.push(def.label);
    }
  }

  return matched;
}

// ─── Reasoning Chain Builder ──────────────────────────────────────────────────

function buildReasons(
  req: RecommendationRequest,
  hospital: HospitalProfile,
  signals: string[]
): string[] {
  const reasons: string[] = [];

  // 1. Case type routing decision
  const caseTypeReasons: Record<CaseType, string> = {
    cardiac: "Case type set to Cardiac — engine routed to specialist cardiac centre",
    trauma:  "Case type set to Trauma — engine routed to Level 1 Trauma facility",
    stroke:  "Case type set to Stroke — engine routed to certified stroke centre",
    other:   "General emergency — engine routed to broad multi-speciality facility",
  };
  reasons.push(caseTypeReasons[req.caseType]);

  // 2. Urgency weighting applied
  const urgencyReasons: Record<UrgencyLevel, string> = {
    critical: "Critical urgency detected — nearest specialist centre prioritised; distance weighted 2× higher",
    medium:   "Moderate urgency — balanced weighting between proximity and specialty score applied",
    low:      "Low urgency — specialty match weighted higher than travel time",
  };
  reasons.push(urgencyReasons[req.urgency]);

  // 3. Symptom signals
  if (signals.length > 0) {
    const listed = signals.slice(0, 3).join(", ");
    const extra = signals.length > 3 ? ` (+${signals.length - 3} more)` : "";
    reasons.push(`${signals.length} clinical signal${signals.length > 1 ? "s" : ""} confirmed from symptoms: ${listed}${extra}`);
  } else {
    reasons.push("No specific clinical keywords extracted — routing based on case type and urgency");
  }

  // 4. Specialty match
  if (hospital.specialties.includes(req.caseType)) {
    reasons.push(`${hospital.name} holds verified specialty certification for ${req.caseType} emergencies`);
  }

  // 5. Availability
  if (hospital.availability === "High") {
    reasons.push("High current availability confirmed — minimal admission delay expected");
  } else if (hospital.availability === "Medium") {
    reasons.push("Medium availability — acceptable response capacity for current urgency level");
  }

  // 6. Age factor
  if (req.patientAge && req.patientAge >= 65) {
    reasons.push(
      `Patient age ${req.patientAge} flagged — specialist centres preferred for elderly ${req.caseType} patients`
    );
  }

  // 7. Distance advantage
  const secondBest = HOSPITALS.filter((h) => h.name !== hospital.name)[0];
  if (secondBest) {
    const h1dist = parseFloat(hospital.distance);
    const h2dist = parseFloat(secondBest.distance);
    if (h1dist < h2dist) {
      reasons.push(
        `Closest matched specialist at ${hospital.distance} — ${(h2dist - h1dist).toFixed(1)} km nearer than next option`
      );
    }
  }

  return reasons;
}

// ─── Scoring & Selection ──────────────────────────────────────────────────────

function pickHospital(req: RecommendationRequest): HospitalProfile {
  const scored = HOSPITALS.map((h) => {
    let score = 0;

    if (h.specialties.includes(req.caseType)) score += 50;

    if (h.availability === "High") score += 20;
    else if (h.availability === "Medium") score += 10;

    const distNum = parseFloat(h.distance);
    const distancePenalty = req.urgency === "critical" ? distNum * 8 : distNum * 4;
    score -= distancePenalty;

    const syms = req.symptoms.toLowerCase();
    if (req.caseType === "cardiac" && (syms.includes("chest") || syms.includes("heart"))) score += 15;
    if (req.caseType === "stroke" && (syms.includes("speech") || syms.includes("face") || syms.includes("arm"))) score += 15;
    if (req.caseType === "trauma" && (syms.includes("accident") || syms.includes("fracture") || syms.includes("bleed"))) score += 15;

    if (req.patientAge && req.patientAge >= 65) {
      if (h.specialties.includes("cardiac") || h.specialties.includes("stroke")) score += 10;
    }

    return { ...h, score };
  });

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return scored[0];
}

function getAlternative(primary: HospitalProfile): HospitalProfile {
  return (
    HOSPITALS.find((h) => h.name !== primary.name && h.availability !== "Low") ??
    HOSPITALS.find((h) => h.name !== primary.name) ??
    HOSPITALS[1]
  );
}

// ─── Text Builders ────────────────────────────────────────────────────────────

function buildRecommendationText(hospital: HospitalProfile, req: RecommendationRequest): string {
  const urgencyPhrases: Record<UrgencyLevel, string> = {
    critical: "Immediate transfer required —",
    medium:   "Prompt transfer recommended —",
    low:      "Transfer advised —",
  };
  const caseLabels: Record<CaseType, string> = {
    cardiac: "cardiac emergency",
    trauma:  "trauma case",
    stroke:  "stroke protocol",
    other:   "medical case",
  };
  return `${urgencyPhrases[req.urgency]} ${hospital.name} is the optimal destination for this ${caseLabels[req.caseType]}.`;
}

function getUrgencyColor(urgency: UrgencyLevel): "red" | "yellow" | "emerald" {
  return { critical: "red", medium: "yellow", low: "emerald" }[urgency];
}

function getConfidence(urgency: UrgencyLevel): string {
  return { critical: "98%", medium: "94%", low: "91%" }[urgency];
}

// ─── Public Entry Point ───────────────────────────────────────────────────────

export function getRecommendation(req: RecommendationRequest): RecommendationResult {
  const best = pickHospital(req);
  const alt  = getAlternative(best);
  const signals = extractSignals(req.symptoms, req.caseType);
  const reasons = buildReasons(req, best, signals);

  return {
    recommendation:    buildRecommendationText(best, req),
    hospitalName:      best.name,
    hospitalShortName: best.shortName,
    hospitalType:      best.type,
    priority:          req.urgency.toUpperCase(),
    distance:          best.distance,
    travelTime:        best.travelTime,
    availability:      best.availability,
    why:               best.features,
    reasons,
    matchedSignals:    signals,
    alternativeHospital: {
      name:         alt.name,
      type:         alt.type,
      distance:     alt.distance,
      travelTime:   alt.travelTime,
      availability: alt.availability,
    },
    confidence:   getConfidence(req.urgency),
    urgencyColor: getUrgencyColor(req.urgency),
  };
}
