"use client";

import { useState } from "react";
import { predictDiabetes } from "@/lib/api";
import type { PatientInput, PredictionResponse } from "@/lib/types";
import { Loader2, AlertCircle } from "lucide-react";

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const [form, setForm] = useState<PatientInput>({
    age: 45,
    is_male: 0,
    is_urban: 1,
    sbp1: 120,
    dbp1: 80,
    arm_circ: 28,
    education: 2,
    hv270: 3,
  });

  const update = (key: keyof PatientInput, value: number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await predictDiabetes(form);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Diabetes Risk Prediction
      </h1>
      <p className="text-slate-600 mb-8">
        Enter the patient's vitals below. All values are required.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Age (years)"
              value={form.age}
              min={15}
              max={100}
              onChange={(v) => update("age", v)}
            />
            <SelectField
              label="Sex"
              value={form.is_male}
              options={[
                { value: 0, label: "Female" },
                { value: 1, label: "Male" },
              ]}
              onChange={(v) => update("is_male", v)}
            />
            <SelectField
              label="Residence"
              value={form.is_urban}
              options={[
                { value: 0, label: "Rural" },
                { value: 1, label: "Urban" },
              ]}
              onChange={(v) => update("is_urban", v)}
            />
            <SelectField
              label="Education"
              value={form.education}
              options={[
                { value: 0, label: "None" },
                { value: 1, label: "Primary" },
                { value: 2, label: "Secondary" },
                { value: 3, label: "Higher Sec." },
                { value: 4, label: "Graduate+" },
              ]}
              onChange={(v) => update("education", v)}
            />
            <SelectField
              label="Wealth Quintile"
              value={form.hv270}
              options={[
                { value: 1, label: "1 — Poorest" },
                { value: 2, label: "2 — Poorer" },
                { value: 3, label: "3 — Middle" },
                { value: 4, label: "4 — Richer" },
                { value: 5, label: "5 — Richest" },
              ]}
              onChange={(v) => update("hv270", v)}
            />
            <Field
              label="Arm Circumference (cm)"
              value={form.arm_circ}
              min={10}
              max={60}
              step={0.5}
              onChange={(v) => update("arm_circ", v)}
            />
            <Field
              label="Systolic BP (mmHg)"
              value={form.sbp1}
              min={70}
              max={250}
              onChange={(v) => update("sbp1", v)}
            />
            <Field
              label="Diastolic BP (mmHg)"
              value={form.dbp1}
              min={40}
              max={150}
              onChange={(v) => update("dbp1", v)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Predicting...
              </>
            ) : (
              "Get Risk Score"
            )}
          </button>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Result */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          {!result ? (
            <div className="h-full flex items-center justify-center text-center text-slate-400">
              <div>
                <div className="text-6xl mb-4">🩺</div>
                <p>Fill the form and click predict to see the result</p>
              </div>
            </div>
          ) : (
            <ResultPanel result={result} />
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResultPanel({ result }: { result: PredictionResponse }) {
  const colors = {
    low: "text-green-600 bg-green-50 border-green-200",
    moderate: "text-amber-600 bg-amber-50 border-amber-200",
    high: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-500 mb-1">
          Risk Score
        </div>
        <div className={`text-6xl font-bold ${colors[result.risk_category].split(" ")[0]}`}>
          {result.risk_percent}
        </div>
      </div>

      <div
        className={`inline-block px-4 py-2 rounded-full border font-semibold text-sm uppercase tracking-wide ${
          colors[result.risk_category]
        }`}
      >
        {result.risk_category} Risk
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="text-sm font-medium text-slate-700 mb-3">
          Top Contributing Factors
        </div>
        <div className="space-y-2">
          {result.top_factors.map((f) => {
            const positive = f.impact > 0;
            return (
              <div key={f.feature} className="flex items-center gap-3 text-sm">
                <span className="w-28 font-medium text-slate-600 capitalize">
                  {f.feature}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      positive ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(f.impact) * 400, 100)}%`,
                    }}
                  />
                </div>
                <span
                  className={`w-16 text-right font-mono ${
                    positive ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {f.impact > 0 ? "+" : ""}
                  {f.impact.toFixed(3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}