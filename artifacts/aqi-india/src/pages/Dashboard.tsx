import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Thermometer, Droplets, Wind, TrendingUp, TrendingDown, AlertCircle, ShieldCheck, AlertTriangle, Skull } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CITIES_DATA: Record<string, {
  aqi: number; status: string; color: string;
  temp: number; humidity: number; wind: number;
  pm25: number; pm10: number; no2: number; so2: number; co: number;
  prediction: number; trend: "up" | "down";
  trend7: { day: string; aqi: number }[];
}> = {
  Delhi: {
    aqi: 312, status: "Hazardous", color: "#ef4444",
    temp: 34, humidity: 58, wind: 2.1,
    pm25: 184, pm10: 245, no2: 72, so2: 38, co: 4.2,
    prediction: 328, trend: "up",
    trend7: [
      { day: "Mon", aqi: 265 }, { day: "Tue", aqi: 289 }, { day: "Wed", aqi: 302 },
      { day: "Thu", aqi: 291 }, { day: "Fri", aqi: 312 }, { day: "Sat", aqi: 320 }, { day: "Sun", aqi: 312 },
    ],
  },
  Mumbai: {
    aqi: 142, status: "Moderate", color: "#f97316",
    temp: 31, humidity: 74, wind: 4.5,
    pm25: 65, pm10: 112, no2: 41, so2: 18, co: 1.8,
    prediction: 135, trend: "down",
    trend7: [
      { day: "Mon", aqi: 158 }, { day: "Tue", aqi: 163 }, { day: "Wed", aqi: 149 },
      { day: "Thu", aqi: 145 }, { day: "Fri", aqi: 142 }, { day: "Sat", aqi: 138 }, { day: "Sun", aqi: 142 },
    ],
  },
  Bangalore: {
    aqi: 48, status: "Good", color: "#22c55e",
    temp: 26, humidity: 62, wind: 6.8,
    pm25: 12, pm10: 34, no2: 18, so2: 6, co: 0.6,
    prediction: 44, trend: "down",
    trend7: [
      { day: "Mon", aqi: 55 }, { day: "Tue", aqi: 52 }, { day: "Wed", aqi: 49 },
      { day: "Thu", aqi: 51 }, { day: "Fri", aqi: 48 }, { day: "Sat", aqi: 45 }, { day: "Sun", aqi: 48 },
    ],
  },
  Chennai: {
    aqi: 108, status: "Moderate", color: "#eab308",
    temp: 33, humidity: 80, wind: 5.2,
    pm25: 48, pm10: 88, no2: 32, so2: 14, co: 1.2,
    prediction: 112, trend: "up",
    trend7: [
      { day: "Mon", aqi: 95 }, { day: "Tue", aqi: 100 }, { day: "Wed", aqi: 104 },
      { day: "Thu", aqi: 108 }, { day: "Fri", aqi: 108 }, { day: "Sat", aqi: 110 }, { day: "Sun", aqi: 108 },
    ],
  },
  Kolkata: {
    aqi: 241, status: "Poor", color: "#dc2626",
    temp: 32, humidity: 76, wind: 2.8,
    pm25: 132, pm10: 198, no2: 58, so2: 29, co: 3.1,
    prediction: 252, trend: "up",
    trend7: [
      { day: "Mon", aqi: 210 }, { day: "Tue", aqi: 218 }, { day: "Wed", aqi: 225 },
      { day: "Thu", aqi: 233 }, { day: "Fri", aqi: 241 }, { day: "Sat", aqi: 248 }, { day: "Sun", aqi: 241 },
    ],
  },
};

function getStatusBg(status: string) {
  const map: Record<string, string> = {
    Good: "bg-green-100 text-green-700",
    Satisfactory: "bg-lime-100 text-lime-700",
    Moderate: "bg-orange-100 text-orange-700",
    Poor: "bg-red-100 text-red-700",
    Hazardous: "bg-red-200 text-red-800",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

function HealthAdvisory({ aqi }: { aqi: number }) {
  const levels = [
    { max: 50, label: "Safe to go outside", icon: <ShieldCheck className="w-5 h-5 text-green-500" />, bg: "bg-green-50 border-green-200 text-green-800" },
    { max: 100, label: "Safe for most people", icon: <ShieldCheck className="w-5 h-5 text-lime-500" />, bg: "bg-lime-50 border-lime-200 text-lime-800" },
    { max: 200, label: "Sensitive groups should be cautious", icon: <AlertTriangle className="w-5 h-5 text-orange-500" />, bg: "bg-orange-50 border-orange-200 text-orange-800" },
    { max: 300, label: "Wear a mask outdoors", icon: <AlertCircle className="w-5 h-5 text-red-500" />, bg: "bg-red-50 border-red-200 text-red-800" },
    { max: Infinity, label: "Stay indoors — Hazardous air", icon: <Skull className="w-5 h-5 text-red-700" />, bg: "bg-red-100 border-red-300 text-red-900" },
  ];
  const level = levels.find((l) => aqi <= l.max)!;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${level.bg}`}>
      {level.icon}
      <span className="font-semibold text-sm">{level.label}</span>
    </div>
  );
}

function PollutantBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value} µg/m³</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const city = CITIES_DATA[selectedCity];

  const pollutantBars = [
    { label: "PM 2.5", value: city.pm25, max: 250, color: "#ef4444" },
    { label: "PM 10", value: city.pm10, max: 350, color: "#f97316" },
    { label: "NO₂", value: city.no2, max: 100, color: "#eab308" },
    { label: "SO₂", value: city.so2, max: 60, color: "#8b5cf6" },
    { label: "CO", value: city.co, max: 6, color: "#6b7280" },
  ];

  const barData = [
    { name: "PM2.5", value: city.pm25 },
    { name: "PM10", value: city.pm10 },
    { name: "NO₂", value: city.no2 },
    { name: "SO₂", value: city.so2 },
  ];

  const chemReasons = city.aqi > 150
    ? [
        "High PM2.5 from vehicle exhaust and construction dust",
        "Ozone (O₃) forming from NO₂ + sunlight reaction",
        city.wind < 3 ? "Low wind speed causing pollutant trapping" : null,
        city.humidity > 70 ? "High humidity increasing PM2.5 concentration" : null,
      ].filter(Boolean)
    : ["Moderate pollution from traffic and urban activity"];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* City Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.keys(CITIES_DATA).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                selectedCity === c
                  ? "bg-foreground text-background border-foreground shadow-md"
                  : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              {c}
              <span
                className="ml-2 text-xs font-bold"
                style={{ color: selectedCity === c ? "inherit" : CITIES_DATA[c].color }}
              >
                {CITIES_DATA[c].aqi}
              </span>
            </button>
          ))}
        </div>

        {/* Hero AQI */}
        <motion.div
          key={selectedCity}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-border/50 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-display font-extrabold text-foreground">{selectedCity}</h1>
              <p className="text-muted-foreground mt-1">Air Quality Index — Live Reading</p>
              <div className="flex items-center gap-3 mt-4">
                <span
                  className="text-8xl font-extrabold font-display leading-none"
                  style={{ color: city.color }}
                >
                  {city.aqi}
                </span>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusBg(city.status)}`}>
                    {city.status}
                  </span>
                  <div className="mt-3">
                    <HealthAdvisory aqi={city.aqi} />
                  </div>
                </div>
              </div>
            </div>
            {/* Weather Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Thermometer className="w-5 h-5 text-orange-500" />, label: "Temperature", value: `${city.temp}°C` },
                { icon: <Droplets className="w-5 h-5 text-blue-500" />, label: "Humidity", value: `${city.humidity}%` },
                { icon: <Wind className="w-5 h-5 text-cyan-500" />, label: "Wind Speed", value: `${city.wind} km/h` },
              ].map((w) => (
                <div key={w.label} className="bg-muted/40 rounded-2xl p-4 text-center min-w-[90px]">
                  <div className="flex justify-center mb-2">{w.icon}</div>
                  <p className="text-xl font-bold text-foreground">{w.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{w.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* AQI Trend */}
            <motion.div
              key={`trend-${selectedCity}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-border/50"
            >
              <h2 className="font-display font-bold text-lg text-foreground mb-6">AQI Trend — Last 7 Days</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={city.trend7}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    stroke={city.color}
                    strokeWidth={3}
                    dot={{ r: 5, fill: city.color }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pollutant Bar Chart */}
            <motion.div
              key={`bar-${selectedCity}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-border/50"
            >
              <h2 className="font-display font-bold text-lg text-foreground mb-6">Pollutant Comparison (µg/m³)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="value" fill={city.color} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pollutant Bars */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
              <h2 className="font-display font-bold text-lg text-foreground mb-6">Pollutant Levels</h2>
              <div className="space-y-4">
                {pollutantBars.map((p) => (
                  <PollutantBar key={p.label} {...p} />
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* AI Prediction */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">🤖 AI Prediction</h2>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl font-extrabold font-display" style={{ color: city.color }}>
                  {city.prediction}
                </span>
                <div className="flex flex-col gap-1">
                  <span className={`flex items-center gap-1 text-sm font-semibold ${city.trend === "up" ? "text-red-500" : "text-green-500"}`}>
                    {city.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {city.trend === "up" ? "Increasing" : "Decreasing"}
                  </span>
                  <span className="text-xs text-muted-foreground">Tomorrow's AQI</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-3">
                Prediction based on linear regression model using temperature, humidity, and wind speed data.
              </p>
            </div>

            {/* Chemical Analysis */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">🧪 Why is AQI High?</h2>
              <ul className="space-y-2 mb-4">
                {chemReasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-orange-400 mt-0.5">•</span>
                    {r}
                  </li>
                ))}
              </ul>
              <div className="border-t border-border/50 pt-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Chemical Reactions</p>
                {[
                  "NO₂ + sunlight → O₃ (Ozone)",
                  "C + O₂ → CO₂ / CO (Combustion)",
                  "S + O₂ → SO₂ (Industrial)",
                ].map((r) => (
                  <div key={r} className="bg-muted/40 px-3 py-2 rounded-lg text-xs font-mono text-foreground">
                    {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Health Advisory Detail */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">🏥 Health Advisory</h2>
              <div className="space-y-2">
                {[
                  { range: "AQI < 50", label: "Safe", color: "text-green-600", bg: "bg-green-50" },
                  { range: "AQI 100+", label: "Sensitive caution", color: "text-yellow-600", bg: "bg-yellow-50" },
                  { range: "AQI 200+", label: "Wear mask", color: "text-orange-600", bg: "bg-orange-50" },
                  { range: "AQI 300+", label: "Stay indoors", color: "text-red-700", bg: "bg-red-50" },
                ].map((h) => (
                  <div
                    key={h.range}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl ${h.bg} ${
                      city.aqi >= parseInt(h.range.replace(/\D/g, "") || "0") ? "ring-2 ring-offset-1 ring-current opacity-100" : "opacity-60"
                    }`}
                  >
                    <span className={`text-xs font-bold ${h.color}`}>{h.range}</span>
                    <span className={`text-xs font-semibold ${h.color}`}>{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
