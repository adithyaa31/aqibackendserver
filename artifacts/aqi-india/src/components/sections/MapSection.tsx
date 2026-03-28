import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Wind, AlertCircle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { CITIES_DATA, CITY_NAMES } from "@/lib/cityData";

type CityEntry = {
  name: string;
  aqi: number; status: string; color: string; pulse: boolean;
  lat: number; lng: number;
  pm25: number; pm10: number; no2: number; so2: number;
  wind: number; temp: number; humidity: number;
  prediction: number; trend: "up" | "down";
};

const CITIES: CityEntry[] = CITY_NAMES.map((name) => ({
  name,
  ...CITIES_DATA[name],
}));

function createCityIcon(color: string, aqi: number, pulse: boolean) {
  const size = 40;
  const pulseRing = pulse
    ? `<div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:${size + 16}px;height:${size + 16}px;
        border-radius:50%;background:${color}33;
        animation:pulseRing 1.8s ease-out infinite;pointer-events:none;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:${size + 28}px;height:${size + 28}px;
        border-radius:50%;background:${color}18;
        animation:pulseRing 1.8s ease-out infinite 0.5s;pointer-events:none;
      "></div>`
    : "";

  const html = `
    <style>
      @keyframes pulseRing {
        0%   { transform:translate(-50%,-50%) scale(0.6); opacity:0.8; }
        100% { transform:translate(-50%,-50%) scale(1.8); opacity:0; }
      }
    </style>
    <div style="position:relative;width:${size + 28}px;height:${size + 28}px;display:flex;align-items:center;justify-content:center;">
      ${pulseRing}
      <div style="
        position:relative;width:${size}px;height:${size}px;border-radius:50%;
        background:${color};border:3px solid white;
        box-shadow:0 4px 14px ${color}66,0 2px 4px rgba(0,0,0,0.2);
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        cursor:pointer;z-index:2;
      ">
        <span style="color:white;font-weight:800;font-size:10px;line-height:1;">${aqi}</span>
        <span style="color:rgba(255,255,255,0.85);font-size:7px;font-weight:600;line-height:1;margin-top:1px;">AQI</span>
      </div>
    </div>`;

  return L.divIcon({
    className: "",
    html,
    iconSize: [size + 28, size + 28],
    iconAnchor: [(size + 28) / 2, (size + 28) / 2],
    popupAnchor: [0, -(size / 2 + 14)],
  });
}

function IndiaMapBounds() {
  const map = useMap();
  useEffect(() => {
    const indiaBounds = L.latLngBounds(L.latLng(6.5, 68.0), L.latLng(37.5, 97.5));
    map.fitBounds(indiaBounds, { padding: [60, 60] });
    map.setMaxBounds(indiaBounds.pad(0.5));
  }, [map]);
  return null;
}

export function MapSection() {
  const [selectedCity, setSelectedCity] = useState<CityEntry | null>(null);

  return (
    <section id="map-section" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
          >
            Real-time AQI Map
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Live monitoring across 15 major Indian cities — from the clean northeast hills to the polluted northern plains.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden border border-border/50 shadow-2xl shadow-black/8"
          style={{ height: "580px" }}
        >
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ width: "100%", height: "100%" }}
            zoomControl={true}
            scrollWheelZoom={false}
            attributionControl={true}
          >
            <IndiaMapBounds />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {CITIES.map((city) => (
              <Marker
                key={city.name}
                position={[city.lat, city.lng]}
                icon={createCityIcon(city.color, city.aqi, city.pulse)}
                eventHandlers={{ click: () => setSelectedCity(city) }}
              >
                <Popup className="aqi-popup">
                  <div className="p-1 min-w-[140px]">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-bold text-gray-900 text-base">{city.name}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: city.color }}>
                        {city.aqi}
                      </span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: city.color }}>{city.status}</p>
                    <p className="text-xs text-gray-500 mt-1">Click marker for full details</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          {[
            { label: "Good (0–50)",         color: "#22c55e" },
            { label: "Satisfactory (51–100)", color: "#84cc16" },
            { label: "Moderate (101–200)",  color: "#f97316" },
            { label: "Poor (201–300)",      color: "#ef4444" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedCity} onOpenChange={(open) => !open && setSelectedCity(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedCity && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg flex-col"
                    style={{ background: selectedCity.color }}>
                    <span className="text-xl font-extrabold leading-none">{selectedCity.aqi}</span>
                    <span className="text-[10px] font-semibold opacity-80 leading-none">AQI</span>
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedCity.name}</DialogTitle>
                    <DialogDescription className="font-semibold text-sm" style={{ color: selectedCity.color }}>
                      {selectedCity.status}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "PM 2.5", value: selectedCity.pm25, unit: "µg/m³" },
                    { label: "PM 10",  value: selectedCity.pm10, unit: "µg/m³" },
                    { label: "NO₂",   value: selectedCity.no2,  unit: "µg/m³" },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted p-4 rounded-xl text-center">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">{item.label}</p>
                      <p className="text-lg font-bold text-foreground">
                        {item.value} <span className="text-xs font-normal">{item.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Temp",     value: `${selectedCity.temp}°C`     },
                    { label: "Humidity", value: `${selectedCity.humidity}%`  },
                    { label: "Wind",     value: `${selectedCity.wind} km/h`  },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/40 p-3 rounded-xl text-center">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">{item.label}</p>
                      <p className="text-sm font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3">
                  <Wind className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">AI Prediction — Tomorrow</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Predicted AQI: <span className="font-bold" style={{ color: selectedCity.color }}>{selectedCity.prediction}</span>
                      {" "}({selectedCity.trend === "up" ? "↑ Increasing" : "↓ Improving"})
                    </p>
                  </div>
                </div>

                {selectedCity.aqi >= 200 && (
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-destructive">Health Advisory</h4>
                      <p className="text-sm text-destructive/80 mt-1">
                        Avoid prolonged outdoor exertion. Sensitive groups should stay indoors.
                      </p>
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
