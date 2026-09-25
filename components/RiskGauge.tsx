"use client";

interface Props {
  percent: number; // 0-100
  category: "low" | "moderate" | "high";
}

export default function RiskGauge({ percent, category }: Props) {
  const radius = 90;
  const circumference = Math.PI * radius; // half-circle
  const progress = (percent / 100) * circumference;

  const colors = {
    low: "#16a34a", // green-600
    moderate: "#d97706", // amber-600
    high: "#dc2626", // red-600
  };

  const color = colors[category];

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 200 120"
        className="w-full max-w-[280px]"
        aria-label={`Risk gauge ${percent}%`}
      >
        {/* Background arc */}
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.8s ease-out" }}
        />
        {/* Percentage text */}
        <text
          x="100"
          y="85"
          textAnchor="middle"
          className="fill-slate-900 font-bold"
          style={{ fontSize: "36px" }}
        >
          {percent.toFixed(1)}%
        </text>
        <text
          x="100"
          y="108"
          textAnchor="middle"
          className="fill-slate-500"
          style={{ fontSize: "12px", textTransform: "uppercase" }}
        >
          {category} risk
        </text>
      </svg>
    </div>
  );
}
