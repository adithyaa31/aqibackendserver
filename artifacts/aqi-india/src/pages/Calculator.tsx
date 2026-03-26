import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, FlaskConical, AlertCircle, Wind, Thermometer, Droplets } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function getAQIStatus(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "#22c55e", bg: "bg-green-50 border-green-200", text: "text-green-700" };
  if (aqi <= 100) return { label: "Satisfactory", color: "#84cc16", bg: "bg-lime-50 border-lime-200", text: "text-lime-700" };
  if (aqi <= 200) return { label: "Moderate", color: "#f97316", bg: "bg-orange-50 border-orange-200", text: "text-orange-700" };
  if (aqi <= 300) return { label: "Poor", color: "#dc2626", bg: "bg-red-50 border-red-200", text: "text-red-700" };
  return { label: "Hazardous", color: "#7f1d1d", bg: "bg-red-100 border-red-300", text: "text-red-900" };
}

function getChemicalAnalysis(temp: number, humidity: number, wind: number) {
  const reasons: string[] = [];
  const reactions: string[] = [];

  if (temp > 30 && wind < 3) {
    reasons.push("High temperature + low wind promotes Ozone (O₃) formation");
    reactions.push("NO₂ + sunlight → O₃ (Ozone)");
  }
  if (humidity > 70) {
    reasons.push("High humidity increases PM2.5 absorption and concentration");
    reactions.push("H₂SO₄ (aq) → Acid aerosols in humid air");
  }
  if (wind < 3) {
    reasons.push("Low wind speed causes pollutant trapping near ground level");
    reactions.push("Thermal inversion: warm air traps cold polluted air below");
  }
  if (temp > 30) {
    reasons.push("High temperature accelerates chemical reactions in atmosphere");
    reactions.push("C + O₂ → CO₂ / CO (Incomplete combustion increases)");
  }

  if (reasons.length === 0) {
    reasons.push("Conditions are relatively favorable for air quality");
    reactions.push("S + O₂ → SO₂ (Industrial, minimal at current levels)");
  }

  reactions.push("NO₂ + sunlight → O₃", "C + O₂ → CO", "S + O₂ → SO₂");

  return { reasons, reactions: [...new Set(reactions)] };
}

export default function CalculatorPage() {
  const [form, setForm] = useState({ temp: "", humidity: "", wind: "" });
  const [result, setResult] = useState<null | { aqi: number; reasons: string[]; reactions: string[] }>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    const t = parseFloat(form.temp);
    const h = parseFloat(form.humidity);
    const w = parseFloat(form.wind);

    if (isNaN(t) || isNaN(h) || isNaN(w)) {
      setError("Please fill in all fields with valid numbers.");
      return;
    }
    if (t < -10 || t > 55) { setError("Temperature must be between -10°C and 55°C."); return; }
    if (h < 0 || h > 100) { setError("Humidity must be between 0% and 100%."); return; }
    if (w < 0 || w > 100) { setError("Wind speed must be between 0 and 100 km/h."); return; }

    setError("");
    const aqi = Math.round((0.5 * t) + (0.3 * h) - (0.4 * w) + 50);
    const clampedAqi = Math.max(0, Math.min(500, aqi));
    const { reasons, reactions } = getChemicalAnalysis(t, h, w);
    setResult({ aqi: clampedAqi, reasons, reactions });
  };

  const status = result ? getAQIStatus(result.aqi) : null;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">AQI Calculator</span>
          </div>
          <h1 className="text-4xl font-display font-extrabold text-foreground mb-3">
            Predict Your Local AQI
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Enter environmental data to calculate predicted Air Quality Index using our linear regression model.
          </p>
        </motion.div>

        {/* Formula Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-border/50 mb-6"
        >
          <h2 className="font-display font-bold text-lg text-foreground mb-4">📐 Prediction Formula</h2>
          <div className="bg-gradient-to-r from-primary/5 to-india-green/5 border border-primary/20 rounded-2xl p-5 text-center">
            <p className="font-mono text-lg font-bold text-foreground">
              AQI = (0.5 × T) + (0.3 × H) − (0.4 × W) + 50
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { symbol: "T", name: "Temperature (°C)", weight: "× 0.5", color: "text-orange-500" },
              { symbol: "H", name: "Humidity (%)", weight: "× 0.3", color: "text-blue-500" },
              { symbol: "W", name: "Wind Speed (km/h)", weight: "× −0.4", color: "text-cyan-500" },
            ].map((v) => (
              <div key={v.symbol} className="bg-muted/40 rounded-xl p-3 text-center">
                <span className={`text-2xl font-extrabold font-mono ${v.color}`}>{v.symbol}</span>
                <p className="text-xs text-muted-foreground mt-1">{v.name}</p>
                <p className="text-xs font-bold text-foreground mt-0.5">{v.weight}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-border/50 mb-6"
        >
          <h2 className="font-display font-bold text-lg text-foreground mb-6">Enter Environmental Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {[
              { key: "temp", label: "Temperature", unit: "°C", icon: <Thermometer className="w-5 h-5 text-orange-500" />, placeholder: "e.g. 32", min: -10, max: 55 },
              { key: "humidity", label: "Humidity", unit: "%", icon: <Droplets className="w-5 h-5 text-blue-500" />, placeholder: "e.g. 65", min: 0, max: 100 },
              { key: "wind", label: "Wind Speed", unit: "km/h", icon: <Wind className="w-5 h-5 text-cyan-500" />, placeholder: "e.g. 4.5", min: 0, max: 100 },
            ].map((field) => (
              <div key={field.key}>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  {field.icon}
                  {field.label}
                  <span className="text-muted-foreground font-normal">({field.unit})</span>
                </label>
                <input
                  type="number"
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full border border-border rounded-xl px-4 py-3 text-foreground text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-background"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-foreground text-background font-bold text-lg rounded-2xl hover:bg-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
          >
            Calculate AQI →
          </button>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && status && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* AQI Result */}
              <div className={`bg-white rounded-3xl p-8 shadow-sm border-2 ${status.bg} text-center`}>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Predicted AQI</p>
                <div className="text-9xl font-extrabold font-display leading-none mb-3" style={{ color: status.color }}>
                  {result.aqi}
                </div>
                <span className={`inline-block px-5 py-2 rounded-full text-base font-bold ${status.text} ${status.bg} border`}>
                  {status.label}
                </span>
              </div>

              {/* Chemical Analysis */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <FlaskConical className="w-5 h-5 text-purple-500" />
                  <h2 className="font-display font-bold text-lg text-foreground">Chemical Analysis</h2>
                </div>
                <div className="space-y-2 mb-5">
                  {result.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-orange-400 mt-0.5 shrink-0">•</span>
                      {r}
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/50 pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Chemical Reactions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.reactions.map((r) => (
                      <div key={r} className="bg-muted/40 px-3 py-2 rounded-lg text-xs font-mono text-foreground">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
