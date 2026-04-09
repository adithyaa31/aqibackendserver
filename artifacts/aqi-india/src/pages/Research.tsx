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
      className="bg-card rounded-3xl p-8 shadow-sm border border-border/50"
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
    "Smog Formation Index: combines NO2 level, temperature factor, and wind dispersion to estimate haze potential.",
    "Toxicity Index: combines NO2, SO2, and CO exposure burden to summarize gas-phase health stress.",
    "Overall Risk Score: integrates AQI severity, smog risk, toxicity burden, and low-wind penalty into a 0-100 scale.",
    "Pollution Contribution: converts pollutant sub-indices into percentages to identify the dominant pollutant quickly.",
    "Health Guidance Layer: maps risk bands into outdoor exposure advice for general and sensitive populations.",
    "Environmental Signal Layer: explains when pollutant trapping, smog build-up, and atmospheric stress are likely.",
    "Interpretation Output: presents transparent indicators so users can understand why the risk level changes.",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Research Paper</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-3 leading-tight">
            Air Quality Intelligence Methodology<br className="hidden md:block" /> for India: Data, Chemistry, and Risk Interpretation
          </h1>
          <p className="text-muted-foreground mt-4">
            Air Quality Intelligence System - India: academic methodology summary for research presentation and viva discussion
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-muted-foreground">
            <span className="bg-muted rounded-full px-3 py-1">CPCB AQI Method</span>
            <span className="bg-muted rounded-full px-3 py-1">Computational Chemistry</span>
            <span className="bg-muted rounded-full px-3 py-1">Risk Analytics</span>
            <span className="bg-muted rounded-full px-3 py-1">Air Quality</span>
            <span className="bg-muted rounded-full px-3 py-1">India</span>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Problem Statement */}
          <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Problem Statement" delay={0}>
            <p className="text-muted-foreground leading-relaxed">
              Air pollution is a major public-health and environmental challenge across India. Although AQI values are publicly available,
              raw numbers are often difficult for common users to interpret in practical terms. Many existing dashboards show only headline AQI,
              but do not clearly explain pollutant-wise contribution, health-focused recommendations, or the underlying scientific reasoning.
              This creates a gap between available data and actionable understanding for students, citizens, and decision-makers.
            </p>
          </Section>

          {/* Objective */}
          <Section icon={<Target className="w-5 h-5 text-saffron" />} title="Objective" delay={0.05}>
            <ul className="space-y-3">
              {[
                "Convert raw pollutant and weather observations into meaningful AQI insights that are easy to understand.",
                "Provide user-facing health guidance linked to risk level, pollutant intensity, and atmospheric conditions.",
                "Integrate data science indicators with computational chemistry explanations to improve interpretability.",
                "Support academic learning and practical awareness through transparent, explainable air quality analytics.",
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
                <h3 className="font-semibold text-foreground mb-2">Input Parameters</h3>
                <p className="text-muted-foreground text-sm">
                  The analysis uses pollutant concentrations and meteorological conditions: PM2.5, PM10, CO, NO2, SO2,
                  temperature, humidity, and wind speed. Together, these variables describe both emission burden and
                  atmospheric dispersion behavior.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Pollutant and Weather Roles</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Particulates", desc: "PM2.5 and PM10 represent inhalable particles linked to respiratory stress." },
                    { name: "Reactive Gases", desc: "NO2, SO2, and CO indicate combustion emissions and chemical risk." },
                    { name: "Meteorology", desc: "Temperature, humidity, and wind control reaction rate and pollutant dispersion." },
                  ].map((f) => (
                    <div key={f.name} className="bg-muted/40 rounded-xl p-3">
                      <p className="text-sm font-semibold text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">AQI Calculation Logic (CPCB Breakpoint Method)</h3>
                <p className="text-muted-foreground text-sm">
                  Each pollutant concentration is converted to its AQI sub-index using CPCB breakpoint interpolation.
                  The final AQI is the maximum among all pollutant sub-indices, and the pollutant producing this maximum
                  is treated as the dominant pollutant. The page also computes pollutant contribution percentages to indicate
                  which pollutant most strongly drives the overall pollution burden.
                </p>
              </div>
            </div>
          </Section>

          {/* Formula */}
          <Section icon={<TrendingUp className="w-5 h-5 text-purple-500" />} title="AQI Mathematical Model" delay={0.15}>
            <div className="bg-gradient-to-r from-primary/5 to-india-green/5 border border-primary/20 rounded-2xl p-6 text-center mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">CPCB Sub-Index Interpolation</p>
              <p className="font-mono text-2xl font-bold text-foreground">I = ((I_hi - I_lo)/(C_hi - C_lo)) * (C - C_lo) + I_lo</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                  { sym: "C", val: "Input", label: "Observed pollutant concentration" },
                  { sym: "C_lo/C_hi", val: "Range", label: "Breakpoint concentration bounds" },
                  { sym: "I_lo/I_hi", val: "Index", label: "AQI index bounds for that range" },
                  { sym: "Max", val: "Rule", label: "Final AQI is maximum of sub-indices" },
                ].map((c) => (
                  <div key={c.sym} className="bg-card rounded-xl p-3 text-center border border-border/50">
                    <span className="text-lg font-mono font-bold text-primary">{c.sym} = {c.val}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This equation computes the sub-index (I) for an individual pollutant. The final AQI is determined as the maximum of all pollutant sub-indices.
            </p>
            <p className="text-sm text-muted-foreground">
              This formula is applied pollutant-by-pollutant to compute sub-indices. The final AQI follows the CPCB principle:
              the highest sub-index determines overall AQI, and the corresponding pollutant is considered dominant.
            </p>
          </Section>

          {/* Algorithm Steps */}
          <Section icon={<GitBranch className="w-5 h-5 text-orange-500" />} title="Advanced Analysis" delay={0.2}>
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
          <Section icon={<FlaskConical className="w-5 h-5 text-purple-500" />} title="Computational Chemistry" delay={0.25}>
            <p className="text-muted-foreground text-sm mb-5">
              The system links AQI interpretation with real atmospheric chemistry so users can understand
              <em> why</em> pollution rises under certain environmental conditions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  reaction: "NO₂ + H₂O -> HNO₃/HNO₂",
                  title: "Acidic Reaction Pathway",
                  desc: "Nitrogen dioxide can react with atmospheric moisture to form acidic species associated with acid deposition.",
                  color: "border-yellow-300 bg-yellow-50",
                },
                {
                  reaction: "High T -> faster photochemistry",
                  title: "Temperature Effect",
                  desc: "High temperature accelerates atmospheric reaction rates and can intensify secondary pollutant formation.",
                  color: "border-gray-300 bg-gray-50",
                },
                {
                  reaction: "Low wind -> pollutant trapping",
                  title: "Dispersion Constraint",
                  desc: "Low wind conditions reduce dilution and keep pollutants near ground level, increasing local exposure risk.",
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
          <Section icon={<TrendingUp className="w-5 h-5 text-india-green" />} title="Health and Environmental Impact" delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Respiratory and Lung Stress", desc: "Elevated PM2.5/PM10 and toxic gases increase breathing difficulty, irritation, and long-term pulmonary risk." },
                { title: "Daily Life Decision Support", desc: "AQI-informed guidance helps users choose safer outdoor timing, mask use, and exposure limits." },
                { title: "Environmental Degradation", desc: "Pollution contributes to haze, acid deposition, and ecosystem stress that affect urban and regional environments." },
                { title: "Educational Transparency", desc: "Interpretable indicators make complex air-quality science understandable for classrooms and public awareness." },
              ].map((s) => (
                <div key={s.title} className="bg-muted/40 rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-muted/40 rounded-2xl p-4 border border-border/50">
              <h3 className="font-semibold text-foreground mb-1">Note for Academic Evaluation</h3>
              <p className="text-sm text-muted-foreground">
                AQI computation follows the standard CPCB breakpoint interpolation framework. Forecast-style values shown in the application
                are generated using simple approximation logic and should be treated as educational indicators rather than a full production-grade
                machine learning forecast. The system is designed for educational and analytical use with explainable scientific interpretation.
              </p>
            </div>
          </Section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
