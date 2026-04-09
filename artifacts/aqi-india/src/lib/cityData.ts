export function getAQIColor(aqi: number): string {
  if (aqi <= 50)  return "#22c55e";
  if (aqi <= 100) return "#84cc16";
  if (aqi <= 150) return "#eab308";
  if (aqi <= 200) return "#f97316";
  if (aqi <= 300) return "#ef4444";
  return "#7f1d1d";
}

export function getAQIStatus(aqi: number): string {
  if (aqi <= 50)  return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Very Poor";
  return "Hazardous";
}

export function getAQITrend(aqi: number): "up" | "down" {
  return aqi > 150 ? "up" : "down";
}

export function derivePollutants(aqi: number) {
  return {
    pm25: Math.round(aqi * 0.55),
    pm10: Math.round(aqi * 0.80),
    no2:  Math.round(aqi * 0.26),
    so2:  Math.round(aqi * 0.13),
    co:   Math.round(aqi * 0.015 * 10) / 10,
  };
}

function trend7(base: number): { day: string; aqi: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const offsets = [-18, -12, -6, -3, 0, 4, 0];
  return days.map((day, i) => ({ day, aqi: Math.max(20, base + offsets[i]) }));
}

export interface CityData {
  aqi: number;
  status: string;
  color: string;
  temp: number;
  humidity: number;
  wind: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  prediction: number;
  trend: "up" | "down";
  trend7: { day: string; aqi: number }[];
  lat: number;
  lng: number;
  pulse: boolean;
}

const RAW: {
  city: string; aqi: number;
  temp: number; humidity: number; wind: number;
  lat: number; lng: number;
}[] = [
  { city: "Aizawl",    aqi:  40, temp: 22, humidity: 72, wind: 7.2, lat: 23.7307, lng:  92.7173 },
  { city: "Kohima",    aqi:  50, temp: 20, humidity: 68, wind: 6.5, lat: 25.6751, lng:  94.1086 },
  { city: "Gangtok",   aqi:  45, temp: 18, humidity: 75, wind: 6.8, lat: 27.3389, lng:  88.6065 },
  { city: "Mysuru",    aqi:  95, temp: 27, humidity: 58, wind: 5.4, lat: 12.2958, lng:  76.6394 },
  { city: "Bangalore", aqi: 100, temp: 26, humidity: 62, wind: 4.9, lat: 12.9716, lng:  77.5946 },
  { city: "Mangaluru", aqi: 110, temp: 29, humidity: 78, wind: 4.2, lat: 12.9141, lng:  74.8560 },
  { city: "Bhopal",    aqi: 150, temp: 30, humidity: 55, wind: 3.8, lat: 23.2599, lng:  77.4126 },
  { city: "Siliguri",  aqi: 150, temp: 28, humidity: 71, wind: 3.5, lat: 26.7271, lng:  88.3953 },
  { city: "Hyderabad", aqi: 160, temp: 32, humidity: 60, wind: 3.8, lat: 17.3850, lng:  78.4867 },
  { city: "Chennai",   aqi: 165, temp: 33, humidity: 80, wind: 4.1, lat: 13.0827, lng:  80.2707 },
  { city: "Mumbai",    aqi: 180, temp: 31, humidity: 74, wind: 3.6, lat: 19.0760, lng:  72.8777 },
  { city: "Kolkata",   aqi: 190, temp: 32, humidity: 76, wind: 3.1, lat: 22.5726, lng:  88.3639 },
  { city: "Jaipur",    aqi: 220, temp: 35, humidity: 45, wind: 2.4, lat: 26.9124, lng:  75.7873 },
  { city: "Delhi",     aqi: 250, temp: 34, humidity: 52, wind: 2.1, lat: 28.6139, lng:  77.2090 },
  { city: "Patna",     aqi: 260, temp: 33, humidity: 68, wind: 1.8, lat: 25.5941, lng:  85.1376 },
  { city: "Solapur",   aqi: 120, temp: 32, humidity: 51, wind: 3.9, lat: 17.6599, lng:  75.9064 },
  { city: "Belagavi",  aqi:  90, temp: 28, humidity: 64, wind: 5.1, lat: 15.8497, lng:  74.4977 },
  { city: "Kochi",     aqi:  85, temp: 30, humidity: 79, wind: 4.8, lat:  9.9312, lng:  76.2673 },
  { city: "Thiruvananthapuram", aqi: 80, temp: 29, humidity: 81, wind: 5.4, lat: 8.5241, lng: 76.9366 },
  { city: "Jabalpur",  aqi: 140, temp: 31, humidity: 57, wind: 3.7, lat: 23.1815, lng:  79.9864 },
  { city: "Jamshedpur",aqi: 160, temp: 32, humidity: 66, wind: 3.2, lat: 22.8046, lng:  86.2029 },
  { city: "Ahmedabad", aqi: 105, temp: 34, humidity: 49, wind: 3.5, lat: 23.0225, lng:  72.5714 },
  { city: "Rajkot",    aqi: 130, temp: 33, humidity: 47, wind: 3.6, lat: 22.3039, lng:  70.8022 },
  { city: "Jhansi",    aqi: 170, temp: 35, humidity: 44, wind: 2.9, lat: 25.4484, lng:  78.5685 },
  { city: "Kanpur",    aqi: 190, temp: 34, humidity: 55, wind: 2.5, lat: 26.4499, lng:  80.3319 },
  { city: "Bareilly",  aqi: 180, temp: 32, humidity: 58, wind: 2.8, lat: 28.3670, lng:  79.4304 },
  { city: "Bhubaneswar", aqi: 160, temp: 31, humidity: 71, wind: 3.3, lat: 20.2961, lng: 85.8245 },
  { city: "Visakhapatnam", aqi: 110, temp: 30, humidity: 73, wind: 4.2, lat: 17.6868, lng: 83.2185 },
  { city: "Raipur",    aqi: 150, temp: 33, humidity: 60, wind: 3.1, lat: 21.2514, lng:  81.6296 },
  { city: "Prayagraj", aqi: 175, temp: 34, humidity: 53, wind: 2.7, lat: 25.4358, lng:  81.8463 },
];

export const CITIES_DATA: Record<string, CityData> = Object.fromEntries(
  RAW.map(({ city, aqi, temp, humidity, wind, lat, lng }) => {
    const p = derivePollutants(aqi);
    return [
      city,
      {
        aqi,
        status: getAQIStatus(aqi),
        color: getAQIColor(aqi),
        temp,
        humidity,
        wind,
        ...p,
        prediction: Math.round(aqi * (getAQITrend(aqi) === "up" ? 1.05 : 0.95)),
        trend: getAQITrend(aqi),
        trend7: trend7(aqi),
        lat,
        lng,
        pulse: aqi >= 200,
      },
    ];
  })
);

export const CITY_NAMES = RAW.map((r) => r.city);
