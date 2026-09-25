import Link from "next/link";
import { ArrowRight, Activity, BarChart3, Map, Upload } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Activity,
      title: "Instant Prediction",
      desc: "Enter 8 vitals and get a diabetes risk score with SHAP explanation.",
      href: "/predict",
      cta: "Try Predictor",
    },
    {
      icon: Upload,
      title: "Batch Analysis",
      desc: "Upload a CSV of patients and get risk scores for all of them.",
      href: "/batch",
      cta: "Upload CSV",
    },
    {
      icon: Map,
      title: "State-Level Map",
      desc: "Explore diabetes risk patterns across Indian states.",
      href: "/map",
      cta: "View Map",
    },
    {
      icon: BarChart3,
      title: "Model Analytics",
      desc: "Feature importance, SHAP summary, and performance metrics.",
      href: "/about",
      cta: "Learn More",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            Trained on 1.8 million NFHS-5 records
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Diabetes Risk,{" "}
            <span className="text-red-600">Explained.</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8">
            AI-powered diabetes risk assessment using the largest publicly
            available health dataset in India. Get instant predictions with
            interpretable SHAP explanations.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/predict"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Start Prediction <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-medium transition"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { label: "Training Records", value: "1.81 M" },
            { label: "Model AUC", value: "0.766" },
            { label: "Top Predictor", value: "Age" },
            { label: "Features", value: "9" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-slate-200 rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-slate-900">
                {s.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          What you can do
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group bg-white border border-slate-200 hover:border-red-300 hover:shadow-lg rounded-2xl p-8 transition"
            >
              <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center mb-4 transition">
                <f.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {f.title}
              </h3>
              <p className="text-slate-600 mb-4">{f.desc}</p>
              <span className="inline-flex items-center gap-1 text-red-600 font-medium text-sm">
                {f.cta} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-sm text-amber-900">
            <strong>⚠️ Research Tool Only.</strong> This is not a medical
            device. Predictions are based on population-level statistical
            patterns and should not replace professional medical advice.
          </p>
        </div>
      </section>
    </div>
  );
}