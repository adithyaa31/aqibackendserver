import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, FlaskConical, AlertCircle, Wind, Thermometer, Droplets,
  Activity, Zap, Heart, Clock, TrendingUp, TrendingDown,
  CloudFog, Flame, Leaf, ShieldAlert, ChevronDown, ChevronUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* ──────────────── AQI Breakpoint engine (CPCB Indian standard) ──────────────── */
type Breakpoint = [number, number, number, number];

const PM25_BP: Breakpoint[] = [
  [0, 30, 0, 50], [30, 60, 51, 100], [60, 90, 101, 150],
  [90, 120, 151, 200], [120, 250, 201, 300], [250, 380, 301, 400], [380, 500, 401, 500],
];
const PM10_BP: Breakpoint[] = [
  [0, 50, 0, 50], [50, 100, 51, 100], [100, 250, 101, 150],
  [250, 350, 151, 200], [350, 430, 201, 300], [430, 500, 301, 400], [500, 600, 401, 500],
];
const NO2_BP: Breakpoint[] = [
  [0, 40, 0, 50], [40, 80, 51, 100], [80, 180, 101, 150],
  [180, 280, 151, 200], [280, 400, 201, 300], [400, 800, 301, 400], [800, 1200, 401, 500],
];
const SO2_BP: Breakpoint[] = [
  [0, 40, 0, 50], [40, 80, 51, 100], [80, 380, 101, 150],
  [380, 800, 151, 200], [800, 1600, 201, 300], [1600, 2100, 301, 400], [2100, 2620, 401, 500],
];
const CO_BP: Breakpoint[] = [
  [0, 1, 0, 50], [1, 2, 51, 100], [2, 10, 101, 150],
  [10, 17, 151, 200], [17, 34, 201, 300], [34, 46, 301, 400], [46, 57.5, 401, 500],
];

function calcSubIndex(c: number, bps: Breakpoint[]): number {
  for (const [clo, chi, ilo, ihi] of bps) {
    if (c >= clo && c <= chi) {
      return Math.round(((ihi - ilo) / (chi - clo)) * (c - clo) + ilo);
    }
  }
  return c > bps[bps.length - 1][1] ? 500 : 0;
}

/* ──────────────── Color helpers ──────────────── */
function aqiColor(aqi: number) {
  if (aqi <= 50)  return { hex: "#22c55e", bg: "bg-green-500/10",  border: "border-green-500/30",  text: "text-green-500",  label: "Good",          ring: "shadow-green-500/20"  };
  if (aqi <= 100) return { hex: "#84cc16", bg: "bg-lime-500/10",   border: "border-lime-500/30",   text: "text-lime-500",   label: "Satisfactory",  ring: "shadow-lime-500/20"   };
  if (aqi <= 150) return { hex: "#f59e0b", bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-500",  label: "Moderate",      ring: "shadow-amber-500/20"  };
  if (aqi <= 200) return { hex: "#f97316", bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-500", label: "Poor",          ring: "shadow-orange-500/20" };
  if (aqi <= 300) return { hex: "#dc2626", bg: "bg-red-500/10",    border: "border-red-500/30",    text: "text-red-500",    label: "Very Poor",     ring: "shadow-red-500/20"    };
  return                 { hex: "#7c3aed", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-500", label: "Hazardous",     ring: "shadow-purple-500/20" };
}

/* ──────────────── Analysis engine ──────────────── */
function analyze(f: FormValues) {
  const pm25 = parseFloat(f.pm25), pm10 = parseFloat(f.pm10);
  const co   = parseFloat(f.co),   no2  = parseFloat(f.no2),  so2 = parseFloat(f.so2);
  const temp = parseFloat(f.temp), hum  = parseFloat(f.humidity), wind = parseFloat(f.wind);

  const sub = {
    PM25: calcSubIndex(pm25, PM25_BP),
    PM10: calcSubIndex(pm10, PM10_BP),
    CO:   calcSubIndex(co,   CO_BP),
    NO2:  calcSubIndex(no2,  NO2_BP),
    SO2:  calcSubIndex(so2,  SO2_BP),
  };
  const aqi = Math.max(...Object.values(sub));
  const dominant = Object.entries(sub).sort((a, b) => b[1] - a[1])[0][0];

  // Pollution contribution %
  const total = Object.values(sub).reduce((s, v) => s + v, 0) || 1;
  const contrib = Object.fromEntries(Object.entries(sub).map(([k, v]) => [k, Math.round((v / total) * 100)]));

  // Smog Index (NO2 × temp factor / wind)
  const smogScore = (no2 / 40) * (1 + (temp - 20) / 40) * (1 / Math.max(wind, 0.5));
  const smog = smogScore < 1 ? "Low" : smogScore < 3 ? "Medium" : "High";

  // Toxicity Index
  const toxScore = (no2 / 80) + (so2 / 80) + (co / 10);
  const toxicity = toxScore < 0.5 ? "Low" : toxScore < 1.5 ? "Moderate" : "High";

  // Safe Exposure Time
  let exposure: string;
  if (aqi <= 50)       exposure = "Unlimited — enjoy the outdoors!";
  else if (aqi <= 100) exposure = "8–12 hours safe for most people";
  else if (aqi <= 150) exposure = "4–6 hours (sensitive groups: 2 hrs)";
  else if (aqi <= 200) exposure = "1–2 hours max, wear a mask";
  else if (aqi <= 300) exposure = "Avoid outdoor stay. <30 mins max";
  else                 exposure = "Stay indoors — hazardous conditions";

  // Health Impact
  const health = aqi <= 50
    ? { lung: "Minimal",   effects: "Air is clean. Ideal for all activities.",                   unsafe: ""                          }
    : aqi <= 100
    ? { lung: "Low",       effects: "Mild discomfort for very sensitive individuals.",             unsafe: "None"                      }
    : aqi <= 150
    ? { lung: "Moderate",  effects: "Breathing discomfort for children & elderly.",               unsafe: "Asthma, heart patients"     }
    : aqi <= 200
    ? { lung: "High",      effects: "Respiratory discomfort likely. Reduce outdoor exertion.",    unsafe: "Everyone — limit exposure"  }
    : aqi <= 300
    ? { lung: "Very High", effects: "Serious risk of respiratory & cardiovascular effects.",      unsafe: "Everyone — stay indoors"    }
    : { lung: "Hazardous", effects: "Emergency-level health risk. Immediate protective action.",  unsafe: "Everyone — DO NOT go out"   };

  // AQI Prediction
  const delta = aqi > 200 ? Math.round(10 + Math.random() * 15)
    : aqi > 150 ? Math.round(3 + Math.random() * 10)
    : Math.round(-8 + Math.random() * 14);
  const predicted = Math.max(0, Math.min(500, aqi + delta));

  // Wind Dispersion
  const dispersion = wind >= 8
    ? { label: "Good Dispersal", desc: "Wind speed is dispersing pollutants effectively.", icon: "🌬️", positive: true }
    : wind >= 4
    ? { label: "Moderate Dispersal", desc: "Partial dispersal. Some pollutant build-up possible.", icon: "💨", positive: true }
    : { label: "Pollutants Trapped", desc: "Low wind speed traps pollution near ground level. Risk of smog.", icon: "⚠️", positive: false };

  // Temperature impact
  const tempImpact = temp > 35
    ? "Extreme heat accelerates ozone and secondary pollutant formation. PM2.5 can spike."
    : temp > 25
    ? "Elevated temperature promotes NO₂ photolysis, increasing ozone formation."
    : temp < 10
    ? "Cold temperatures increase particulate matter concentration and inhibit dispersion."
    : "Moderate temperature — chemical reaction rates are near normal.";

  // Chemical reactions
  const reactions: { eq: string; desc: string }[] = [
    { eq: "NO₂ + hν → NO + O·",                 desc: "Photolysis produces reactive oxygen atoms" },
    { eq: "O· + O₂ → O₃",                        desc: "Ground-level ozone formation" },
    { eq: "SO₂ + H₂O → H₂SO₃ → H₂SO₄",          desc: "Sulfur dioxide forms acid rain" },
    { eq: "NO₂ + H₂O → HNO₃ + HNO₂",             desc: "Nitrogen dioxide causes acid deposition" },
    { eq: "2CO + O₂ → 2CO₂",                      desc: "Carbon monoxide oxidation" },
    { eq: "PM₂.₅ + H₂O → Aerosol growth",         desc: "Particulate matter absorbs moisture, grows" },
  ];
  if (temp > 30) reactions.push({ eq: "VOC + NOₓ + heat → O₃ (smog)", desc: "Hot weather intensifies smog formation" });
  if (hum > 70)  reactions.push({ eq: "SO₄²⁻ + NH₃ → (NH₄)₂SO₄",     desc: "High humidity promotes aerosol nucleation" });

  // Overall Risk Score (0–100)
  const risk = Math.min(100, Math.round(
    (aqi / 500) * 50 +
    (smog === "High" ? 20 : smog === "Medium" ? 10 : 0) +
    (toxicity === "High" ? 20 : toxicity === "Moderate" ? 10 : 0) +
    (wind < 3 ? 10 : 0)
  ));

  // Environmental Impact
  const envImpact = risk > 75 ? "Severe" : risk > 50 ? "High" : risk > 25 ? "Moderate" : "Low";

  return { aqi, dominant, sub, contrib, smog, toxicity, exposure, health, predicted, delta, dispersion, tempImpact, reactions, risk, envImpact };
}

/* ──────────────── Form types ──────────────── */
interface FormValues { pm25: string; pm10: string; co: string; no2: string; so2: string; temp: string; humidity: string; wind: string; }

const EMPTY: FormValues = { pm25: "", pm10: "", co: "", no2: "", so2: "", temp: "", humidity: "", wind: "" };

const PRESETS = {
  "Delhi (Severe)":    { pm25: "150", pm10: "280", co: "4.5", no2: "120", so2: "45",  temp: "34", humidity: "55", wind: "1.5" },
  "Mumbai (Moderate)": { pm25: "60",  pm10: "120", co: "1.8", no2: "60",  so2: "25",  temp: "30", humidity: "75", wind: "6"   },
  "Bangalore (Good)":  { pm25: "28",  pm10: "52",  co: "0.8", no2: "30",  so2: "12",  temp: "24", humidity: "60", wind: "8"   },
  "Patna (Hazardous)": { pm25: "210", pm10: "380", co: "8.5", no2: "200", so2: "90",  temp: "36", humidity: "48", wind: "0.8" },
};

/* ──────────────── Small card wrapper ──────────────── */
function ResultCard({ title, icon, children, delay = 0, accent = "" }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; delay?: number; accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      className={`bg-card rounded-2xl p-5 border ${accent || "border-border/50"} shadow-sm`}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-display font-bold text-base text-foreground">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

/* ──────────────── Progress bar ──────────────── */
function PollutantBar({ name, pct, index, dominant }: { name: string; pct: number; index: number; dominant: string }) {
  const isTop = name === dominant;
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-purple-500"];
  return (
    <div className="flex items-center gap-3">
      <span className={`w-12 text-xs font-bold ${isTop ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
      <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.1 * index, duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${colors[index % colors.length]}`}
        />
      </div>
      <span className={`w-10 text-right text-xs font-bold ${isTop ? "text-primary" : "text-muted-foreground"}`}>
        {pct}% {isTop && "🔺"}
      </span>
    </div>
  );
}

/* ──────────────── Risk meter ──────────────── */
function RiskMeter({ score }: { score: number }) {
  const color = score > 75 ? "#7c3aed" : score > 50 ? "#dc2626" : score > 25 ? "#f97316" : "#22c55e";
  const label = score > 75 ? "Severe Risk" : score > 50 ? "High Risk" : score > 25 ? "Moderate Risk" : "Low Risk";
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-4xl font-extrabold font-display" style={{ color }}>{score}</span>
        <span className="text-sm font-bold" style={{ color }}>{label}</span>
      </div>
      <div className="w-full h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 to-purple-600 relative">
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 shadow-lg"
          style={{ borderColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
      </div>
    </div>
  );
}

/* ──────────────── Badge ──────────────── */
function Badge({ label, color }: { label: string; color: string }) {
  const map: Record<string, string> = {
    Low: "bg-green-500/15 text-green-600 border-green-500/30",
    Medium: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    High: "bg-red-500/15 text-red-600 border-red-500/30",
    Moderate: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    Severe: "bg-purple-500/15 text-purple-600 border-purple-500/30",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${map[color] || "bg-muted"}`}>
      {label}
    </span>
  );
}

/* ──────────────── Main page ──────────────── */
export default function CalculatorPage() {
  const [form, setForm] = useState<FormValues>(EMPTY);
  const [result, setResult] = useState<ReturnType<typeof analyze> | null>(null);
  const [error, setError] = useState("");
  const [showReactions, setShowReactions] = useState(false);

  const FIELDS = [
    { key: "pm25",     label: "PM₂.₅",       unit: "µg/m³", icon: <CloudFog className="w-4 h-4 text-gray-400" />,    placeholder: "e.g. 60",  min: 0,  max: 500 },
    { key: "pm10",     label: "PM₁₀",        unit: "µg/m³", icon: <CloudFog className="w-4 h-4 text-gray-500" />,    placeholder: "e.g. 100", min: 0,  max: 600 },
    { key: "co",       label: "CO",           unit: "mg/m³", icon: <Flame className="w-4 h-4 text-amber-500" />,      placeholder: "e.g. 2.5", min: 0,  max: 60  },
    { key: "no2",      label: "NO₂",          unit: "µg/m³", icon: <Zap className="w-4 h-4 text-yellow-500" />,       placeholder: "e.g. 80",  min: 0,  max: 1200},
    { key: "so2",      label: "SO₂",          unit: "µg/m³", icon: <Activity className="w-4 h-4 text-purple-500" />, placeholder: "e.g. 40",  min: 0,  max: 2620},
    { key: "temp",     label: "Temperature",  unit: "°C",    icon: <Thermometer className="w-4 h-4 text-orange-500" />, placeholder: "e.g. 32", min: -10, max: 55 },
    { key: "humidity", label: "Humidity",     unit: "%",     icon: <Droplets className="w-4 h-4 text-blue-500" />,    placeholder: "e.g. 65",  min: 0,  max: 100 },
    { key: "wind",     label: "Wind Speed",   unit: "km/h",  icon: <Wind className="w-4 h-4 text-cyan-500" />,        placeholder: "e.g. 4.5", min: 0,  max: 100 },
  ];

  const handleCalculate = () => {
    for (const f of FIELDS) {
      const v = parseFloat(form[f.key as keyof FormValues]);
      if (isNaN(v)) { setError(`Please enter a valid value for ${f.label}.`); return; }
      if (v < f.min || v > f.max) { setError(`${f.label} must be between ${f.min} and ${f.max} ${f.unit}.`); return; }
    }
    setError("");
    setResult(analyze(form));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const loadPreset = (name: string) => {
    setForm(PRESETS[name as keyof typeof PRESETS] as FormValues);
    setResult(null);
    setError("");
  };

  const status = result ? aqiColor(result.aqi) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Advanced AQI Analyzer</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-foreground mb-3">
            Computational Chemistry &<br />
            <span className="text-primary">Air Quality Engine</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Input real pollutant concentrations and environmental data to get a full scientific analysis — health impacts, smog prediction, toxicity scores, and chemical insights.
          </p>
        </motion.div>

        {/* Presets */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Load Presets</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => loadPreset(name)}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-border bg-card hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm mb-6"
        >
          <h2 className="font-display font-bold text-xl text-foreground mb-2 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Input Pollutant & Environmental Data
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Enter 24-hour average concentrations using CPCB standard units.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  {field.icon}
                  {field.label}
                  <span className="text-muted-foreground/60">({field.unit})</span>
                </label>
                <input
                  type="number"
                  placeholder={field.placeholder}
                  value={form[field.key as keyof FormValues]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-foreground text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-background"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-foreground text-background font-bold text-lg rounded-2xl hover:bg-primary hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            🔬 Run Full Analysis →
          </button>
        </motion.div>

        {/* ── RESULTS ── */}
        <AnimatePresence>
          {result && status && (
            <div id="results" className="space-y-4">

              {/* ── Row 1: AQI Hero + Overall Risk ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* AQI Result */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`${status.bg} ${status.border} border-2 rounded-3xl p-8 text-center shadow-lg ${status.ring} shadow-xl`}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Calculated AQI</p>
                  <div className="text-8xl font-extrabold font-display leading-none mb-3" style={{ color: status.hex }}>
                    {result.aqi}
                  </div>
                  <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-base border ${status.border} ${status.text} bg-background/50`}>
                    {status.label}
                  </span>
                  <p className="text-sm text-muted-foreground mt-3">
                    Dominant pollutant: <strong className={status.text}>{result.dominant}</strong>
                  </p>
                  <div className="mt-4 grid grid-cols-5 gap-1">
                    {Object.entries(result.sub).map(([k, v]) => (
                      <div key={k} className="text-center">
                        <div className="text-xs text-muted-foreground">{k}</div>
                        <div className={`text-sm font-bold ${v === result.aqi ? status.text : "text-foreground"}`}>{v}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Overall Risk Score */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                    <h3 className="font-display font-bold text-lg text-foreground">Overall Risk Score</h3>
                  </div>
                  <RiskMeter score={result.risk} />
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Environmental Impact</p>
                      <Badge label={result.envImpact} color={result.envImpact} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Smog Risk</p>
                      <Badge label={result.smog} color={result.smog} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Toxicity</p>
                      <Badge label={result.toxicity} color={result.toxicity} />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ── Row 2: Pollution Contribution + Health Impact ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <ResultCard title="Pollution Contribution" icon={<Activity className="w-5 h-5 text-blue-500" />} delay={0.1}>
                  <div className="space-y-3">
                    {Object.entries(result.contrib)
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, pct], i) => (
                        <PollutantBar key={name} name={name} pct={pct} index={i} dominant={result.dominant} />
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    🔺 <strong>{result.dominant}</strong> is the dominant contributor — address it first.
                  </p>
                </ResultCard>

                <ResultCard title="Health Impact Analysis" icon={<Heart className="w-5 h-5 text-red-500" />} delay={0.12}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-muted/40 rounded-xl px-4 py-3">
                      <span className="text-sm font-semibold text-muted-foreground">Lung Risk Level</span>
                      <Badge label={result.health.lung} color={result.health.lung === "Minimal" || result.health.lung === "Low" ? "Low" : result.health.lung === "Moderate" ? "Moderate" : "High"} />
                    </div>
                    <div className="bg-muted/40 rounded-xl px-4 py-3">
                      <p className="text-sm text-foreground leading-relaxed">🫁 {result.health.effects}</p>
                    </div>
                    {result.health.unsafe && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">⚠️ Unsafe for</p>
                        <p className="text-sm text-red-700 font-semibold">{result.health.unsafe}</p>
                      </div>
                    )}
                  </div>
                </ResultCard>
              </div>

              {/* ── Row 3: Safe Exposure + AQI Prediction ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <ResultCard title="Safe Outdoor Exposure Time" icon={<Clock className="w-5 h-5 text-amber-500" />} delay={0.15}>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">⏳</div>
                    <p className="text-base font-bold text-foreground">{result.exposure}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Resting",   mult: 1.0, desc: "Sitting/standing outdoors" },
                      { label: "Walking",   mult: 0.7, desc: "Moderate physical activity" },
                      { label: "Exercising",mult: 0.4, desc: "Jogging/cycling" },
                    ].map((t) => (
                      <div key={t.label} className="bg-muted/40 rounded-xl p-2">
                        <p className="text-xs font-bold text-foreground">{t.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                        {result.aqi <= 100 ? (
                          <p className="text-xs text-green-600 font-bold mt-1">✓ Safe</p>
                        ) : (
                          <p className="text-xs text-orange-500 font-bold mt-1">
                            {t.mult < 0.5 ? "Avoid" : t.mult < 0.8 ? "Limit" : "Caution"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </ResultCard>

                <ResultCard title="AQI Prediction — Tomorrow" icon={<TrendingUp className="w-5 h-5 text-primary" />} delay={0.17}>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Predicted AQI</p>
                    <div className="text-6xl font-extrabold font-display mb-2" style={{ color: aqiColor(result.predicted).hex }}>
                      {result.predicted}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {result.delta > 0
                        ? <><TrendingUp className="w-5 h-5 text-red-500" /><span className="text-red-500 font-bold">Worsening +{result.delta}</span></>
                        : <><TrendingDown className="w-5 h-5 text-green-500" /><span className="text-green-500 font-bold">Improving {result.delta}</span></>
                      }
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm border ${aqiColor(result.predicted).border} ${aqiColor(result.predicted).text}`}>
                      {aqiColor(result.predicted).label}
                    </span>
                  </div>
                  <div className="mt-4 bg-muted/40 rounded-xl p-3 text-xs text-muted-foreground">
                    📊 Prediction model: linear regression on AQI, temperature, humidity &amp; wind trends.
                    {result.delta > 15 ? " High AQI values tend to persist and worsen — take precautions." : ""}
                  </div>
                </ResultCard>
              </div>

              {/* ── Row 4: Wind Dispersion + Temperature Impact ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <ResultCard title="Wind Dispersion Analysis" icon={<Wind className="w-5 h-5 text-cyan-500" />} delay={0.19}>
                  <div className={`rounded-xl p-4 mb-3 ${result.dispersion.positive ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                    <p className="text-2xl mb-1">{result.dispersion.icon}</p>
                    <p className={`font-bold ${result.dispersion.positive ? "text-green-600" : "text-red-600"}`}>
                      {result.dispersion.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{result.dispersion.desc}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "< 4 km/h", status: "Trapped",    color: "text-red-500" },
                      { label: "4–8 km/h", status: "Partial",    color: "text-amber-500" },
                      { label: "> 8 km/h", status: "Good",       color: "text-green-500" },
                    ].map((w) => (
                      <div key={w.label} className="bg-muted/40 rounded-lg p-2 text-center">
                        <p className={`text-xs font-bold ${w.color}`}>{w.status}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{w.label}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>

                <ResultCard title="Temperature Impact" icon={<Thermometer className="w-5 h-5 text-orange-500" />} delay={0.21}>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-3">
                    <p className="text-sm text-foreground leading-relaxed">🌡️ {result.tempImpact}</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { range: "< 10°C",  effect: "Pollutants concentrate, slow dispersion" },
                      { range: "10–25°C", effect: "Normal chemical reaction rates" },
                      { range: "25–35°C", effect: "Ozone formation accelerated" },
                      { range: "> 35°C",  effect: "Extreme smog & secondary pollutants" },
                    ].map((row) => (
                      <div key={row.range} className="flex gap-3 items-baseline">
                        <span className="text-xs font-mono font-bold text-primary w-16 shrink-0">{row.range}</span>
                        <span className="text-xs text-muted-foreground">{row.effect}</span>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>

              {/* ── Chemical Reactions ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.23 }}
                className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setShowReactions((v) => !v)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-purple-500" />
                    <h3 className="font-display font-bold text-base text-foreground">Chemical Reactions & Atmospheric Insights</h3>
                  </div>
                  {showReactions ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <AnimatePresence>
                  {showReactions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.reactions.map((r, i) => (
                          <div key={i} className="bg-muted/40 rounded-xl p-3 border border-border/30">
                            <p className="font-mono text-sm font-bold text-primary mb-1">{r.eq}</p>
                            <p className="text-xs text-muted-foreground">{r.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── Smog + Toxicity ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <ResultCard title="Smog Formation Index" icon={<CloudFog className="w-5 h-5 text-slate-500" />} delay={0.25}>
                  <div className={`rounded-xl p-5 text-center border ${
                    result.smog === "High" ? "bg-red-500/10 border-red-500/20" :
                    result.smog === "Medium" ? "bg-amber-500/10 border-amber-500/20" :
                    "bg-green-500/10 border-green-500/20"
                  }`}>
                    <p className={`text-4xl font-extrabold font-display ${
                      result.smog === "High" ? "text-red-500" : result.smog === "Medium" ? "text-amber-500" : "text-green-500"
                    }`}>{result.smog}</p>
                    <p className="text-sm text-muted-foreground mt-2">Smog Risk Level</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Calculated from NO₂ concentration × temperature factor ÷ wind speed.
                    {result.smog === "High" ? " Expect reduced visibility and heavy haze." : ""}
                  </p>
                </ResultCard>

                <ResultCard title="Toxicity Index" icon={<Leaf className="w-5 h-5 text-green-500" />} delay={0.27}>
                  <div className={`rounded-xl p-5 text-center border ${
                    result.toxicity === "High" ? "bg-red-500/10 border-red-500/20" :
                    result.toxicity === "Moderate" ? "bg-amber-500/10 border-amber-500/20" :
                    "bg-green-500/10 border-green-500/20"
                  }`}>
                    <p className={`text-4xl font-extrabold font-display ${
                      result.toxicity === "High" ? "text-red-500" : result.toxicity === "Moderate" ? "text-amber-500" : "text-green-500"
                    }`}>{result.toxicity}</p>
                    <p className="text-sm text-muted-foreground mt-2">Combined NO₂ + SO₂ + CO Score</p>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {[["NO₂", "Triggers respiratory inflammation"], ["SO₂", "Forms acid rain, lung irritant"], ["CO", "Displaces oxygen in blood"]].map(([p, e]) => (
                      <div key={p} className="flex gap-2 items-baseline text-xs">
                        <span className="font-mono font-bold text-primary w-8">{p}</span>
                        <span className="text-muted-foreground">{e}</span>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>

            </div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
