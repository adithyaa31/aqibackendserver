import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Info, Wind, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Define the cities data
const CITIES = [
  {
    id: "delhi",
    name: "New Delhi",
    aqi: 312,
    status: "Hazardous",
    color: "text-destructive",
    bgColor: "bg-destructive",
    ringColor: "bg-destructive/30",
    top: "32%",
    left: "35%",
    pm25: 184,
    pm10: 245,
    o3: 42,
    prediction: "Worsening in next 24h"
  },
  {
    id: "mumbai",
    name: "Mumbai",
    aqi: 142,
    status: "Moderate",
    color: "text-warning",
    bgColor: "bg-warning",
    ringColor: "bg-warning/30",
    top: "62%",
    left: "22%",
    pm25: 65,
    pm10: 112,
    o3: 28,
    prediction: "Stable"
  },
  {
    id: "bangalore",
    name: "Bangalore",
    aqi: 48,
    status: "Good",
    color: "text-success",
    bgColor: "bg-success",
    ringColor: "bg-success/30",
    top: "78%",
    left: "32%",
    pm25: 12,
    pm10: 34,
    o3: 15,
    prediction: "Improving"
  }
];

export function MapSection() {
  const [selectedCity, setSelectedCity] = useState<typeof CITIES[0] | null>(null);

  return (
    <section id="map-section" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
          >
            Real-time AQI Map
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Live monitoring across major Indian metropolitan areas powered by continuous sensor data.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto relative bg-map-pattern rounded-3xl border border-border/50 shadow-2xl shadow-black/5 overflow-hidden p-8 aspect-square md:aspect-[4/3] bg-white">
          
          {/* Faded Background SVG of India for spatial context */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
             <svg viewBox="0 0 500 550" className="w-[80%] h-[80%] fill-foreground" xmlns="http://www.w3.org/2000/svg">
              <path d="M192.5 18.2c-5.8 4.3-10.2 11.2-12.8 19.3-3.1 9.4-2 15.6 4.9 28.5 7.4 13.9 8.2 16.5 6 18.9-3.4 3.7-14 3.7-17.6 0-3.5-3.5-3.3-3.6 1.3-1.1 12.3 6.9 14.5 15.6 4.4 16.9-3.7.5-6.5-1.5-6.9-4.8-.5-3.5 1-4.7 4.9-3.6 6.3 1.8 11.1-2.9 8-8.2-1.9-3.3-2.1-4.7-1-7.2 2-4.5 2.1-13.6.1-13.6-1.5 0-7.3 10.9-10.2 19.2-2.1 6-4.6 9-6.3 7.8-5-3.7-4.3 6.4 1 12.6 3 3.6 5.3 7 5.1 7.6-.4 1-5.1-1.3-12.5-6-10.8-7-14.1-8-19.1-5.8-5.6 2.5-6.6 2-10-5.1-3.6-7.5-7.5-7.6-13.6-.4-4.8 5.7-7 6.3-9.5 2.3-2.6-4.2-3.7-3.9-3.7 1.3 0 5 .8 10 1.8 11.2 1.4 1.7-1.1 7.9-6.5 16.1l-8.6 13.1-6.1-2.3c-7-2.6-11-2.4-12 1-.6 2 2.6 5.5 7 7.7 5.5 2.8 8 5.4 8 8.1 0 5-6.5 7.4-13.6 5.1-6-1.9-7-1.8-6.1.6 1.1 3 8 7 13.1 7.6 3.6.5 10.5 4.3 15.3 8.5 4.8 4.2 9.4 8.7 10.1 9.9.8 1.2.9 6 .4 10.6-1 10.6-2.1 13-11.7 24.1-12.2 14-16.7 22.8-19.1 37.3-1.6 9.8-3.4 13.1-9.3 17.5-8.5 6.4-13.9 16.2-14.7 26.6-.7 8.3 1 12.6 7 16.2 3.6 2.2 6.5 5.5 6.5 7.4 0 2.2-2.3 3-6.5 2.1-4-.8-8.2-.5-9.4.8-1.5 1.5-2.2 4.4-1.9 8.1.3 4.1.2 5.5-.6 3.9-.7-1.4-2.8-.5-5 2.2-5.5 6.7-5.9 14.8-.8 16 3 .7 3 2.1 0 7.7-1.9 3.6-4 12.5-4.7 20-.7 9.8-1.5 13.5-3.3 15.4-2.5 2.6-2.8 5-1.5 11 1 4.5.3 9.4-1.6 11-1.9 1.5-3.5 4.2-3.5 5.9 0 2 1.4 2.8 3.9 2.2 5.3-1.3 6.6 6.8 2.2 13.4-3.3 5-3.3 5 0 0 2.2-3.3 6-5.1 10.3-4.9 3.7.1 8 1.4 9.5 2.9 1.9 1.8 2.1 1.5.8-.8-1.8-3.4-.6-5.8 4.6-9.1 3.5-2.2 8.7-3.4 11.5-2.7 2.8.7 6.2 2.6 7.4 4.2 1.3 1.5 3 2.4 3.9 2 1-.3 1.8 1 1.8 3 0 2.3 2 5.6 5 8.1 4.1 3.4 5.2 5.4 5 9.5-.2 2.6-.9 6-1.5 7.5-1 2.3-.6 3.5 1.2 3.5 1.6 0 3.2-1.3 3.5-2.8.3-1.6 2.3-.9 4.3 1.5 2.7 3.3 4 3.6 5.5 1.3 1.1-1.7 4.6-2 11.6-1.1 5.6.8 11.2 1.3 12.6 1.3 1.3 0 2.9 1.8 3.5 4.1.6 2.3 2 5.3 3.2 6.7 1.4 1.7 2.1 4 1.9 6-.3 2.8-.1 3.2 2.1 3.5 3 .5 6.5 4.5 10 11.6 2.7 5.5 5.6 10 6.6 10 1 0 3.6 3.6 5.8 8 2.2 4.4 5 8 6.3 8 1.2 0 4.1 2.9 6.4 6.5 2.2 3.6 4.6 6.5 5.1 6.5.6 0 1.1-1.8 1.1-4s2.3-4.5 5.5-5.5c4-1.3 5.4-2.8 4.2-4.5-1.1-1.5-1.1-1.6.3-1 2.5.9 3.6-2.5 1.6-4.9-1.3-1.6-1.3-2 0-2 .9 0 2.5 1.4 3.5 3 2.6 4 6 5.6 10 4.7 5.7-1.3 5.9-1.5 11.5-13.6 4.7-10.1 6.2-12.7 8.3-14.6 2.7-2.3 2.9-2.9 1.5-5.4-1.4-2.4-1.3-2.9.5-3.3 1.6-.3 2.9-1.7 3.2-3.3.4-2.1.2-2.3-1.8-1.5-1.6.6-4-1-6.1-4-2.5-3.5-3.3-3.8-5.3-2-1.4 1.3-3.6 2.3-4.8 2.3-1.3 0-3.3-1.1-4.5-2.5-1.2-1.4-3.5-2.5-5.1-2.5-1.6 0-3.7-1.3-4.8-2.9-1.4-1.9-2.5-2-4.5-.6-1.5 1-3.6.5-4.6-1-1-1.6-3.8-3.1-6.1-3.4-3.3-.4-4.2-1.2-4.2-3.4 0-1.8-1-4.4-2.3-5.8-1.7-1.7-2.3-3.9-2.3-7.5 0-4.6-.4-6-1.9-6-1.2 0-3.3-2-4.7-4.4-1.5-2.5-3.8-4.5-5.3-4.5-1.5 0-3.1-1.5-3.8-3.5-.8-2.6-3.3-6.6-6.6-10.5-5-6.1-6.1-8.1-6.1-11.5 0-4.1-1.8-9-5.1-13.7-2.5-3.5-4.5-7.3-4.5-8.3 0-1 1-1.8 2.3-1.8 1.2 0 3-1.4 3.8-3.1.9-1.8 3.5-4.8 5.7-6.5 2.3-1.8 4.2-4.1 4.2-5 0-1 1.4-1.8 3.2-1.8 1.8 0 4.1-2.5 5.2-5.5 1.1-3 3-5.5 4.3-5.5 1.3 0 2.7-1.5 3-3.3.4-1.9 1.6-4 2.8-4.7 1.1-.6 2.4-2.5 2.8-4 .4-1.6 1.8-3 3.1-3 1.3 0 2.8-1.5 3.3-3.3.5-1.9 1.8-4 3-4.7 1.2-.6 2.5-2.5 3-4.1.4-1.7 1.8-3.1 3-3.1 1.3 0 2.8-1.5 3.3-3.3.5-1.9 1.8-4 3-4.7 1.2-.6 2.5-2.5 3-4.1.4-1.7 1.8-3.1 3-3.1 1.3 0 2.8-1.5 3.3-3.3.5-1.9 1.8-4 3-4.7 1.2-.6 2.5-2.5 3-4.1.5-1.7 2-3.1 3.2-3.1s3-1.4 3.9-3.2c1.1-2.2 2.6-3.2 4.4-3 2 .3 4.2-.7 5.5-2.3 2.1-2.7 6.8-5.3 12.5-6.8 6.6-1.8 10-4.2 9.8-7-.1-1.8.8-3.8 2-4.5 1.3-.8 2-2.6 1.7-4.1-.3-1.6.4-3.3 1.7-4 1.3-.6 2.4-2.1 2.4-3.3 0-1.2.9-2.3 2-2.3 1.1 0 2.2-.9 2.4-2 .2-1.1 1.2-2 2.3-2 1.1 0 3-1.4 4.3-3.1 1.3-1.8 3.5-3.3 5-3.3 1.5 0 2.7-.9 2.7-2 0-1.1 1.2-2.2 2.7-2.4 1.5-.2 2.7-1.1 2.7-2 0-.9 1.2-1.9 2.7-2.3 1.5-.4 2.7-1.4 2.7-2.3 0-.9 1.2-2.1 2.7-2.7 1.5-.6 2.7-1.9 2.7-3 0-1.1 1.2-2.3 2.7-2.8 1.5-.5 2.7-1.8 2.7-3 0-1.2 1-2.2 2.3-2.2 1.3 0 2.3-1 2.3-2.3 0-1.3.9-2.3 2-2.3 1.1 0 2-.9 2-2 0-1.1.9-2 2-2s2-.9 2-2c0-1.1.9-2 2-2 1.1 0 2.2-.9 2.4-2 .2-1.1 1.2-2 2.3-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2 0-1.1.9-2 2-2 1.1 0 2-.9 2-2z"/>
            </svg>
          </div>

          {/* Interactive Markers */}
          {CITIES.map((city, index) => (
            <motion.div
              key={city.id}
              className="absolute group z-10"
              style={{ top: city.top, left: city.left }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.2, type: "spring" }}
            >
              {/* Pulsing ring for hazardous cities */}
              {city.status === "Hazardous" && (
                <div className={`absolute inset-0 rounded-full ${city.ringColor} blur-sm animate-pulse-ring -z-10`} style={{ margin: '-10px' }} />
              )}
              
              <button 
                onClick={() => setSelectedCity(city)}
                className="relative cursor-pointer hover:scale-125 transition-transform duration-300 transform -translate-x-1/2 -translate-y-full"
              >
                <MapPin className={`w-8 h-8 ${city.color} drop-shadow-md`} fill="currentColor" />
                <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white leading-none">
                  {city.aqi > 200 ? '!' : ''}
                </span>
              </button>

              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-40 z-50">
                <div className="bg-foreground text-background p-3 rounded-xl shadow-xl border border-border/10">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold">{city.name}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-sm ${city.bgColor} text-white`}>
                      {city.aqi}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{city.status}</p>
                  <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Click for details
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* City Details Dialog */}
      <Dialog open={!!selectedCity} onOpenChange={(open) => !open && setSelectedCity(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedCity && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-2xl ${selectedCity.bgColor} flex items-center justify-center text-white font-display font-bold text-xl shadow-lg`}>
                    {selectedCity.aqi}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedCity.name}</DialogTitle>
                    <DialogDescription className={`font-semibold ${selectedCity.color}`}>
                      {selectedCity.status}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">PM 2.5</p>
                    <p className="text-lg font-bold text-foreground">{selectedCity.pm25} <span className="text-xs font-normal">µg/m³</span></p>
                  </div>
                  <div className="bg-muted p-4 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">PM 10</p>
                    <p className="text-lg font-bold text-foreground">{selectedCity.pm10} <span className="text-xs font-normal">µg/m³</span></p>
                  </div>
                  <div className="bg-muted p-4 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Ozone (O3)</p>
                    <p className="text-lg font-bold text-foreground">{selectedCity.o3} <span className="text-xs font-normal">ppb</span></p>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3">
                  <Wind className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">AI Prediction</h4>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCity.prediction} based on current weather patterns and historical data.</p>
                  </div>
                </div>

                {selectedCity.status === "Hazardous" && (
                   <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex gap-3">
                   <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                   <div>
                     <h4 className="text-sm font-semibold text-destructive">Health Advisory</h4>
                     <p className="text-sm text-destructive/80 mt-1">Everyone should avoid all outdoor exertion. Stay indoors and keep activity levels low.</p>
                   </div>
                 </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
