export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        About This Model
      </h1>
      <p className="text-slate-600 mb-10">
        A transparent look at how the diabetes risk predictions are generated.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">📊 Data</h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <ul className="space-y-2 text-slate-700">
            <li>
              <strong>Source:</strong> NFHS-5 (2019–21) — India's National
              Family Health Survey
            </li>
            <li>
              <strong>Sample:</strong> 1,812,662 adults aged 15+ from 636,699
              households
            </li>
            <li>
              <strong>Measured:</strong> Random blood glucose, blood pressure,
              arm circumference
            </li>
            <li>
              <strong>Target:</strong> Random blood glucose &gt; 140 mg/dL OR on
              diabetes medication
            </li>
            <li>
              <strong>Prevalence:</strong> 15.37% (14.38% women, 16.50% men)
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">🧠 Model</h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <ul className="space-y-2 text-slate-700">
            <li>
              <strong>Algorithm:</strong> Random Forest (200 trees, max depth
              12)
            </li>
            <li>
              <strong>Calibration:</strong> Isotonic regression
            </li>
            <li>
              <strong>Features:</strong> 9 (age, sex, urban, SBP, DBP,
              hypertension, arm circumference, education, wealth)
            </li>
            <li>
              <strong>Test AUC:</strong> 0.766
            </li>
            <li>
              <strong>Brier Score (calibrated):</strong> 0.108
            </li>
            <li>
              <strong>Interpretability:</strong> SHAP (SHapley Additive
              exPlanations)
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          📈 Top Predictors
        </h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 font-semibold text-slate-700">
                  Rank
                </th>
                <th className="text-left p-3 font-semibold text-slate-700">
                  Feature
                </th>
                <th className="text-right p-3 font-semibold text-slate-700">
                  Mean |SHAP|
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["Age", "0.1426"],
                ["Systolic BP", "0.0475"],
                ["Arm circumference", "0.0299"],
                ["Diastolic BP", "0.0186"],
                ["Wealth quintile", "0.0165"],
                ["Hypertension", "0.0129"],
                ["Urban residence", "0.0099"],
                ["Education", "0.0061"],
                ["Male", "0.0049"],
              ].map(([feature, score], i) => (
                <tr key={feature}>
                  <td className="p-3 text-slate-500">{i + 1}</td>
                  <td className="p-3 font-medium text-slate-800">{feature}</td>
                  <td className="p-3 text-right font-mono text-slate-600">
                    {score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          ⚠️ Disclaimer
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-amber-900">
            <strong>This is a research tool, not a medical device.</strong>
          </p>
          <ul className="mt-3 space-y-1 text-amber-800 text-sm list-disc list-inside">
            <li>Predictions are based on population-level patterns</li>
            <li>Do not use for clinical diagnosis or treatment decisions</li>
            <li>Always consult a qualified healthcare professional</li>
            <li>Individual results may vary significantly</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">🛠️ Stack</h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-slate-700 mb-1">Backend</div>
              <ul className="text-slate-600 space-y-0.5">
                <li>FastAPI + Uvicorn</li>
                <li>scikit-learn, XGBoost, SHAP</li>
                <li>Docker</li>
                <li>Deployed on Render</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-700 mb-1">Frontend</div>
              <ul className="text-slate-600 space-y-0.5">
                <li>Next.js 15 + TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Recharts, Leaflet</li>
                <li>Deployed on Vercel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
