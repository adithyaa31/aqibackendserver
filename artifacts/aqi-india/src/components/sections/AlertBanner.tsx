import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function AlertBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full bg-orange-50 border-b border-orange-200 py-3 px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 animate-pulse"></div>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 relative z-10">
        <div className="relative flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-orange-600 relative z-10" />
          <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-md animate-pulse-ring"></div>
        </div>
        <p className="text-sm font-medium text-orange-800 text-center">
          <span className="font-bold">⚠️ Hazardous AQI detected in Delhi</span> — Wear masks, avoid outdoor activities.
        </p>
      </div>
    </motion.div>
  );
}
