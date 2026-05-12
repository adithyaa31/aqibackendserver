// ML-style AQI calculation demo (standalone; does NOT connect to the website).

function predictAqi(pm25, pm10, o3 = 0, no2 = 0) {
  // Feature engineering
  const x = [
    1.0,
    pm25,
    pm10,
    o3,
    no2,
    pm25 * pm25,
    pm10 * pm10,
    Math.sqrt(Math.max(pm25, 0)),
    Math.log1p(Math.max(pm10, 0)),
  ];

  // Example weights (demo only)
  const w = [
    5.0,
    0.25,
    0.12,
    0.08,
    0.05,
    0.0012,
    0.0007,
    1.8,
    0.6,
  ];

  let y = 0;
  for (let i = 0; i < x.length; i++) y += x[i] * w[i];

  return Math.max(0, y);
}

// Example usage
const pm25 = 65;
const pm10 = 120;
const o3 = 25;
const no2 = 20;

const aqi = predictAqi(pm25, pm10, o3, no2);
console.log(`Demo predicted AQI (calc-only ML-style): ${aqi.toFixed(2)}`);

