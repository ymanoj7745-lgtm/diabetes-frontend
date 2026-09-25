// lib/types.ts

export interface PatientInput {
  age: number;
  is_male: number;       // 0 = female, 1 = male
  is_urban: number;      // 0 = rural, 1 = urban
  sbp1: number;          // systolic BP
  dbp1: number;          // diastolic BP
  arm_circ: number;      // arm circumference in cm
  education: number;     // 0-4
  hv270: number;         // wealth quintile 1-5
}

export interface RiskFactor {
  feature: string;
  impact: number;
}

export interface PredictionResponse {
  risk_score: number;
  risk_percent: string;
  risk_category: "low" | "moderate" | "high";
  threshold_used: number;
  top_factors: RiskFactor[];
}