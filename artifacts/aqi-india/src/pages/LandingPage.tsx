import { Navbar } from "@/components/layout/Navbar";
import { AlertBanner } from "@/components/sections/AlertBanner";
import { Hero } from "@/components/sections/Hero";
import { MapSection } from "@/components/sections/MapSection";
import { InfoCards } from "@/components/sections/InfoCards";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col w-full overflow-x-hidden selection:bg-primary/20">
      <Navbar />
      <div className="pt-20"> {/* Offset for fixed navbar */}
        <AlertBanner />
        <Hero />
        <InfoCards />
        <MapSection />
        <Features />
      </div>
      <Footer />
    </main>
  );
}
