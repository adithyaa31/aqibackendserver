import { motion } from "framer-motion";
import { Satellite, BrainCircuit, FlaskConical } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Real-time Monitoring",
      description: "Live data aggregation from thousands of ground sensors and ISRO satellite feeds ensuring 99.9% accuracy.",
      icon: <Satellite className="w-8 h-8 text-primary" />,
    },
    {
      title: "AI Prediction Model",
      description: "Proprietary machine learning algorithms forecast AQI levels up to 48 hours in advance based on weather patterns.",
      icon: <BrainCircuit className="w-8 h-8 text-saffron" />,
    },
    {
      title: "Chemical Analysis",
      description: "Detailed breakdown of pollutants including PM2.5, PM10, NO2, and SO2 to identify pollution sources instantly.",
      icon: <FlaskConical className="w-8 h-8 text-india-green" />,
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
          >
            Powered by Advanced Technology
          </motion.h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our system combines satellite imagery with on-ground sensors to deliver the most accurate air quality data in India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-muted/30 transition-colors duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-border shadow-md flex items-center justify-center mb-6 hover:rotate-6 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
