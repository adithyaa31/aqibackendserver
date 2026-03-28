import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { AshokaBg } from "@/components/ui/AshokaBg";
import { ChatBot } from "@/components/ui/ChatBot";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import CalculatorPage from "@/pages/Calculator";
import Research from "@/pages/Research";
import Team from "@/pages/Team";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const [location] = useLocation();
  return (
    <Switch key={location}>
      <Route path="/">
        <PageWrapper><LandingPage /></PageWrapper>
      </Route>
      <Route path="/dashboard">
        <PageWrapper><Dashboard /></PageWrapper>
      </Route>
      <Route path="/calculator">
        <PageWrapper><CalculatorPage /></PageWrapper>
      </Route>
      <Route path="/research">
        <PageWrapper><Research /></PageWrapper>
      </Route>
      <Route path="/team">
        <PageWrapper><Team /></PageWrapper>
      </Route>
      <Route>
        <PageWrapper><NotFound /></PageWrapper>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global background layers — behind everything */}
        <AshokaBg />
        <ParticleBackground />

        {/* Fog overlay */}
        <div
          className="fog-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 80% 40% at 50% 60%, rgba(200,200,200,0.06) 0%, transparent 70%)",
          }}
        />

        {/* App content — above background */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AnimatedRoutes />
          </WouterRouter>
        </div>

        <ChatBot />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
