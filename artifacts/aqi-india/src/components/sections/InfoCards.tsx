import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Leaf } from "lucide-react";

export function InfoCards() {
  const cards = [
    {
      title: "Most Polluted City",
      value: "Delhi",
      subValue: "AQI 312",
      icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
      badge: "🔴 Hazardous",
      gradient: "from-destructive/10 to-transparent",
      borderColor: "border-destructive/20"
    },
    {
      title: "Cleanest City",
      value: "Bangalore",
      subValue: "AQI 48",
      icon: <Leaf className="w-6 h-6 text-success" />,
      badge: "🟢 Good",
      gradient: "from-success/10 to-transparent",
      borderColor: "border-success/20"
    },
    {
      title: "National Average",
      value: "167",
      subValue: "Moderate",
      icon: <TrendingUp className="w-6 h-6 text-warning" />,
      badge: "📈 Trending Up",
      gradient: "from-warning/10 to-transparent",
      borderColor: "border-warning/20"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border ${card.borderColor} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.gradient} rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                  {card.icon}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full text-foreground border border-border/50">
                  {card.badge}
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-muted-foreground text-sm font-medium mb-1">{card.title}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-bold text-foreground">{card.value}</p>
                  <p className="text-sm font-semibold text-muted-foreground">{card.subValue}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
