"use client";

import type { RiskFactor } from "@/lib/types";

interface Props {
  factors: RiskFactor[];
}

const FEATURE_LABELS: Record<string, string> = {
  age: "Age",
  is_male: "Male",
  is_urban: "Urban",
  sbp1: "Systolic BP",
  dbp1: "Diastolic BP",
  hypertension: "Hypertension",
  arm_circ: "Arm Circumference",
  education: "Education",
  hv270: "Wealth Quintile",
};

export default function ShapChart({ factors }: Props) {
  const maxAbs = Math.max(...factors.map((f) => Math.abs(f.impact)), 0.01);

  return (
    <div className="space-y-3">
      {factors.map((f) => {
        const pct = (Math.abs(f.impact) / maxAbs) * 100;
        const positive = f.impact > 0;
        return (
          <div key={f.feature}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">
                {FEATURE_LABELS[f.feature] || f.feature}
              </span>
              <span
                className={`font-mono text-xs ${
                  positive ? "text-red-600" : "text-green-600"
                }`}
              >
                {positive ? "+" : ""}
                {f.impact.toFixed(4)}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  positive ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
