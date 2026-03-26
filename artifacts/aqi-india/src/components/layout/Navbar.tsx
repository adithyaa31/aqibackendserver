import { Wind } from "lucide-react";
import { motion } from "framer-motion";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-primary flex items-center justify-center shadow-lg shadow-saffron/20 group-hover:shadow-saffron/40 transition-all duration-300">
            <Wind className="text-white w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
            AQI India <span className="text-2xl">🇮🇳</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", id: "hero" },
            { label: "Dashboard", id: "dashboard" },
            { label: "Calculator", id: "calculator" },
            { label: "Research", id: "features" },
            { label: "Team", id: "team" },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group py-2"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full opacity-0 group-hover:opacity-100"></span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo("dashboard")}
            className="hidden sm:block text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => scrollTo("map-section")}
            className="bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </button>
        </div>
      </div>
    </motion.header>
  );
}
