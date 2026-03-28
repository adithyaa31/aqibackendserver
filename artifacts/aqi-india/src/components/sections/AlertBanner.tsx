import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const ALERTS = [
  "🔴 Poor AQI 260 in Patna — Avoid outdoor activity, wear masks",
  "🔴 Poor AQI 250 in Delhi — Limit outdoor exertion, stay indoors",
  "🔴 Poor AQI 220 in Jaipur — Sensitive groups should stay indoors",
  "🟠 Moderate AQI 190 in Kolkata — Keep windows closed",
  "🟠 Moderate AQI 180 in Mumbai — Limit prolonged outdoor activity",
  "🟠 Moderate AQI 165 in Chennai — Sensitive groups take caution",
  "🟠 Moderate AQI 160 in Hyderabad — Monitor air quality",
  "🟡 Satisfactory AQI 100 in Bangalore — Air quality is acceptable",
  "🟢 Good AQI 40 in Aizawl — Air quality is excellent",
];

const ticker = [...ALERTS, ...ALERTS];

export function AlertBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="w-full bg-orange-50 border-b border-orange-200 py-2.5 overflow-hidden relative"
    >
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-orange-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-orange-50 to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-4 pl-4">
        <div className="shrink-0 flex items-center gap-1.5 text-orange-700 z-20 pr-3 border-r border-orange-300">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">Live Alerts</span>
        </div>

        <div className="overflow-hidden flex-1">
          <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {ticker.map((alert, i) => (
              <span key={i} className="text-sm font-medium text-orange-800 shrink-0">
                {alert}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
