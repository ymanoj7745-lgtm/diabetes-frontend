"use client";

import { useState } from "react";
import {
  Upload,
  Download,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface BatchResult {
  csv: string;
  rowCount: number;
  previewRows: Record<string, string>[];
}

export default function BatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchResult | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError(null);
      setResult(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/predict/batch`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(
          `Server error (${res.status}): ${errText.slice(0, 200)}`,
        );
      }

      const csv = await res.text();
      const lines = csv.trim().split("\n");
      const headers = lines[0].split(",");
      const previewRows = lines.slice(1, 6).map((line) => {
        const values = line.split(",");
        return headers.reduce<Record<string, string>>((acc, h, i) => {
          acc[h.trim()] = values[i]?.trim() ?? "";
          return acc;
        }, {});
      });

      setResult({
        csv,
        rowCount: lines.length - 1,
        previewRows,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!result) return;
    const blob = new Blob([result.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diabetes_predictions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-semibold text-slate-800 mb-2">
        Batch Prediction
      </h1>
      <p className="text-slate-600 mb-8">
        Upload a CSV with multiple patients and download risk scores for all of
        them.
      </p>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <div className="font-semibold mb-2">Required CSV columns:</div>
            <code className="block bg-white border border-blue-200 rounded px-3 py-2 text-xs font-mono text-blue-800 overflow-x-auto">
              age, is_male, is_urban, sbp1, dbp1, arm_circ, education, hv270
            </code>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="/sample_batch.csv"
                download
                className="inline-flex items-center gap-1 text-blue-700 font-medium underline"
              >
                <Download className="w-3.5 h-3.5" />
                Download sample CSV
              </a>
              <span className="text-blue-700">·</span>
              <span>Max 10,000 rows</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload form */}
      <form
        onSubmit={onSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            CSV File
          </label>
          <div className="border-2 border-dashed border-slate-300 hover:border-red-400 rounded-xl p-8 text-center transition">
            <input
              type="file"
              accept=".csv"
              onChange={onFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer block">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              {file ? (
                <div className="text-slate-800 font-medium">
                  {file.name}{" "}
                  <span className="text-slate-500 font-normal">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <>
                  <div className="text-slate-800 font-medium mb-1">
                    Click to select CSV
                  </div>
                  <div className="text-xs text-slate-500">or drag and drop</div>
                </>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Processing...
            </>
          ) : (
            "Run Batch Prediction"
          )}
        </button>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="break-all">{error}</span>
          </div>
        )}
      </form>

      {/* Results */}
      {result && (
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-slate-500">Results ready</div>
              <div className="text-2xl font-semibold text-slate-800">
                {result.rowCount.toLocaleString()} predictions
              </div>
            </div>
            <button
              onClick={downloadResults}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>

          <div className="text-sm font-medium text-slate-700 mb-3">
            Preview (first 5 rows)
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {Object.keys(result.previewRows[0] || {}).map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 font-semibold text-slate-700 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.previewRows.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v, j) => (
                      <td
                        key={j}
                        className={`px-3 py-2 whitespace-nowrap ${
                          typeof v === "string" && v.includes("%")
                            ? "font-mono font-semibold text-red-600"
                            : "text-slate-700"
                        }`}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
