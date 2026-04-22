import { NextResponse } from "next/server";
import { type RecommendationRequest, type CaseType, type UrgencyLevel } from "@/lib/recommendation";
import { getRankedRecommendations, detectSafetyWarnings } from "@/lib/recommendationEngine";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const symptoms: string = (body.symptoms ?? "").trim();
    const urgency: string = (body.urgency ?? "").toLowerCase().trim();
    const caseType: string = (body.caseType ?? "").toLowerCase().trim();
    const caseSummary: string = (body.caseSummary ?? "").trim();
    const notes: string = (body.notes ?? "").trim();
    const location: string = (body.location ?? "").trim();
    const patientAge: number | undefined = body.patientAge ? Number(body.patientAge) : undefined;

    // Validate required fields
    if (!symptoms) {
      return NextResponse.json(
        { error: "Patient symptoms / condition are required." },
        { status: 400 }
      );
    }

    if (!urgency || !["low", "medium", "critical"].includes(urgency)) {
      return NextResponse.json(
        { error: "Urgency level must be one of: low, medium, critical." },
        { status: 400 }
      );
    }

    if (!caseType || !["cardiac", "trauma", "stroke", "other"].includes(caseType)) {
      return NextResponse.json(
        { error: "Case type must be one of: cardiac, trauma, stroke, other." },
        { status: 400 }
      );
    }

    const request: RecommendationRequest = {
      caseSummary,
      symptoms,
      urgency: urgency as UrgencyLevel,
      caseType: caseType as CaseType,
      patientAge,
      location,
      notes,
    };

    // Get ranked results from the new engine
    const rankedResults = getRankedRecommendations(request);
    const safetyWarnings = detectSafetyWarnings(request);

    // Prepare final response: Best match as primary, others as alternatives
    const bestMatch = { 
      ...rankedResults[0], 
      safetyWarnings,
      alternatives: rankedResults.slice(1, 3) // Show next 2 hospitals
    };

    return NextResponse.json(bestMatch, { status: 200 });
  } catch (error) {
    console.error("[/api/recommend] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}