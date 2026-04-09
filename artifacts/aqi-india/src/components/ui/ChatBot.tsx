import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, RefreshCw } from "lucide-react";

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

function detectCity(text: string): string | null {
  const t = text.toLowerCase();
  return cityAQIData.map((x) => x.city).find((c) => t.includes(c.toLowerCase())) ?? null;
}

const cityAQIData = [
  { city: "Delhi", aqi: 250 },
  { city: "Mumbai", aqi: 180 },
  { city: "Bangalore", aqi: 100 },
  { city: "Chennai", aqi: 165 },
  { city: "Jaipur", aqi: 220 },
  { city: "Patna", aqi: 260 },
];

const cityLookup = new Map(cityAQIData.map((c) => [c.city.toLowerCase(), c]));

function detectCities(text: string): string[] {
  const t = text.toLowerCase();
  return cityAQIData.map((x) => x.city).filter((c) => t.includes(c.toLowerCase()));
}

function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Very Poor";
  return "Hazardous";
}

function aqiEmoji(aqi: number) {
  if (aqi <= 50) return "🟢";
  if (aqi <= 100) return "🟡";
  if (aqi <= 200) return "🟠";
  if (aqi <= 300) return "🔴";
  return "🚨";
}

function precautionsByAqi(aqi: number): string {
  if (aqi <= 50) return "Air is clean. Normal outdoor activity is safe.";
  if (aqi <= 100) return "Generally safe, but sensitive people should avoid long outdoor exertion.";
  if (aqi <= 150) return "Limit prolonged outdoor activity. Mask is recommended for sensitive groups.";
  if (aqi <= 200) return "Reduce outdoor time, avoid heavy exercise outside, and wear an N95 mask.";
  if (aqi <= 300) return "Very poor air. Stay indoors as much as possible and use an air purifier if available.";
  return "Hazardous air. Avoid going outside unless necessary and use strict respiratory protection.";
}

const getPrecautions = precautionsByAqi;

function predictTomorrowAqi(aqi: number): number {
  const delta = aqi > 250 ? 12 : aqi > 200 ? 8 : aqi > 150 ? 4 : -3;
  const noise = Math.round((Math.random() - 0.5) * 10);
  return Math.max(20, Math.min(500, aqi + delta + noise));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cityData(city: string) {
  return cityLookup.get(city.toLowerCase()) || null;
}

function getBotResponse(input: string, ctx: SessionContext): { text: string; newCtx: Partial<SessionContext> } {
  const text = input.toLowerCase().trim();
  const newCtx: Partial<SessionContext> = {};

  if (/breath|asthma|lung|respiratory/i.test(text)) {
    newCtx.userHasBreathingIssues = true;
    newCtx.userHasAsthma = /asthma/i.test(text);
  }
  if (/child|kid|baby|toddler/i.test(text)) newCtx.userIsChild = true;
  if (/elder|old|senior|grandpa|grandma/i.test(text)) newCtx.userIsElderly = true;

  if (/^(hi|hello|hey|namaste)\b/i.test(text)) {
    return {
      text: pick([
        "Hey! 👋 I'm AQI-Bot. Ask me about city AQI, health advice, comparisons, chemistry, or tomorrow trends.",
        "Hi there! I can help with AQI in major Indian cities, pollution effects, precautions, and formula explanations.",
      ]),
      newCtx,
    };
  }

  if (/what is this project|about this project|project purpose|how does your system work|system work/i.test(text)) {
    return {
      text: "This is an Air Quality Intelligence System for India 🇮🇳. It combines AQI data, pollutant understanding, health guidance, and trend estimation so users can take practical daily decisions.",
      newCtx,
    };
  }

  if (/what is aqi|how aqi is calculated|aqi formula|explain aqi|how is aqi calculated/i.test(text)) {
    return {
      text: "AQI is a single number representing air quality severity.\n\nIt is computed pollutant-wise using CPCB interpolation:\nI = ((I_hi - I_lo)/(C_hi - C_lo)) * (C - C_lo) + I_lo\n\nFinal AQI = maximum sub-index among pollutants, and that pollutant is the dominant pollutant.",
      newCtx,
    };
  }

  if (/most polluted|worst air|highest aqi/i.test(text)) {
    const worst = cityAQIData
      .sort((a, b) => b.aqi - a.aqi)[0];
    newCtx.lastCity = worst.city;
    return {
      text: `${aqiEmoji(worst.aqi)} ${worst.city} is currently the most polluted city in this dataset (AQI ${worst.aqi}, ${getAQICategory(worst.aqi)}). ${getPrecautions(worst.aqi)}`,
      newCtx,
    };
  }

  if (/cleanest city|least polluted|best air|lowest aqi/i.test(text)) {
    const cleanest = [...cityAQIData].sort((a, b) => a.aqi - b.aqi)[0];
    newCtx.lastCity = cleanest.city;
    return {
      text: pick([
        `${aqiEmoji(cleanest.aqi)} ${cleanest.city} is the cleanest right now in this dataset (AQI ${cleanest.aqi}).`,
        `${cleanest.city} has the lowest AQI currently (${cleanest.aqi}), so air quality is relatively better 👍`,
      ]),
      newCtx,
    };
  }

  const cities = detectCities(text);
  if (cities.length >= 2 && /compare|vs|versus|better|worse|which is better|or/i.test(text)) {
    const [c1, c2] = cities;
    const d1 = cityData(c1);
    const d2 = cityData(c2);
    if (!d1 || !d2) return { text: "Try comparing two supported cities like Delhi and Mumbai.", newCtx };
    const better = d1.aqi <= d2.aqi ? c1 : c2;
    const worse = d1.aqi > d2.aqi ? c1 : c2;
    newCtx.lastCity = better;
    return {
      text:
        `Comparison: ${c1} vs ${c2}\n` +
        `${aqiEmoji(d1.aqi)} ${c1}: AQI ${d1.aqi} (${getAQICategory(d1.aqi)})\n` +
        `${aqiEmoji(d2.aqi)} ${c2}: AQI ${d2.aqi} (${getAQICategory(d2.aqi)})\n\n` +
        `${better} has better air today. ${worse} needs more caution.`,
      newCtx,
    };
  }

  if (/what about tomorrow|tomorrow aqi|tomorrow|forecast|prediction|will pollution increase|trend/i.test(text)) {
    const city = detectCity(text) || ctx.lastCity;
    if (!city) return { text: "Tell me a city name for tomorrow AQI prediction 😊", newCtx };
    const d = cityData(city);
    if (!d) return { text: "I can predict for Delhi, Mumbai, Bangalore, Chennai, Jaipur, or Patna.", newCtx };
    const tomorrow = predictTomorrowAqi(d.aqi);
    newCtx.lastCity = city;
    return {
      text:
        `For ${city}, today's AQI is ${d.aqi}. Tomorrow may be around ${tomorrow} (smart trend estimate).\n` +
        `${tomorrow > d.aqi ? "It may get slightly worse 📈." : "It may improve a bit 📉."}`,
      newCtx,
    };
  }

  if (/health effects|effects of pollution|health advice|health|safe|mask|precaution|go out|outdoor|play outside/i.test(text)) {
    const city = detectCity(text) || ctx.lastCity;
    if (!city) {
      return {
        text: "Pollution can cause eye irritation, coughing, breathing discomfort, and long-term lung stress. Share your city for specific safety advice.",
        newCtx,
      };
    }
    const d = cityData(city);
    if (!d) return { text: "Share one of these cities: Delhi, Mumbai, Bangalore, Chennai, Jaipur, Patna.", newCtx };
    newCtx.lastCity = city;
    return { text: `Health advice for ${city} (AQI ${d.aqi}, ${getAQICategory(d.aqi)}): ${getPrecautions(d.aqi)}`, newCtx };
  }

  if (/what is smog|smog|acid rain|role of no2|no2|chemistry/i.test(text)) {
    if (/acid rain/.test(text)) {
      return {
        text: "Acid rain forms when pollutants like SO2 and NO2 react with water vapor to form acids in the atmosphere. It can damage crops, water bodies, and buildings.",
        newCtx,
      };
    }
    if (/role of no2|no2/.test(text)) {
      return {
        text: "NO2 is a harmful gas from vehicles and combustion sources. It irritates lungs and also participates in reactions that create ozone and secondary pollutants.",
        newCtx,
      };
    }
    return {
      text: "Smog is a polluted haze formed by particulate matter and chemical reactions in air, especially when emissions are high and wind is low.",
      newCtx,
    };
  }

  const city = detectCity(text) || (/aqi|air|pollution|quality/.test(text) ? ctx.lastCity : null);
  if (city) {
    const d = cityData(city);
    if (!d) return { text: "I currently track Delhi, Mumbai, Bangalore, Chennai, Jaipur, and Patna.", newCtx };
    newCtx.lastCity = city;
    const cityLine =
      d.aqi > 220
        ? `${city} air is really bad today 😷`
        : d.aqi > 140
        ? `${city} has concerning pollution today.`
        : `${city} is moderate, still relatively okay 👍`;
    return {
      text:
        `${aqiEmoji(d.aqi)} ${cityLine}\n` +
        `AQI: ${d.aqi} (${getAQICategory(d.aqi)})\n` +
        `Precaution: ${getPrecautions(d.aqi)}`,
      newCtx,
    };
  }

  return {
    text: "Try asking about AQI, cities, or health advice 😊",
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
      <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
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

      const delay = 500 + Math.random() * 500;
      setTimeout(() => {
        const { text: reply, newCtx } = getBotResponse(trimmed, ctx);
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
              className="absolute bottom-0 right-0 w-[370px] bg-background rounded-3xl shadow-2xl shadow-black/20 border border-border/50 overflow-hidden flex flex-col"
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
                      className="shrink-0 text-xs px-3 py-1.5 bg-card border border-border/60 rounded-full text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all whitespace-nowrap"
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
                  className="flex-1 bg-card border border-border/60 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
