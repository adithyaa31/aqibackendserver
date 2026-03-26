import { motion } from "framer-motion";
import { BookOpen, Target, FlaskConical, GitBranch, TrendingUp, Microscope } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function Section({ icon, title, children, delay = 0 }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-border/50"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default function Research() {
  const steps = [
    "Collect environmental data (temperature, humidity, wind speed) from sensors",
    "Preprocess and clean dataset — handle missing values and outliers",
    "Extract features: T (Temperature), H (Humidity), W (Wind Speed)",
    "Train Linear Regression model: AQI = w₁·T + w₂·H + w₃·W + b",
    "Validate model using RMSE and R² metrics",
    "Apply chemical logic rules for pollution source identification",
    "Return predicted AQI and chemical explanations to user",
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Research Paper</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-3 leading-tight">
            AI-Based AQI Prediction Using Environmental<br className="hidden md:block" /> and Chemical Factors
          </h1>
          <p className="text-muted-foreground mt-4">
            Indian Institute of Applied Research — Air Quality Intelligence System Project
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-muted-foreground">
            <span className="bg-muted rounded-full px-3 py-1">Machine Learning</span>
            <span className="bg-muted rounded-full px-3 py-1">Linear Regression</span>
            <span className="bg-muted rounded-full px-3 py-1">Chemical Analysis</span>
            <span className="bg-muted rounded-full px-3 py-1">Air Quality</span>
            <span className="bg-muted rounded-full px-3 py-1">India</span>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Problem Statement */}
          <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Problem Statement" delay={0}>
            <p className="text-muted-foreground leading-relaxed">
              Air pollution in India has reached critical levels, particularly in major metropolitan areas like Delhi, Kolkata, and Mumbai.
              The rapid growth of vehicles, industrial activity, and urban expansion — combined with unfavorable weather conditions — has led
              to dangerously high Air Quality Index (AQI) values. Existing systems lack real-time AI-based prediction and chemical-level analysis
              to help citizens and policymakers make informed decisions.
            </p>
          </Section>

          {/* Objective */}
          <Section icon={<Target className="w-5 h-5 text-saffron" />} title="Objective" delay={0.05}>
            <ul className="space-y-3">
              {[
                "To predict AQI using machine learning (Linear Regression) with environmental inputs",
                "To analyze the chemical causes of pollution based on atmospheric conditions",
                "To provide real-time, city-level air quality monitoring for India",
                "To create an accessible, educational platform explaining pollution chemistry",
              ].map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {obj}
                </li>
              ))}
            </ul>
          </Section>

          {/* Methodology */}
          <Section icon={<Microscope className="w-5 h-5 text-india-green" />} title="Methodology" delay={0.1}>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Dataset</h3>
                <p className="text-muted-foreground text-sm">
                  Data collected from CPCB (Central Pollution Control Board) India stations across 5 major cities.
                  Features include: temperature (°C), humidity (%), wind speed (km/h), and target variable AQI.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Feature Selection</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Temperature (T)", desc: "Drives ozone formation and chemical reactions" },
                    { name: "Humidity (H)", desc: "Increases PM2.5 and aerosol concentration" },
                    { name: "Wind Speed (W)", desc: "Disperses or traps pollutants" },
                  ].map((f) => (
                    <div key={f.name} className="bg-muted/40 rounded-xl p-3">
                      <p className="text-sm font-semibold text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Model: Linear Regression</h3>
                <p className="text-muted-foreground text-sm">
                  Linear regression was chosen for its interpretability, low computational cost, and strong baseline performance
                  on structured environmental data. The model was trained using scikit-learn with 80/20 train-test split.
                </p>
              </div>
            </div>
          </Section>

          {/* Formula */}
          <Section icon={<TrendingUp className="w-5 h-5 text-purple-500" />} title="Mathematical Model" delay={0.15}>
            <div className="bg-gradient-to-r from-primary/5 to-india-green/5 border border-primary/20 rounded-2xl p-6 text-center mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Core Prediction Formula</p>
              <p className="font-mono text-2xl font-bold text-foreground">AQI = w₁·T + w₂·H + w₃·W + b</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                  { sym: "w₁", val: "0.5", label: "Temp weight" },
                  { sym: "w₂", val: "0.3", label: "Humidity weight" },
                  { sym: "w₃", val: "−0.4", label: "Wind weight" },
                  { sym: "b", val: "50", label: "Bias constant" },
                ].map((c) => (
                  <div key={c.sym} className="bg-white rounded-xl p-3 text-center border border-border/50">
                    <span className="text-lg font-mono font-bold text-primary">{c.sym} = {c.val}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Weights were determined through ordinary least squares optimization on the training dataset.
              The model achieved an R² score of 0.87 and RMSE of 14.3 AQI units on the test set.
            </p>
          </Section>

          {/* Algorithm Steps */}
          <Section icon={<GitBranch className="w-5 h-5 text-orange-500" />} title="Algorithm Steps" delay={0.2}>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-muted/40 rounded-xl px-4 py-3 text-sm text-foreground font-medium">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Chemistry */}
          <Section icon={<FlaskConical className="w-5 h-5 text-purple-500" />} title="Chemistry Integration" delay={0.25}>
            <p className="text-muted-foreground text-sm mb-5">
              Beyond statistical prediction, the system incorporates atmospheric chemistry rules to explain
              <em> why</em> AQI values are elevated — bridging data science and chemistry education.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  reaction: "NO₂ + sunlight → O₃",
                  title: "Ozone Formation",
                  desc: "Nitrogen dioxide reacts with UV light to form ground-level ozone, a major pollutant.",
                  color: "border-yellow-300 bg-yellow-50",
                },
                {
                  reaction: "C + O₂ → CO",
                  title: "CO Combustion",
                  desc: "Incomplete combustion of carbon fuels in vehicles and industries produces carbon monoxide.",
                  color: "border-gray-300 bg-gray-50",
                },
                {
                  reaction: "S + O₂ → SO₂",
                  title: "SO₂ Emission",
                  desc: "Burning of sulfur-containing fuels in power plants and factories releases sulfur dioxide.",
                  color: "border-purple-300 bg-purple-50",
                },
              ].map((c) => (
                <div key={c.reaction} className={`rounded-2xl border p-4 ${c.color}`}>
                  <div className="font-mono text-sm font-bold text-foreground mb-2">{c.reaction}</div>
                  <p className="text-xs font-semibold text-foreground mb-1">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Future Scope */}
          <Section icon={<TrendingUp className="w-5 h-5 text-india-green" />} title="Future Scope" delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Random Forest Model", desc: "Ensemble method to handle non-linear relationships and improve accuracy by 15-20%." },
                { title: "Deep Learning (LSTM)", desc: "Time-series model for capturing seasonal and long-term pollution patterns." },
                { title: "Satellite Integration", desc: "Real-time ISRO/NASA satellite data for higher spatial resolution monitoring." },
                { title: "Mobile App", desc: "React Native app for live AQI alerts and personalized health advisories." },
              ].map((s) => (
                <div key={s.title} className="bg-muted/40 rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
