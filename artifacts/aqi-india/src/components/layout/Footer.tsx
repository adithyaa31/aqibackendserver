import { Wind } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 border-t border-border/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Wind className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight">
            AQI India <span className="text-2xl">🇮🇳</span>
          </span>
        </div>
        
        <p className="text-sm text-background/60 text-center md:text-left font-medium">
          Powered by AI & Real-time Data | Made for a Cleaner India
        </p>

        <div className="flex items-center gap-4 text-sm text-background/60">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">API</a>
        </div>
      </div>
    </footer>
  );
}
