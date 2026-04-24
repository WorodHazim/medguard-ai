// lib/recommendationEngine.ts
import { HOSPITALS, Hospital } from "./hospitals";
import { RecommendationRequest, CaseType, UrgencyLevel, RecommendationResult } from "./recommendation";

export interface RankedResult extends RecommendationResult {
  score: number;
}

// ─── Scoring Engine ───────────────────────────────────────────────────────────

export function getRankedRecommendations(req: RecommendationRequest): RankedResult[] {
  const scoredHospitals = HOSPITALS.map((h) => {
    let clinical = 0;
    let time = 0;
    let availability = 0;
    const influenceFactors: string[] = [];
    const scoreBreakdown: { label: string; points: number; isNegative?: boolean }[] = [];

    // 1. Clinical Fit (Sub-Score 0-100)
    if (h.specialties.includes(req.caseType)) {
      clinical += 70;
      scoreBreakdown.push({ label: "Primary Specialty Match", points: 40 });
      influenceFactors.push(`${h.shortName} specialization match for ${req.caseType}`);
    } else {
      scoreBreakdown.push({ label: "Non-specialized Facility", points: 10, isNegative: true });
      influenceFactors.push(`No specialized ${req.caseType} unit at ${h.shortName}`);
    }

    // Age-aware logic
    const isPediatric = req.patientAge !== undefined && req.patientAge < 18;
    if (isPediatric && h.supportsPediatric) {
      clinical += 30;
      scoreBreakdown.push({ label: "Pediatric Ready", points: 20 });
      influenceFactors.push(`Pediatric emergency readiness prioritized`);
    }

    // Specialty signal extraction
    const signals = extractSignalsFromSymptoms(req.symptoms);
    if (req.caseType === "cardiac" && signals.includes("Chest pain") && h.supportsCardiac) {
      clinical += 10;
      scoreBreakdown.push({ label: "Cardiac Signal Detection", points: 15 });
      influenceFactors.push(`Cardiac alarm matched to specialty Cath Lab`);
    }

    // 2. Time Fit
    const distanceScore = Math.max(100 - (h.distanceKm * 10), 0);
    time = distanceScore;
    if (h.distanceKm < 2) {
      scoreBreakdown.push({ label: "Immediate Proximity", points: 15 });
    } else if (h.distanceKm > 10) {
      scoreBreakdown.push({ label: "Transit Distance Penalty", points: 10, isNegative: true });
    }

    // 3. Availability
    const availabilityMap = { High: 100, Medium: 60, Low: 20 };
    availability = availabilityMap[h.availability as keyof typeof availabilityMap];
    if (h.availability === "High") {
      scoreBreakdown.push({ label: "Resource Availability", points: 10 });
    } else if (h.availability === "Low") {
      scoreBreakdown.push({ label: "High Resource Saturation", points: 15, isNegative: true });
    }

    // Final Weighted Score
    const totalScore = Math.min(
      Math.round((clinical * 0.5) + (time * 0.3) + (availability * 0.2)), 
      100
    );

    return {
      hospital: h,
      score: totalScore,
      subScores: {
        clinical: Math.round(clinical),
        time: Math.round(time),
        availability: Math.round(availability)
      },
      scoreBreakdown: scoreBreakdown.slice(0, 4),
      influenceFactors: influenceFactors.slice(-4),
      matchedSignals: signals,
      isSpecialtyMatch: h.specialties.includes(req.caseType)
    };
  });

  const ranked = scoredHospitals.sort((a, b) => b.score - a.score);
  const bestMatch = ranked[0];
  const isGenericMatch = bestMatch.score < 40 || !bestMatch.isSpecialtyMatch;

  return ranked.map((item, index, arr) => {
    const h = item.hospital;
    const isTop = index === 0;
    const riskLevel = calculateRiskLevel(req, item.score);

    // Fallback text override for generic matches
    let recommendationText = buildRecommendationText(h, req, riskLevel);
    if (isTop && isGenericMatch) {
      recommendationText = `SAFE ROUTING: No strong specialty match found for "${req.caseType}". Recommending the nearest major facility (${h.shortName}) for basic evaluation.`;
    }

    return {
      recommendation: recommendationText,
      hospitalName: h.name,
      hospitalShortName: h.shortName,
      hospitalType: h.specialtyLabel,
      priority: req.urgency.toUpperCase(),
      distance: `${h.distanceKm} km`,
      travelTime: `${h.travelTimeMin} min`,
      availability: h.availability,
      why: h.features,
      reasons: buildReasoningChain(h, req, item),
      matchedSignals: item.matchedSignals,
      alternativeHospital: {
        name: arr[1]?.hospital.name || "",
        type: arr[1]?.hospital.specialtyLabel || "",
        distance: `${arr[1]?.hospital.distanceKm} km`,
        travelTime: `${arr[1]?.hospital.travelTimeMin} min`,
        availability: arr[1]?.hospital.availability || "",
      },
      confidence: `${item.score}%`,
      urgencyColor: getUrgencyColor(req.urgency),
      score: item.score,
      subScores: item.subScores,
      scoreBreakdown: item.scoreBreakdown,
      criticalIssue: buildCriticalIssue(req),
      consequence: buildConsequence(req),
      riskLevel,
      influenceFactors: item.influenceFactors,
      matchTag: isTop ? (isGenericMatch ? "SAFE ROUTE" : "BEST MATCH") : (index === 1 ? "SECOND BEST" : "SUITABLE ALT"),
      whyNotReason: buildWhyNotReason(h, item, arr[0]),
      lat: h.lat,
      lng: h.lng,
      isFallback: isTop && isGenericMatch
    };
  });
}

function calculateRiskLevel(req: RecommendationRequest, score: number): "LOW" | "MODERATE" | "HIGH" | "CRITICAL" {
  if (req.urgency === "critical") return "CRITICAL";
  if (req.urgency === "medium" || score < 50) return "HIGH";
  if (score < 80) return "MODERATE";
  return "LOW";
}

function extractSignalsFromSymptoms(symptoms: string): string[] {
  const lowered = symptoms.toLowerCase();
  const signals: string[] = [];
  if (lowered.includes("chest") || lowered.includes("heart")) signals.push("Chest pain");
  if (lowered.includes("breath") || lowered.includes("resp")) signals.push("Respiratory distress");
  if (lowered.includes("bleed") || lowered.includes("wound")) signals.push("Active bleeding");
  if (lowered.includes("face") || lowered.includes("slur") || lowered.includes("droop")) signals.push("Stroke indicators");
  if (lowered.includes("bone") || lowered.includes("fracture")) signals.push("Suspected fracture");
  return signals;
}

function buildReasoningChain(h: Hospital, req: RecommendationRequest, item: any): string[] {
  const reasons: string[] = [];
  if (h.specialties.includes(req.caseType)) reasons.push(`Specialized ${req.caseType} unit available.`);
  if (req.patientAge && Number(req.patientAge) < 18 && h.supportsPediatric) reasons.push(`Pediatric emergency support confirmed.`);
  if (item.subScores.time > 80) reasons.push(`Minimal transit time reduces clinical risk.`);
  return reasons;
}

function buildCriticalIssue(req: RecommendationRequest): string {
  if (req.caseType === "cardiac") return "Cardiac cases require immediate specialized care at a cardiac-capable facility.";
  if (req.caseType === "stroke") return "Neurological deficits are time-critical; matching with a Stroke Unit is essential.";
  if (req.caseType === "trauma") return "Mechanical injuries require Level 1 Trauma stabilization to prevent shock.";
  return "Time-to-treatment significantly impacts final clinical outcomes in acute cases.";
}

function buildConsequence(req: RecommendationRequest): string {
  if (req.caseType === "cardiac") return "Delay in treatment may worsen cardiac outcomes or lead to myocardial damage.";
  if (req.caseType === "stroke") return "Stroke cases are highly time-sensitive; 'Time is brain' protocols are active.";
  if (req.caseType === "trauma") return "Immediate trauma care is strongly recommended to stabilize vital signs.";
  return "Delayed evaluation may increase patient risk in high-severity presentations.";
}

function buildWhyNotReason(h: Hospital, item: any, top: any): string {
  if (h.name === top.hospital.name) return "";
  if (h.distanceKm > top.hospital.distanceKm + 5) return "Significant distance delta vs. primary match.";
  if (item.subScores.clinical < 50) return "Less specialized facilities for this specific case context.";
  if (h.availability === "Low") return "Lower resource availability increases admission latency.";
  return "Alternative facility with lower overall clinical match confidence.";
}

function buildRecommendationText(h: Hospital, req: RecommendationRequest, risk: string): string {
  if (risk === "CRITICAL") return `IMMEDIATE ACTION: Transfer to ${h.name} for acute ${req.caseType} stabilization.`;
  return `RECOMMENDED: ${h.shortName} identified as the optimal facility for this ${req.caseType} case.`;
}

export function getUrgencyColor(urgency: UrgencyLevel): "red" | "yellow" | "emerald" {
  const map: Record<UrgencyLevel, "red" | "yellow" | "emerald"> = { 
    critical: "red", 
    medium: "yellow", 
    low: "emerald" 
  };
  return map[urgency];
}

export function detectSafetyWarnings(req: RecommendationRequest): string[] {
  const warnings: string[] = [];
  if (req.urgency === "critical") {
    warnings.push("CRITICAL: If the patient is in immediate danger, call emergency services (999) without delay.");
  }
  
  const signals = extractSignalsFromSymptoms(req.symptoms);
  if (req.caseType === "other" && signals.some(s => ["Chest pain", "Stroke indicators"].includes(s))) {
    warnings.push("ADVISORY: Reported symptoms suggest high-priority cardiac or neurological event. Specialized matching applied.");
  }
  
  return warnings;
}
