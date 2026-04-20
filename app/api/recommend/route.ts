import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const symptoms = (body.symptoms || "").toLowerCase();
    const urgency = (body.urgency || "").toLowerCase();

    let recommendation = "General hospital is suitable.";

    if (symptoms.includes("chest pain")) {
      recommendation =
        urgency === "critical"
          ? "Go to Cardiac Emergency Hospital immediately."
          : "Cardiac-capable hospital is recommended.";
    } else if (symptoms.includes("accident")) {
      recommendation =
        urgency === "critical"
          ? "Go to the nearest Trauma Center immediately."
          : "Nearest Trauma Center is recommended.";
    } else if (symptoms.includes("stroke")) {
      recommendation = "Stroke-ready hospital is recommended immediately.";
    }

    return NextResponse.json({
      recommendation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process recommendation." },
      { status: 500 }
    );
  }
}