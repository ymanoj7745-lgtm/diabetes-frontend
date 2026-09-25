// lib/api.ts
import type { PatientInput, PredictionResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function predictDiabetes(
  input: PatientInput
): Promise<PredictionResponse> {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Prediction failed: ${res.status} — ${error}`);
  }

  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}