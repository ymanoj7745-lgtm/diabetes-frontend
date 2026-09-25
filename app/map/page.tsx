"use client";

import dynamic from "next/dynamic";

// Leaflet needs to load client-side only
const IndiaMap = dynamic(() => import("@/components/IndiaMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center text-slate-500">
      Loading map...
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        State-Level Risk Map
      </h1>
      <p className="text-slate-600 mb-8">
        Diabetes prevalence across Indian states based on NFHS-5 (2019–21).
        Click any state for details.
      </p>

      <IndiaMap />
    </div>
  );
}