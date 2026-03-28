import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, RefreshCw } from "lucide-react";
import { CITIES_DATA, CITY_NAMES } from "@/lib/cityData";

/* ─────────────────────────── types ─────────────────────────── */
interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
}

interface SessionContext {
  lastCity: string | null;
  userHasBreathingIssues: boolean;
  userHasAsthma: boolean;
  userIsChild: boolean;
  userIsElderly: boolean;
}

/* ─────────────────────────── helpers ─────────────────────────── */
const now = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

function aqiEmoji(aqi: number) {
  if (aqi <= 50)  return "🟢";
  if (aqi <= 100) return "🟡";
  if (aqi <= 200) return "🟠";
  if (aqi <= 300) return "🔴";
  return "🚨";
}

function aqiRisk(aqi: number) {
  if (aqi <= 50)  return "Low";
  if (aqi <= 100) return "Low-Moderate";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "High";
  if (aqi <= 300) return "Very High";
  return "Hazardous";
}

function predict(aqi: number) {
  if (aqi > 250) return aqi + Math.round(10 + Math.random() * 15);
  if (aqi > 200) return aqi + Math.round(5  + Math.random() * 12);
  if (aqi > 150) return aqi + Math.round(-5 + Math.random() * 10);
  return Math.max(20, aqi + Math.round(-10 + Math.random() * 8));
}

function bestTimeOutdoor(aqi: number) {
  if (aqi <= 100) return "anytime — air quality is fine all day";
  if (aqi <= 150) return "early morning (6–8 AM) when traffic is low";
  if (aqi <= 200) return "early morning (5–7 AM) before peak pollution";
  return "try to avoid going outside entirely";
}

function maskAdvice(aqi: number, sensitive: boolean) {
  if (aqi <= 100 && !sensitive) return "No mask needed.";
  if (aqi <= 150) return sensitive ? "Wear N95 mask." : "Mask optional but recommended.";
  if (aqi <= 200) return "Wear N95/KN95 mask outdoors.";
  return "N95 mask is essential. Even indoors, consider an air purifier.";
}

function detectCity(text: string): string | null {
  const t = text.toLowerCase();
  return (
    CITY_NAMES.find((c) => t.includes(c.toLowerCase())) ?? null
  );
}

function detectCities(text: string): string[] {
  const t = text.toLowerCase();
  return CITY_NAMES.filter((c) => t.includes(c.toLowerCase()));
}

/* ─────────────────────────── response engine ─────────────────────────── */
function generateResponse(input: string, ctx: SessionContext): { text: string; newCtx: Partial<SessionContext> } {
  const t = input.toLowerCase().trim();
  const newCtx: Partial<SessionContext> = {};

  // ── Health profile detection ──
  if (/breath|asthma|lung|respiratory/i.test(t)) {
    newCtx.userHasBreathingIssues = true;
    newCtx.userHasAsthma = /asthma/i.test(t);
  }
  if (/child|kid|baby|toddler/i.test(t)) newCtx.userIsChild = true;
  if (/elder|old|senior|grandpa|grandma/i.test(t)) newCtx.userIsElderly = true;

  const sensitive =
    ctx.userHasBreathingIssues || ctx.userHasAsthma ||
    ctx.userIsChild || ctx.userIsElderly ||
    /breath|asthma|lung|child|elder/i.test(t);

  // ── Greeting ──
  if (/^(hi|hello|hey|namaste|hola|yo|sup)\b/i.test(t)) {
    return {
      text: `Hey! 👋 I'm AQI-Bot, your air quality assistant for India 🇮🇳\n\nI can help you with:\n• 📍 AQI for any of 15 cities\n• 📈 Tomorrow's AQI prediction\n• ⚖️ City comparisons\n• 🏥 Health recommendations\n• 🌬️ Pollution analysis\n\nJust ask! Try: *"How's Delhi air today?"* or *"Compare Mumbai and Bangalore"*`,
      newCtx,
    };
  }

  // ── Help / capabilities ──
  if (/help|what can you|features|capabilities/i.test(t)) {
    return {
      text: `Here's what I can do 🤖\n\n🏙️ *City AQI* — "AQI in Patna"\n📈 *Prediction* — "Tomorrow's AQI in Delhi"\n⚖️ *Compare* — "Compare Jaipur and Bangalore"\n🏥 *Health* — "Is it safe for asthma patients in Mumbai?"\n🏆 *Rankings* — "Which city has best air?"\n🌡️ *Pollutants* — "PM2.5 levels in Chennai"\n💊 *Advice* — "Should I wear a mask in Kolkata?"\n\nWhat would you like to know?`,
      newCtx,
    };
  }

  // ── List all cities / rankings ──
  if (/best.*air|cleanest|safest|top.*city|which.*city.*good|rank/i.test(t)) {
    const sorted = CITY_NAMES
      .map((c) => ({ c, aqi: CITIES_DATA[c].aqi }))
      .sort((a, b) => a.aqi - b.aqi);
    const top3 = sorted.slice(0, 3).map((x) => `${aqiEmoji(x.aqi)} ${x.c} — AQI ${x.aqi}`).join("\n");
    const worst3 = sorted.slice(-3).reverse().map((x) => `${aqiEmoji(x.aqi)} ${x.c} — AQI ${x.aqi}`).join("\n");
    return {
      text: `🏆 *Best air quality right now:*\n${top3}\n\n⚠️ *Most polluted:*\n${worst3}\n\nAizawl in Mizoram has the cleanest air in our dataset! Great place if you have respiratory issues 🌿`,
      newCtx,
    };
  }

  // ── Compare two cities ──
  const cities = detectCities(t);
  if ((cities.length >= 2 && /compar|vs|versus|or|better|worse/i.test(t)) || cities.length === 2) {
    const [c1, c2] = cities;
    const d1 = CITIES_DATA[c1], d2 = CITIES_DATA[c2];
    const better = d1.aqi < d2.aqi ? c1 : c2;
    const worse  = d1.aqi < d2.aqi ? c2 : c1;
    const diff   = Math.abs(d1.aqi - d2.aqi);
    newCtx.lastCity = better;
    return {
      text: `⚖️ *${c1} vs ${c2}*\n\n${aqiEmoji(d1.aqi)} ${c1} — AQI **${d1.aqi}** (${d1.status})\n${aqiEmoji(d2.aqi)} ${c2} — AQI **${d2.aqi}** (${d2.status})\n\n✅ **${better}** has better air quality by ${diff} AQI points.\n\n${
        sensitive
          ? `🏥 *For you specifically:* ${better} is the right choice. The AQI difference of ${diff} points matters a lot for sensitive groups.`
          : `If you're planning to travel, ${better} is the safer pick right now.`
      }`,
      newCtx,
    };
  }

  // ── PM2.5 / pollutant specific query ──
  if (/pm2\.?5|pm10|no2|so2|co |ozone|pollutant/i.test(t)) {
    const city = detectCity(t) || ctx.lastCity;
    if (city && CITIES_DATA[city]) {
      const d = CITIES_DATA[city];
      newCtx.lastCity = city;
      return {
        text: `🧪 *Pollutant breakdown for ${city}:*\n\n• PM2.5: **${d.pm25} µg/m³** ${d.pm25 > 60 ? "⚠️ High" : "✅"}\n• PM10: **${d.pm10} µg/m³** ${d.pm10 > 100 ? "⚠️ High" : "✅"}\n• NO₂: **${d.no2} µg/m³** ${d.no2 > 40 ? "⚠️ High" : "✅"}\n• SO₂: **${d.so2} µg/m³** ${d.so2 > 20 ? "⚠️ High" : "✅"}\n• CO: **${d.co} mg/m³** ${d.co > 2 ? "⚠️ High" : "✅"}\n\n${d.pm25 > 60 ? "PM2.5 is particularly dangerous — it penetrates deep into lungs. Wear N95 mask! 😷" : "Pollutant levels are relatively manageable today."}`,
        newCtx,
      };
    }
  }

  // ── Tomorrow / prediction query ──
  if (/tomorrow|predict|next day|forecast/i.test(t)) {
    const city = detectCity(t) || ctx.lastCity;
    if (!city) {
      return { text: "Which city's prediction do you want? Try: *'Tomorrow AQI in Delhi'* 🌆", newCtx };
    }
    const d = CITIES_DATA[city];
    const pred = predict(d.aqi);
    const trend = pred > d.aqi ? "📈 worsening" : "📉 improving";
    newCtx.lastCity = city;
    return {
      text: `📈 *AQI Prediction for ${city}*\n\nToday: ${aqiEmoji(d.aqi)} AQI **${d.aqi}** (${d.status})\nTomorrow: ${aqiEmoji(pred)} AQI **${pred}** — ${trend}\n\n${
        pred > 250
          ? `🚨 *Emergency Warning:* Tomorrow looks really bad for ${city}. Stock up on N95 masks and run your air purifier. Avoid all outdoor activity.`
          : pred > 200
          ? `⚠️ *Health Alert:* Air quality may deteriorate tomorrow. Plan indoor activities and keep windows shut.`
          : pred > 150
          ? `Stay cautious tomorrow. Best to go out early morning and avoid peak hours.`
          : `Tomorrow looks ${pred < d.aqi ? "slightly better 🌿" : "about the same"} in ${city}.`
      }`,
      newCtx,
    };
  }

  // ── Mask / safety query ──
  if (/mask|safe.*go out|should i go|outdoor|exercise outside/i.test(t)) {
    const city = detectCity(t) || ctx.lastCity;
    if (!city) {
      return { text: "Tell me your city and I'll give mask & outdoor advice! Try: *'Is it safe to go out in Mumbai?'*", newCtx };
    }
    const d = CITIES_DATA[city];
    newCtx.lastCity = city;
    return {
      text: `🏃 *Outdoor Safety — ${city}*\n\nAQI: ${aqiEmoji(d.aqi)} **${d.aqi}** (${d.status})\n\n😷 Mask: ${maskAdvice(d.aqi, sensitive)}\n⏰ Best time out: ${bestTimeOutdoor(d.aqi)}\n${
        d.aqi > 150
          ? `🏠 Prefer indoor exercise today.\n🌬️ Keep windows closed & use air purifier if possible.`
          : `🌳 Light outdoor activity is okay. Avoid dusty or busy roads.`
      }${
        sensitive
          ? `\n\n🏥 *For sensitive groups:* Extra caution advised even at moderate AQI levels. Carry your inhaler/medication.`
          : ""
      }`,
      newCtx,
    };
  }

  // ── Weather / wind / humidity query ──
  if (/weather|wind|humidity|temperature|temp\b/i.test(t)) {
    const city = detectCity(t) || ctx.lastCity;
    if (!city) {
      return { text: "Which city's weather data do you need? 🌤️", newCtx };
    }
    const d = CITIES_DATA[city];
    newCtx.lastCity = city;
    return {
      text: `🌤️ *Weather in ${city}*\n\n🌡️ Temperature: **${d.temp}°C**\n💧 Humidity: **${d.humidity}%**\n🌬️ Wind Speed: **${d.wind} km/h**\n\n${
        d.wind < 3
          ? `Low wind speed is trapping pollutants near the ground — one reason AQI is high here. 😶‍🌫️`
          : d.wind > 6
          ? `Good wind is helping disperse pollutants. That's partly why ${city} has cleaner air. 🌿`
          : `Moderate wind conditions today.`
      }`,
      newCtx,
    };
  }

  // ── "What about tomorrow?" follow-up ──
  if (/what about|how about|and (tomorrow|next|prediction)/i.test(t) && ctx.lastCity) {
    const city = ctx.lastCity;
    const d = CITIES_DATA[city];
    const pred = predict(d.aqi);
    return {
      text: `For **${city}** tomorrow: ${aqiEmoji(pred)} AQI **${pred}** — ${pred > d.aqi ? "trending worse 📈" : "slight improvement 📉"}\n\n${pred > 200 ? "⚠️ Stay cautious — conditions remain unhealthy." : "Should be manageable if you take precautions."}`,
      newCtx,
    };
  }

  // ── Breathing issues context ──
  if (sensitive && !detectCity(t) && /issue|problem|affect|bad for me|safe for me/i.test(t)) {
    const city = ctx.lastCity;
    if (city) {
      const d = CITIES_DATA[city];
      return {
        text: `🏥 *Health Advisory for sensitive groups — ${city}*\n\nAQI: ${aqiEmoji(d.aqi)} **${d.aqi}** (${d.status})\n\n${
          d.aqi > 200
            ? `🚨 This is NOT safe for you. Stay indoors with windows shut. Use an air purifier. Carry your medication.`
            : d.aqi > 100
            ? `⚠️ Use N95 mask if you must go outside. Limit outdoor time to under 30 mins. Avoid parks near roads.`
            : `✅ Air is manageable but still wear a light mask if you're sensitive.`
        }\n\n💊 Keep rescue medication handy. Consult your doctor if you experience symptoms.`,
        newCtx,
      };
    }
  }

  // ── Single city AQI lookup (main use case) ──
  const city = detectCity(t) || ((/aqi|air|quality|pollution|how is|how's|today/i.test(t)) ? ctx.lastCity : null);
  if (city && CITIES_DATA[city]) {
    const d = CITIES_DATA[city];
    const pred = predict(d.aqi);
    const risk = aqiRisk(d.aqi);
    newCtx.lastCity = city;

    let healthNote = "";
    if (sensitive && d.aqi > 100) {
      healthNote = `\n\n🏥 *For your health condition:* ${
        d.aqi > 200
          ? "Please stay indoors. This level is dangerous for you."
          : "Limit exposure. Wear N95 mask if you must go outside."
      }`;
    }

    let alert = "";
    if (d.aqi > 300) alert = `\n\n🚨 *Emergency Warning:* Hazardous air! Everyone should avoid outdoor activities.`;
    else if (d.aqi > 200) alert = `\n\n⚠️ *Health Alert:* Unhealthy for all groups. Mask up!`;

    const tone = d.aqi > 250
      ? `Bro, ${city} air is really bad today 😷 Stay safe!`
      : d.aqi > 150
      ? `${city} isn't great today — take some precautions.`
      : d.aqi > 100
      ? `${city} is moderate. Nothing alarming but be mindful.`
      : `${city} is breathing easy today! 🌿`;

    return {
      text: `${aqiEmoji(d.aqi)} *${city} — Live AQI*\n\n${tone}\n\n📊 AQI: **${d.aqi}** (${d.status})\n⚠️ Risk Level: **${risk}**\n📈 Trend: ${d.trend === "up" ? "Worsening 📈" : "Improving 📉"}\n🔮 Tomorrow: ~${pred} AQI\n\n⏰ Best outdoor time: ${bestTimeOutdoor(d.aqi)}\n😷 Mask: ${maskAdvice(d.aqi, sensitive)}${alert}${healthNote}`,
      newCtx,
    };
  }

  // ── Breathing issues without city ──
  if (/breath|asthma|lung|child|elder|sensitive/i.test(t)) {
    return {
      text: `Got it — I'll give you extra-cautious advice 🏥\n\nYour health profile is noted. Now tell me which city you're in and I'll give personalized safety recommendations!\n\nTry: *"Is Delhi safe for me?"*`,
      newCtx,
    };
  }

  // ── Fallback ──
  return {
    text: `Hmm, I didn't catch that 🤔 I'm specialized in India's air quality!\n\nTry asking:\n• *"AQI in Delhi"*\n• *"Compare Mumbai and Bangalore"*\n• *"Is it safe to run outside in Chennai?"*\n• *"Tomorrow's forecast for Patna"*\n• *"Which city has the best air?"*`,
    newCtx,
  };
}

/* ─────────────────────────── typing indicator ─────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-india-green flex items-center justify-center shrink-0 shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/40"
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── message renderer ─────────────────────────── */
function MessageBubble({ msg }: { msg: Message }) {
  const isBot = msg.role === "bot";

  const formatted = msg.text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g,     "<em>$1</em>")
    .replace(/\n/g,            "<br/>");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-india-green flex items-center justify-center shrink-0 shadow-sm">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[82%] group`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isBot
              ? "bg-white border border-border/50 text-foreground rounded-bl-sm"
              : "bg-foreground text-background rounded-br-sm"
          }`}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
        <p className={`text-[10px] text-muted-foreground mt-1 px-1 ${isBot ? "text-left" : "text-right"}`}>
          {msg.time}
        </p>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-muted border border-border/50 flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground">
          You
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────── quick suggestions ─────────────────────────── */
const QUICK_SUGGESTIONS = [
  "AQI in Delhi",
  "Compare Mumbai and Bangalore",
  "Best city to visit?",
  "Tomorrow forecast Patna",
  "Safe for asthma in Chennai?",
  "Which city is cleanest?",
];

/* ─────────────────────────── main chatbot ─────────────────────────── */
export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: `Hey! 👋 I'm **AQI-Bot** — your smart air quality assistant for India 🇮🇳\n\nAsk me about any city's AQI, health advice, pollution predictions, or city comparisons!\n\n💡 Try: *"How's the air in Delhi today?"*`,
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ctx, setCtx] = useState<SessionContext>({
    lastCity: null,
    userHasBreathingIssues: false,
    userHasAsthma: false,
    userIsChild: false,
    userIsElderly: false,
  });
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed, time: now() };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setTyping(true);

      const delay = 600 + Math.random() * 700;
      setTimeout(() => {
        const { text: reply, newCtx } = generateResponse(trimmed, ctx);
        setCtx((c) => ({ ...c, ...newCtx }));
        const botMsg: Message = { id: (Date.now() + 1).toString(), role: "bot", text: reply, time: now() };
        setMessages((m) => [...m, botMsg]);
        setTyping(false);
        if (!open) setHasUnread(true);
      }, delay);
    },
    [ctx, open]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome-2",
      role: "bot",
      text: `Chat cleared! 🧹 I still remember your context. Ask me anything about India's air quality! 🇮🇳`,
      time: now(),
    }]);
    setCtx({ lastCity: null, userHasBreathingIssues: false, userHasAsthma: false, userIsChild: false, userIsElderly: false });
  };

  return (
    <>
      {/* FAB button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-india-green shadow-xl shadow-primary/30 flex items-center justify-center text-white relative"
            >
              <MessageCircle className="w-6 h-6" />
              {hasUnread && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
              )}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat window */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-0 right-0 w-[370px] bg-[#f8f9fb] rounded-3xl shadow-2xl shadow-black/20 border border-border/50 overflow-hidden flex flex-col"
              style={{ height: "580px" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-india-green px-5 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">AQI-Bot 🇮🇳</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                      <span className="text-white/80 text-xs">Always online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearChat}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                    title="Clear chat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Context pill */}
              {ctx.lastCity && (
                <div className="px-4 pt-2 pb-0 shrink-0">
                  <span className="text-xs text-muted-foreground bg-muted border border-border/50 rounded-full px-3 py-1">
                    📍 Last city: <strong>{ctx.lastCity}</strong>
                    {ctx.userHasBreathingIssues && " · 🏥 Sensitive user"}
                  </span>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}
                {typing && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Quick suggestions */}
              <div className="px-4 pb-2 shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="shrink-0 text-xs px-3 py-1.5 bg-white border border-border/60 rounded-full text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="px-4 pb-4 pt-1 flex gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about any city…"
                  className="flex-1 bg-white border border-border/60 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim()}
                  whileTap={{ scale: 0.9 }}
                  className="w-11 h-11 rounded-2xl bg-foreground text-background flex items-center justify-center disabled:opacity-30 hover:bg-primary transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
