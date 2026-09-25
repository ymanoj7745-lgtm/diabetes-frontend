"use client";

import { useEffect, useState } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoJsonObject } from "geojson";

interface StateData {
  state: string;
  prevalence: number;
  samples: number;
}

// Benchmark from NFHS-5 report (Table 12.6.2 — men)
const STATE_PREVALENCE: Record<string, number> = {
  Kerala: 27.0, Goa: 24.1, TamilNadu: 22.1, AndhraPradesh: 21.8,
  Puducherry: 21.7, Lakshadweep: 20.7, Tripura: 19.3, Telangana: 18.1,
  AndamanandNicobar: 17.9, Odisha: 17.0, Gujarat: 16.9, Chandigarh: 16.6,
  Manipur: 16.5, DadraandNagarHaveli: 16.4, Bihar: 16.2, Assam: 16.0,
  Sikkim: 15.7, Karnataka: 15.6, Mizoram: 15.4, WestBengal: 21.3,
  HimachalPradesh: 14.7, Uttarakhand: 14.2, Jharkhand: 14.1,
  Punjab: 14.1, Delhi: 14.1, Meghalaya: 13.9, Maharashtra: 13.6,
  Haryana: 13.5, Nagaland: 12.4, MadhyaPradesh: 12.2, ArunachalPradesh: 11.9,
  UttarPradesh: 11.6, Chhattisgarh: 10.8, Rajasthan: 8.9,
  JammuandKashmir: 8.0, Ladakh: 8.3,
};

function getColor(prevalence: number): string {
  if (prevalence >= 22) return "#7f1d1d";
  if (prevalence >= 18) return "#b91c1c";
  if (prevalence >= 15) return "#dc2626";
  if (prevalence >= 12) return "#f87171";
  if (prevalence >= 10) return "#fca5a5";
  return "#fecaca";
}

export default function IndiaMap() {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [selected, setSelected] = useState<StateData | null>(null);

  useEffect(() => {
    fetch("/india-states.geojson")
      .then((r) => r.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    const rawName = feature.properties.NAME_1 || feature.properties.st_nm || feature.properties.name || "";
    const cleanName = rawName.replace(/\s+/g, "");
    const prevalence = STATE_PREVALENCE[cleanName] ?? null;

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({ weight: 2, color: "#111827", fillOpacity: 0.9 });
      },
      mouseout: (e: any) => {
        e.target.setStyle({ weight: 0.5, color: "#ffffff", fillOpacity: 0.8 });
      },
      click: () => {
        if (prevalence !== null) {
          setSelected({
            state: rawName,
            prevalence,
            samples: Math.round(prevalence * 1000),
          });
        }
      },
    });

    if (prevalence !== null) {
      layer.bindTooltip(
        `<strong>${rawName}</strong><br/>Risk: ${prevalence.toFixed(1)}%`,
        { sticky: true }
      );
    } else {
      layer.bindTooltip(`${rawName}<br/>No data`, { sticky: true });
    }
  };

  const style = (feature: any) => {
    const rawName = feature.properties.NAME_1 || feature.properties.st_nm || feature.properties.name || "";
    const cleanName = rawName.replace(/\s+/g, "");
    const prevalence = STATE_PREVALENCE[cleanName] ?? 0;
    return {
      fillColor: getColor(prevalence),
      weight: 0.5,
      opacity: 1,
      color: "#ffffff",
      fillOpacity: 0.8,
    };
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-slate-700 mb-3">
          Diabetes Prevalence (RBG &gt; 140 mg/dL)
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            { color: "#fecaca", label: "< 10%" },
            { color: "#fca5a5", label: "10–12%" },
            { color: "#f87171", label: "12–15%" },
            { color: "#dc2626", label: "15–18%" },
            { color: "#b91c1c", label: "18–22%" },
            { color: "#7f1d1d", label: "≥ 22%" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded border border-slate-300"
                style={{ background: l.color }}
              />
              <span className="text-slate-600">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div style={{ height: "600px", width: "100%" }}>
          <MapContainer
            center={[22.5, 79]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.3}
            />
            {geoData && (
              <GeoJSON
                data={geoData}
                style={style}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Selected state card */}
      {selected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="text-sm font-medium text-red-700 mb-1">
            Selected State
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {selected.state}
          </div>
          <div className="mt-3 flex gap-6 text-sm">
            <div>
              <div className="text-slate-500">Prevalence</div>
              <div className="text-xl font-bold text-red-600">
                {selected.prevalence.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-slate-500">Est. Samples</div>
              <div className="text-xl font-bold text-slate-700">
                {selected.samples.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-slate-500 text-center">
        Data source: NFHS-5 (2019–21) · Table 12.6.2 · Men aged 15+
      </div>
    </div>
  );
}