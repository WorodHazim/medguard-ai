// lib/recommendationEngine.ts
import { HOSPITALS, Hospital } from "./hospitals";
import { RecommendationRequest, CaseType, UrgencyLevel, RecommendationResult } from "./recommendation";

export interface RankedResult extends RecommendationResult {
  score: number;
  matchTag?: string;
  whyNotReason?: string;
}

// ─── Scoring Logic ────────────────────────────────────────────────────────────

export function getRankedRecommendations(req: RecommendationRequest): RankedResult[] {
  const scoredHospitals = HOSPITALS.map((h) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Specialty Match (Base 40 pts)
    if (h.specialties.includes(req.caseType)) {
      score += 40;
      reasons.push(`${h.shortName} is a certified specialist centre for ${req.caseType} cases.`);
    }

    // 2. Urgency Boost (Base 20 pts)
    if (req.urgency === "critical" && h.supportsEmergency) {
      score += 20;
      reasons.push(`Emergency readiness prioritized for critical triage status.`);
    } else if (req.urgency === "medium") {
      score += 10;
    }

    // 3. Proximity (Base 20 pts)
    // 20 points for < 2km, 10 points for < 4km
    if (h.distanceKm < 2) {
      score += 20;
      reasons.push(`Close proximity (${h.distanceKm}km) reduces critical transit time.`);
    } else if (h.distanceKm < 4) {
      score += 10;
    }

    // 4. Availability (Base 10 pts)
    if (h.availability === "High") {
      score += 10;
      reasons.push(`High current bed availability ensures rapid admission.`);
    } else if (h.availability === "Medium") {
      score += 5;
    }

    // 5. Age Suitability (Base 10 pts)
    if (req.patientAge && req.patientAge < 18 && h.supportsPediatric) {
      score += 10;
      reasons.push(`On-site pediatric emergency support suitable for young patient.`);
    } else if (req.patientAge && req.patientAge >= 65 && (req.caseType === "cardiac" || req.caseType === "stroke")) {
      // Elderly cardiac/stroke patients need specific geriatric backup
      score += 5;
    }

    // 6. Signal Extraction (Dynamic Reasoning)
    const signals = extractSignalsFromSymptoms(req.symptoms);
    if (signals.length > 0) {
      if (req.caseType === "cardiac" && signals.includes("Chest pain") && h.supportsCardiac) {
        score += 10;
        reasons.push(`Priority cardiac status confirmed due to reported chest pain.`);
      }
      if (req.caseType === "trauma" && signals.includes("Active bleeding") && h.supportsTrauma) {
        score += 10;
        reasons.push(`Immediate trauma response triggered for bleeding control.`);
      }
    }

    return {
      hospital: h,
      score: Math.min(score, 100),
      reasons: reasons.slice(0, 5), // Keep top 5 reasoning points
      matchedSignals: signals,
    };
  });

  // Sort by score descending
  const ranked = scoredHospitals.sort((a, b) => b.score - a.score);

  // Map to final RecommendationResult structure
  return ranked.map((item, index, arr) => {
    const h = item.hospital;
    const isTop = index === 0;
    
    // Generate "Why Not" reason for alternatives
    let whyNotReason = "";
    if (!isTop) {
      const top = arr[0];
      if (top.hospital.distanceKm < h.distanceKm && top.hospital.specialties.includes(req.caseType)) {
        whyNotReason = "Further distance compared to top match.";
      } else if (!h.specialties.includes(req.caseType)) {
        whyNotReason = `Lacks primary specialization in ${req.caseType}.`;
      } else if (h.availability === "Low" || h.availability === "Medium") {
        whyNotReason = "Lower current resource availability.";
      } else {
        whyNotReason = "Lower overall match score for clinical requirements.";
      }
    }

    // Match tags
    const matchTag = isTop ? "BEST MATCH" : (index === 1 ? "SECOND BEST" : "SUITABLE ALT");

    return {
      recommendation: buildRecommendationText(h, req),
      hospitalName: h.name,
      hospitalShortName: h.shortName,
      hospitalType: h.specialtyLabel,
      priority: req.urgency.toUpperCase(),
      distance: `${h.distanceKm} km`,
      travelTime: `${h.travelTimeMin} min`,
      availability: h.availability,
      why: h.features,
      reasons: item.reasons,
      matchedSignals: item.matchedSignals,
      alternativeHospital: { // Legacy field, keeping for compatibility but will likely ignore in UI
        name: arr[1]?.hospital.name || "",
        type: arr[1]?.hospital.specialtyLabel || "",
        distance: `${arr[1]?.hospital.distanceKm} km`,
        travelTime: `${arr[1]?.hospital.travelTimeMin} min`,
        availability: arr[1]?.hospital.availability || "",
      },
      confidence: `${item.score}%`,
      urgencyColor: getUrgencyColor(req.urgency),
      score: item.score,
      matchTag,
      whyNotReason,
      lat: h.lat,
      lng: h.lng,
    };
  });
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function extractSignalsFromSymptoms(symptoms: string): string[] {
  const lowered = symptoms.toLowerCase();
  const signals: string[] = [];
  if (lowered.includes("chest") || lowered.includes("heart")) signals.push("Chest pain");
  if (lowered.includes("breath") || lowered.includes("resp")) signals.push("Respiratory distress");
  if (lowered.includes("bleed") || lowered.includes("wound")) signals.push("Active bleeding");
  if (lowered.includes("face") || lowered.includes("slur")) signals.push("Stroke indicators");
  if (lowered.includes("bone") || lowered.includes("fracture")) signals.push("Suspected fracture");
  return signals;
}

function buildRecommendationText(h: Hospital, req: RecommendationRequest): string {
  if (req.urgency === "critical") {
    return `IMMEDIATE ACTION: Transfer to ${h.name} for acute ${req.caseType} stabilization.`;
  }
  return `RECOMMENDED: ${h.name} identifies as the optimal facility for this ${req.caseType} case.`;
}

function getUrgencyColor(urgency: UrgencyLevel): "red" | "yellow" | "emerald" {
  return { critical: "red", medium: "yellow", low: "emerald" }[urgency];
}

export function detectSafetyWarnings(req: RecommendationRequest): string[] {
  const warnings: string[] = [];
  if (req.urgency === "critical") {
    warnings.push("CRITICAL: If the patient is in immediate danger, call emergency services (999) without delay.");
  }
  
  const signals = extractSignalsFromSymptoms(req.symptoms);
  if (req.caseType === "other" && signals.some(s => ["Chest pain", "Stroke indicators"].includes(s))) {
    warnings.push("ADVISORY: Reported symptoms suggest a high-priority cardiac or neurological event. Case type updated internally.");
  }
  
  return warnings;
}
