import { motion } from "framer-motion";
import { Satellite, BrainCircuit, FlaskConical, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    title: "Real-time Monitoring",
    description: "Live data aggregation from ground sensors and ISRO satellite feeds ensuring 99.9% accuracy across all major Indian cities.",
    icon: <Satellite className="w-8 h-8" />,
    iconColor: "text-primary",
    iconBg: "bg-blue-100/30 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    glowColor: "hover:shadow-blue-100",
    href: "/dashboard",
    tag: "Live",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "AI Prediction Model",
    description: "Proprietary linear regression model forecasts AQI levels up to 48 hours in advance based on temperature, humidity, and wind patterns.",
    icon: <BrainCircuit className="w-8 h-8" />,
    iconColor: "text-saffron",
    iconBg: "bg-orange-50 border-orange-200",
    glowColor: "hover:shadow-orange-100",
    href: "/calculator",
    tag: "AI",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    title: "Chemical Analysis",
    description: "Detailed breakdown of PM2.5, PM10, NO₂, SO₂ with atmospheric chemistry reactions to identify pollution sources instantly.",
    icon: <FlaskConical className="w-8 h-8" />,
    iconColor: "text-india-green",
    iconBg: "bg-green-50 border-green-200",
    glowColor: "hover:shadow-green-100",
    href: "/research",
    tag: "Research",
    tagColor: "bg-green-100 text-green-700",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4"
          >
            Core Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
          >
            Powered by Advanced Technology
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Our system combines satellite imagery with on-ground sensors to deliver India's most accurate air quality intelligence.
          </motion.p>
          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="h-1 w-20 bg-gradient-to-r from-saffron to-india-green rounded-full mx-auto mt-5 origin-left"
          />
        </div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group bg-card rounded-3xl p-8 border border-border/60 shadow-sm hover:shadow-xl ${feature.glowColor} transition-all duration-300 flex flex-col`}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className={`w-16 h-16 rounded-2xl border ${feature.iconBg} flex items-center justify-center shadow-sm`}
                >
                  <span className={feature.iconColor}>{feature.icon}</span>
                </motion.div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${feature.tagColor}`}>
                  {feature.tag}
                </span>
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm flex-1">{feature.description}</p>

              {/* CTA link */}
              <Link href={feature.href}>
                <motion.div
                  className="mt-6 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  whileHover={{ x: 4 }}
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
