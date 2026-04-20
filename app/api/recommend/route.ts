import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { symptoms } = body;
  let result = "";

  if (symptoms.includes("chest pain")) {
    result = "Go to Cardiac Emergency Hospital immediately.";
  } else if (symptoms.includes("accident")) {
    result = "Nearest Trauma Center is recommended.";
  } else {
    result = "General hospital is suitable.";
  }

  return NextResponse.json({
    recommendation: result,
  });
}