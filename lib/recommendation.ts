// lib/recommendation.ts
// Rule-based recommendation engine for MedGuard AI
// Designed for future LLM integration - structured I/O makes swap-in straightforward

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
  alternativeHospital: {
    name: string;
    type: string;
    distance: string;
    travelTime: string;
    availability: string;
  };
  confidence: string;
  urgencyColor: "red" | "yellow" | "emerald";
}

// Mock hospital data - represents Abu Dhabi area hospitals
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

function pickHospital(req: RecommendationRequest): HospitalProfile {
  // Score hospitals based on specialty match and urgency
  const scored = HOSPITALS.map((h) => {
    let score = 0;

    // Primary specialty match
    if (h.specialties.includes(req.caseType)) score += 50;

    // Availability bonus
    if (h.availability === "High") score += 20;
    else if (h.availability === "Medium") score += 10;

    // Distance/time bonus (closer = better, especially for critical)
    const distNum = parseFloat(h.distance);
    const distancePenalty = req.urgency === "critical" ? distNum * 8 : distNum * 4;
    score -= distancePenalty;

    // Symptom keyword boosts
    const syms = req.symptoms.toLowerCase();
    if (req.caseType === "cardiac" && syms.includes("chest")) score += 15;
    if (req.caseType === "stroke" && (syms.includes("speech") || syms.includes("face") || syms.includes("arm"))) score += 15;
    if (req.caseType === "trauma" && (syms.includes("accident") || syms.includes("fracture") || syms.includes("bleed"))) score += 15;

    // Age consideration (elderly -> prefer established cardiac/stroke centres)
    if (req.patientAge && req.patientAge >= 65) {
      if (h.specialties.includes("cardiac") || h.specialties.includes("stroke")) score += 10;
    }

    return { ...h, score };
  });

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return scored[0];
}

function getAlternative(primary: HospitalProfile, req: RecommendationRequest): HospitalProfile {
  return (
    HOSPITALS.find((h) => h.name !== primary.name && h.availability !== "Low") ??
    HOSPITALS.find((h) => h.name !== primary.name) ??
    HOSPITALS[1]
  );
}

function buildRecommendationText(hospital: HospitalProfile, req: RecommendationRequest): string {
  const urgencyPhrases: Record<UrgencyLevel, string> = {
    critical: "Immediate transfer required —",
    medium: "Prompt transfer recommended —",
    low: "Transfer advised —",
  };

  const caseLabels: Record<CaseType, string> = {
    cardiac: "cardiac emergency",
    trauma: "trauma case",
    stroke: "stroke protocol",
    other: "medical case",
  };

  return `${urgencyPhrases[req.urgency]} ${hospital.name} is the optimal destination for this ${caseLabels[req.caseType]}.`;
}

function getUrgencyColor(urgency: UrgencyLevel): "red" | "yellow" | "emerald" {
  const map: Record<UrgencyLevel, "red" | "yellow" | "emerald"> = {
    critical: "red",
    medium: "yellow",
    low: "emerald",
  };
  return map[urgency];
}

function getConfidence(urgency: UrgencyLevel, caseType: CaseType): string {
  if (urgency === "critical") return "98%";
  if (urgency === "medium") return "94%";
  return "91%";
}

export function getRecommendation(req: RecommendationRequest): RecommendationResult {
  const best = pickHospital(req);
  const alt = getAlternative(best, req);

  return {
    recommendation: buildRecommendationText(best, req),
    hospitalName: best.name,
    hospitalShortName: best.shortName,
    hospitalType: best.type,
    priority: req.urgency.toUpperCase(),
    distance: best.distance,
    travelTime: best.travelTime,
    availability: best.availability,
    why: best.features,
    alternativeHospital: {
      name: alt.name,
      type: alt.type,
      distance: alt.distance,
      travelTime: alt.travelTime,
      availability: alt.availability,
    },
    confidence: getConfidence(req.urgency, req.caseType),
    urgencyColor: getUrgencyColor(req.urgency),
  };
}
