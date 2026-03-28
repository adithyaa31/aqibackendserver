import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, AlertTriangle, Leaf } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function CountUp({ target, duration = 1.5, trigger }: { target: number; duration?: number; trigger: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!trigger) return;
    const ctrl = animate(count, target, { duration, ease: "easeOut" });
    return ctrl.stop;
  }, [trigger, target, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function InfoCards() {
  const [triggered, setTriggered] = useState(false);

  const cards = [
    {
      title: "Most Polluted City",
      city: "Patna",
      aqi: 260,
      icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
      badge: "🔴 Poor",
      gradient: "from-red-500/10",
      borderHover: "hover:border-red-300",
      glowColor: "hover:shadow-red-200",
      barColor: "bg-red-500",
      barWidth: "87%",
      scrollId: "map-section",
    },
    {
      title: "Cleanest City",
      city: "Aizawl",
      aqi: 40,
      icon: <Leaf className="w-6 h-6 text-success" />,
      badge: "🟢 Good",
      gradient: "from-green-500/10",
      borderHover: "hover:border-green-300",
      glowColor: "hover:shadow-green-100",
      barColor: "bg-green-500",
      barWidth: "13%",
      scrollId: "map-section",
    },
    {
      title: "National Average",
      city: "144",
      aqi: 144,
      icon: <TrendingUp className="w-6 h-6 text-warning" />,
      badge: "📈 Moderate",
      gradient: "from-orange-500/10",
      borderHover: "hover:border-orange-300",
      glowColor: "hover:shadow-orange-100",
      barColor: "bg-orange-400",
      barWidth: "48%",
      scrollId: "features",
      isAvg: true,
    },
  ];

  return (
    <section id="dashboard" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.button
              key={index}
              onClick={() => {
                const el = document.getElementById(card.scrollId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              onViewportEnter={() => setTriggered(true)}
              transition={{ delay: index * 0.12, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-card rounded-2xl p-6 shadow-md border border-border ${card.borderHover} ${card.glowColor} hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-left w-full cursor-pointer`}
            >
              {/* Background gradient blob */}
              <motion.div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${card.gradient} to-transparent rounded-bl-full`}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.4 }}
              />

              {/* Header row */}
              <div className="flex items-start justify-between mb-5 relative z-10">
                <motion.div
                  className="p-3 bg-background rounded-xl border border-border/50 shadow-sm"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {card.icon}
                </motion.div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full text-foreground border border-border/50">
                  {card.badge}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-muted-foreground text-sm font-medium mb-1">{card.title}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-3xl font-display font-bold text-foreground">
                    {card.isAvg ? (
                      <CountUp target={card.aqi} trigger={triggered} />
                    ) : (
                      card.city
                    )}
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {card.isAvg ? "Moderate" : `AQI `}
                    {!card.isAvg && (
                      <span className="font-bold text-foreground">
                        <CountUp target={card.aqi} trigger={triggered} />
                      </span>
                    )}
                  </p>
                </div>

                {/* AQI progress bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${card.barColor}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: card.barWidth }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.15, ease: "easeOut" }}
                  />
                </div>

                <motion.p
                  className="text-xs text-primary font-semibold"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  View on map →
                </motion.p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
