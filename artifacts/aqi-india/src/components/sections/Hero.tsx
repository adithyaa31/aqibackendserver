import { ArrowRight, Activity, Wind, MapPin, Brain } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "wouter";

function CountUp({ target, duration = 1.8, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    const ctrl = animate(count, target, { duration, ease: "easeOut" });
    return ctrl.stop;
  }, [target, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden bg-tricolor-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Live badge */}
          <motion.div variants={item} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border/60 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live System Active</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]"
          >
            Air Quality Intelligence
            <br className="hidden md:block" />
            System –{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-primary to-india-green inline-block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% auto" }}
            >
              India 🇮🇳
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
          >
            Real-time Monitoring • AI Prediction • Chemical Analysis
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <motion.button
              onClick={() => scrollTo("map-section")}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-foreground text-background shadow-xl shadow-foreground/10 hover:bg-primary hover:shadow-primary/30 transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              Explore Map
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>

            <motion.button
              onClick={() => scrollTo("features")}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white border-2 border-border text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5 text-muted-foreground" />
              Learn More
            </motion.button>
          </motion.div>

          {/* Live stats bar */}
          <motion.div
            variants={item}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
          >
            {[
              { icon: <MapPin className="w-4 h-4 text-saffron" />, value: 50, suffix: "+", label: "Cities Monitored" },
              { icon: <Wind className="w-4 h-4 text-primary" />, value: 94, suffix: "%", label: "AI Accuracy" },
              { icon: <Brain className="w-4 h-4 text-india-green" />, value: 1200, suffix: "K+", label: "Daily Data Points" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.06 }}
                className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 text-center shadow-sm cursor-default"
              >
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className="text-xl font-extrabold font-display text-foreground">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
