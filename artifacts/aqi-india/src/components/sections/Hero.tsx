import { ArrowRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-tricolor-gradient">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none mix-blend-multiply">
        <img
          src={`${import.meta.env.BASE_URL}images/india-map-abstract.png`}
          alt="India Map Texture"
          className="w-[800px] h-[800px] object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border/60 shadow-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live System Active</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6"
          >
            Air Quality Intelligence <br className="hidden md:block" />
            System – <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-primary to-india-green">India</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
          >
            Real-time Monitoring • AI Prediction • Chemical Analysis
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollTo("map-section")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-foreground text-background hover:bg-primary shadow-xl shadow-foreground/10 hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Explore Map
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white border-2 border-border text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              <Activity className="w-5 h-5 text-muted-foreground" />
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
