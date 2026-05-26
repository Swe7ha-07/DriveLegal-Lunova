"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Language = "en" | "ta" | "hi" | "ml" | "te";

// ── Full UI translations ──
const TEXT: Record<Language, {
  title: string; challan: string; heatmap: string;
  placeholder: string; send: string; typing: string; you: string; bot: string;
  lawsCovered: string; states: string; languages: string;
  detectingLocation: string; locationDetected: string; locationFailed: string;
  welcomeTitle: string; welcomeSubtitle: string;
  hint: string;
  suggestions: string[];
}> = {
  en: {
    title: "DriveLegal AI", challan: "Challan", heatmap: "Map",
    placeholder: "Ask anything about traffic rules…", send: "Send",
    typing: "Typing…", you: "You", bot: "DriveLegal",
    lawsCovered: "Laws Covered", states: "States", languages: "Languages",
    detectingLocation: "Detecting your location…",
    locationDetected: "Location detected",
    locationFailed: "Location unavailable",
    welcomeTitle: "Ask DriveLegal AI",
    welcomeSubtitle: "Your intelligent assistant for traffic laws, fines, road signs, and driving rules — auto-detecting your location.",
    hint: "Press Enter to send · DriveLegal AI may make mistakes — verify critical info",
    suggestions: ["Fine for no helmet?", "Drunk driving penalty", "Red triangle road sign", "Seatbelt rules"],
  },
  ta: {
    title: "டிரைவ் லீகல் AI", challan: "சலான்", heatmap: "வரைபடம்",
    placeholder: "போக்குவரத்து விதிகளை கேளுங்கள்…", send: "அனுப்பு",
    typing: "தட்டச்சு செய்கிறது…", you: "நீங்கள்", bot: "DriveLegal",
    lawsCovered: "சட்டங்கள்", states: "மாநிலங்கள்", languages: "மொழிகள்",
    detectingLocation: "இடம் கண்டறிகிறது…",
    locationDetected: "இடம் கண்டறியப்பட்டது",
    locationFailed: "இடம் கிடைக்கவில்லை",
    welcomeTitle: "DriveLegal AI கேளுங்கள்",
    welcomeSubtitle: "போக்குவரத்து சட்டங்கள், அபராதங்கள், சாலை அடையாளங்கள் — உங்கள் இடம் தானாக கண்டறியப்படுகிறது.",
    hint: "Enter அழுத்தி அனுப்பவும் · தகவல்களை சரிபார்க்கவும்",
    suggestions: ["ஹெல்மெட் இல்லாமல் அபராதம்?", "குடிபோதையில் வாகனம் ஓட்டுதல்", "சிவப்பு முக்கோண அடையாளம்", "சீட்பெல்ட் விதிகள்"],
  },
  hi: {
    title: "ड्राइवलीगल AI", challan: "चालान", heatmap: "मानचित्र",
    placeholder: "यातायात नियम पूछें…", send: "भेजें",
    typing: "टाइप हो रहा है…", you: "आप", bot: "DriveLegal",
    lawsCovered: "कानून", states: "राज्य", languages: "भाषाएं",
    detectingLocation: "स्थान पता चल रहा है…",
    locationDetected: "स्थान मिल गया",
    locationFailed: "स्थान उपलब्ध नहीं",
    welcomeTitle: "DriveLegal AI से पूछें",
    welcomeSubtitle: "यातायात कानून, जुर्माना, सड़क संकेत — आपका स्थान स्वतः पहचाना जाता है।",
    hint: "Enter दबाकर भेजें · जानकारी सत्यापित करें",
    suggestions: ["हेलमेट नहीं तो जुर्माना?", "शराब पीकर गाड़ी चलाना", "लाल त्रिकोण चिह्न", "सीटबेल्ट नियम"],
  },
  ml: {
    title: "ഡ്രൈവ് ലീഗൽ AI", challan: "ചലാൻ", heatmap: "ഭൂപടം",
    placeholder: "ഗതാഗത നിയമങ്ങൾ ചോദിക്കൂ…", send: "അയയ്ക്കുക",
    typing: "ടൈപ്പ് ചെയ്യുന്നു…", you: "നിങ്ങൾ", bot: "DriveLegal",
    lawsCovered: "നിയമങ്ങൾ", states: "സംസ്ഥാനങ്ങൾ", languages: "ഭാഷകൾ",
    detectingLocation: "സ്ഥലം കണ്ടെത്തുന്നു…",
    locationDetected: "സ്ഥലം കണ്ടെത്തി",
    locationFailed: "സ്ഥലം ലഭ്യമല്ല",
    welcomeTitle: "DriveLegal AI ചോദിക്കൂ",
    welcomeSubtitle: "ഗതാഗത നിയമങ്ങൾ, പിഴകൾ, റോഡ് അടയാളങ്ങൾ — നിങ്ങളുടെ സ്ഥലം സ്വതേ കണ്ടെത്തുന്നു.",
    hint: "Enter അമർത്തി അയയ്ക്കുക · വിവരങ്ങൾ പരിശോധിക്കൂ",
    suggestions: ["ഹെൽമറ്റ് ഇല്ലെങ്കിൽ പിഴ?", "മദ്യപിച്ചു വാഹനം ഓടിക്കൽ", "ചുവന്ന ത്രികോണ അടയാളം", "സീറ്റ്ബെൽറ്റ് നിയമങ്ങൾ"],
  },
  te: {
    title: "డ్రైవ్ లీగల్ AI", challan: "చలాన్", heatmap: "మ్యాప్",
    placeholder: "ట్రాఫిక్ నియమాలు అడగండి…", send: "పంపు",
    typing: "టైప్ చేస్తోంది…", you: "మీరు", bot: "DriveLegal",
    lawsCovered: "చట్టాలు", states: "రాష్ట్రాలు", languages: "భాషలు",
    detectingLocation: "స్థానం గుర్తిస్తోంది…",
    locationDetected: "స్థానం గుర్తించబడింది",
    locationFailed: "స్థానం అందుబాటులో లేదు",
    welcomeTitle: "DriveLegal AI అడగండి",
    welcomeSubtitle: "ట్రాఫిక్ చట్టాలు, జరిమానాలు, రోడ్ సంకేతాలు — మీ స్థానం స్వయంచాలకంగా గుర్తించబడుతుంది.",
    hint: "Enter నొక్కి పంపండి · సమాచారాన్ని నిర్ధారించండి",
    suggestions: ["హెల్మెట్ లేకుంటే జరిమానా?", "మద్యపానం చేసి వాహనం నడపడం", "ఎర్ర త్రిభుజ చిహ్నం", "సీట్‌బెల్ట్ నియమాలు"],
  },
};

const LANGS = [
  { value: "en", label: "EN", full: "English" },
  { value: "ta", label: "தமிழ்", full: "Tamil" },
  { value: "hi", label: "हिन्दी", full: "Hindi" },
  { value: "ml", label: "മലയാളം", full: "Malayalam" },
  { value: "te", label: "తెలుగు", full: "Telugu" },
];

type LocationState = {
  status: "idle" | "detecting" | "detected" | "failed";
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [messages, setMessages] = useState<{ role: string; content: string; animKey?: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationState>({
    status: "idle", city: "", state: "", country: "India", lat: 0, lon: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = TEXT[language];

  // ── Load saved lang ──
  useEffect(() => {
    const saved = localStorage.getItem("drivelegal_lang");
    if (saved && ["en", "ta", "hi", "ml", "te"].includes(saved)) {
      setLanguage(saved as Language);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("drivelegal_lang", language);
  }, [language]);

  // ── Auto scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Geolocation + Reverse Geocode ──
  useEffect(() => {
    setLocation((prev) => ({ ...prev, status: "detecting" }));

    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, status: "failed" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const addr = data.address || {};
          setLocation({
            status: "detected",
            city: addr.city || addr.town || addr.village || addr.county || "",
            state: addr.state || "",
            country: addr.country || "India",
            lat: latitude,
            lon: longitude,
          });
        } catch {
          setLocation({ status: "detected", city: "", state: "", country: "India", lat: latitude, lon: longitude });
        }
      },
      () => {
        setLocation((prev) => ({ ...prev, status: "failed" }));
      },
      { timeout: 8000 }
    );
  }, []);

  const locationString = location.status === "detected"
    ? [location.city, location.state, location.country].filter(Boolean).join(", ")
    : "India";

  const sendMessage = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    const animKey = Date.now();
    setMessages((prev) => [...prev, { role: "user", content: currentInput, animKey }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST", mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          location: locationString,
          language,
          // Pass country/state so backend uses correct law context
          country: location.country || "India",
          state: location.state || "",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.response || "No response", animKey: Date.now() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", content: "⚠️ Unable to connect to backend.", animKey: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const locIcon = location.status === "detecting" ? "⏳" : location.status === "detected" ? "📍" : "⚠️";
  const locLabel = location.status === "detecting"
    ? t.detectingLocation
    : location.status === "detected"
    ? locationString
    : t.locationFailed;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0a0f;
          --surface: #1e1e28;
          --surface2: #252530;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.12);
          --accent: #e8ff47;
          --accent2: #ffb800;
          --text: #f0f0f5;
          --muted: #888899;
          --muted2: #444455;
          --user-bubble: #1c2a1a;
          --bot-bubble: #1a1a25;
          --transition-fast: 0.15s cubic-bezier(0.4,0,0.2,1);
          --transition-med: 0.28s cubic-bezier(0.4,0,0.2,1);
          --transition-spring: 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }

        html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

        /* ── SHELL ── */
        .app-shell {
          display: grid; grid-template-rows: 64px 1fr;
          height: 100vh; max-width: 1100px; margin: 0 auto;
        }

        /* ── HEADER ── */
        .header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px);
          background: rgba(10,10,15,0.9);
          position: sticky; top: 0; z-index: 50;
          animation: headerSlide 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes headerSlide {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }

        .logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px;
          letter-spacing: -0.3px; color: var(--text); text-decoration: none;
        }
        .logo-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--accent); display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          transition: transform var(--transition-spring);
        }
        .logo:hover .logo-icon { transform: rotate(-8deg) scale(1.1); }
        .logo-badge {
          font-size: 10px; font-weight: 600; background: var(--accent); color: #000;
          border-radius: 4px; padding: 2px 6px; font-family: 'DM Sans', sans-serif;
        }

        /* ── LOC PILL ── */
        .loc-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 10px; border-radius: 20px;
          background: var(--surface); border: 1px solid var(--border2);
          font-size: 11px; color: var(--muted);
          transition: all var(--transition-fast);
          max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .loc-pill.detected { border-color: rgba(232,255,71,0.25); color: var(--accent); }
        .loc-spin { animation: spin 1s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── NAV ── */
        .header-nav { display: flex; align-items: center; gap: 8px; }
        .nav-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 20px;
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--muted); font-size: 13px; font-weight: 500;
          text-decoration: none;
          transition: all var(--transition-fast); cursor: pointer;
        }
        .nav-pill:hover { background: var(--surface); color: var(--text); transform: translateY(-1px); }
        .nav-pill.active { background: var(--accent); color: #000; border-color: transparent; font-weight: 600; }

        /* ── LANG BUTTONS ── */
        .lang-row { display: flex; align-items: center; gap: 5px; margin-left: 12px; }
        .lang-btn {
          padding: 5px 9px; border-radius: 8px; border: 1px solid var(--border);
          background: transparent; color: var(--muted); font-size: 12px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all var(--transition-fast); position: relative;
        }
        .lang-btn:hover { border-color: var(--border2); color: var(--text); transform: translateY(-1px); }
        .lang-btn.active {
          background: var(--surface2); border-color: var(--accent); color: var(--accent);
          box-shadow: 0 0 0 2px rgba(232,255,71,0.08);
        }
        .lang-btn::after {
          content: ''; position: absolute; inset: 0; border-radius: 8px;
          background: var(--accent); opacity: 0; transition: opacity var(--transition-fast);
        }
        .lang-btn:active::after { opacity: 0.08; }

        /* ── CHAT LAYOUT ── */
        .chat-layout {
          display: grid; grid-template-rows: 1fr auto;
          overflow: hidden; padding: 0 24px;
        }
        .messages-area {
          overflow-y: auto; padding: 32px 0 8px; scroll-behavior: smooth;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

        /* ── WELCOME ── */
        .welcome {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 50px 20px; gap: 16px;
          animation: welcomeFade 0.6s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes welcomeFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .welcome-icon {
          width: 68px; height: 68px; border-radius: 20px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center;
          font-size: 30px; margin-bottom: 6px;
          animation: iconFloat 3s ease-in-out infinite;
          box-shadow: 0 8px 32px rgba(232,255,71,0.18);
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-6px) rotate(3deg); }
        }
        .welcome h2 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 26px; letter-spacing: -0.5px; color: var(--text);
        }
        .welcome p { color: var(--muted); font-size: 14px; max-width: 440px; line-height: 1.65; }
        .stat-row { display: flex; gap: 8px; margin-top: 12px; }
        .stat-card {
          flex: 1; padding: 10px 14px; border-radius: 10px;
          background: var(--surface); border: 1px solid var(--border);
          transition: all var(--transition-fast);
        }
        .stat-card:hover { border-color: var(--border2); transform: translateY(-2px); }
        .stat-label { font-size: 10px; color: var(--muted); letter-spacing: 0.5px; text-transform: uppercase; }
        .stat-value { font-size: 15px; font-weight: 700; color: var(--text); font-family: 'Syne', sans-serif; margin-top: 2px; }
        .suggestions { display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; margin-top: 6px; }
        .suggestion-chip {
          padding: 7px 13px; border-radius: 16px; border: 1px solid var(--border2);
          background: var(--surface); color: var(--muted); font-size: 12px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all var(--transition-fast);
        }
        .suggestion-chip:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
        .suggestion-chip:active { transform: scale(0.97); }

        /* ── MESSAGES ── */
        .message-row {
          display: flex; margin-bottom: 18px; gap: 10px;
          animation: msgIn 0.3s cubic-bezier(0.34,1.2,0.64,1) forwards;
          opacity: 0;
        }
        .message-row.user { flex-direction: row-reverse; }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .avatar {
          width: 30px; height: 30px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0; font-weight: 700;
          font-family: 'Syne', sans-serif;
          transition: transform var(--transition-spring);
        }
        .message-row:hover .avatar { transform: scale(1.1); }
        .avatar.bot { background: var(--accent); color: #000; }
        .avatar.user { background: var(--surface2); color: var(--text); border: 1px solid var(--border2); }
        .bubble {
          max-width: 72%; padding: 12px 16px; border-radius: 16px;
          font-size: 14px; line-height: 1.65; word-break: break-word;
          transition: all var(--transition-fast);
        }
        .bubble:hover { transform: translateY(-1px); }
        .bubble.bot {
          background: var(--bot-bubble); border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }
        .bubble.user {
          background: var(--user-bubble); border: 1px solid rgba(100,200,80,0.15);
          border-bottom-right-radius: 4px;
        }

        /* ── TYPING ── */
        .typing-row {
          display: flex; gap: 10px; margin-bottom: 18px;
          animation: msgIn 0.2s ease forwards;
        }
        .typing-bubble {
          padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px;
          background: var(--bot-bubble); border: 1px solid var(--border);
          display: flex; align-items: center; gap: 5px;
        }
        .dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--muted2);
          animation: typingPulse 1.4s ease-in-out infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.18s; }
        .dot:nth-child(3) { animation-delay: 0.36s; }
        @keyframes typingPulse {
          0%, 60%, 100% { transform: translateY(0) scale(1);    background: var(--muted2); }
          30%            { transform: translateY(-7px) scale(1.2); background: var(--accent); }
        }

        /* ── INPUT ── */
        .input-area {
          padding: 14px 0 22px; border-top: 1px solid var(--border);
          animation: inputRise 0.5s 0.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes inputRise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .input-box {
          display: flex; align-items: center; gap: 10px;
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: 16px; padding: 12px 12px 12px 18px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-box:focus-within {
          border-color: rgba(232,255,71,0.45);
          box-shadow: 0 0 0 3px rgba(232,255,71,0.06);
        }
        .input-box input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px;
        }
        .input-box input::placeholder { color: var(--muted2); }
        .send-btn {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: var(--accent); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all var(--transition-spring); color: #000;
        }
        .send-btn:hover { transform: scale(1.12) rotate(-5deg); background: #d4eb3c; }
        .send-btn:active { transform: scale(0.94); }
        .send-btn:disabled { background: var(--surface2); color: var(--muted2); cursor: not-allowed; transform: none; }
        .input-hint { font-size: 11px; color: var(--muted2); margin-top: 8px; text-align: center; }

        /* ── LANG SWITCH ANIMATION ── */
        .lang-transition {
          animation: langPop 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes langPop {
          0%   { transform: scale(0.94); opacity: 0.5; }
          100% { transform: scale(1);    opacity: 1; }
        }

        * { scrollbar-width: thin; scrollbar-color: var(--border2) transparent; }

        @media (max-width: 720px) {
          .header { padding: 0 14px; }
          .chat-layout { padding: 0 14px; }
          .lang-btn { padding: 4px 7px; font-size: 11px; }
          .nav-pill { padding: 6px 10px; font-size: 12px; }
          .bubble { max-width: 88%; }
          .loc-pill { display: none; }
        }
      `}</style>

      <div className="app-shell">
        {/* ── HEADER ── */}
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="logo">
              <div className="logo-icon">🚦</div>
              DriveLegal<span className="logo-badge">AI</span>
            </div>
            {/* Location pill */}
            <div className={`loc-pill${location.status === "detected" ? " detected" : ""}`}>
              <span className={location.status === "detecting" ? "loc-spin" : ""}>{locIcon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{locLabel}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="header-nav">
              <span className="nav-pill active">💬 {t.bot}</span>
              <Link href="/challan" style={{ textDecoration: "none" }}>
                <span className="nav-pill">📄 {t.challan}</span>
              </Link>
              <Link href="/map" style={{ textDecoration: "none" }}>
                <span className="nav-pill">🗺️ {t.heatmap}</span>
              </Link>
            </div>
            <div className="lang-row">
              {LANGS.map((l) => (
                <button
                  key={l.value}
                  className={`lang-btn${language === l.value ? " active" : ""}`}
                  onClick={() => setLanguage(l.value as Language)}
                  title={l.full}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── CHAT ── */}
        <main className="chat-layout">
          <div className="messages-area">
            {messages.length === 0 && !loading && (
              <div className="welcome" key={language}>
                <div className="welcome-icon">🚦</div>
                <h2>{t.welcomeTitle}</h2>
                <p>{t.welcomeSubtitle}</p>
                <div className="stat-row">
                  {[
                    { label: t.lawsCovered, value: "500+" },
                    { label: t.states, value: "28+" },
                    { label: t.languages, value: "5" },
                  ].map((s) => (
                    <div className="stat-card" key={s.label}>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="suggestions">
                  {t.suggestions.map((q) => (
                    <button
                      key={q}
                      className="suggestion-chip"
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    >{q}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={msg.animKey ?? i} className={`message-row ${msg.role}`}>
                <div className={`avatar ${msg.role}`}>
                  {msg.role === "user" ? "U" : "🚦"}
                </div>
                <div className={`bubble ${msg.role}`} style={{ whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="typing-row">
                <div className="avatar bot">🚦</div>
                <div className="typing-bubble">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT ── */}
          <div className="input-area">
            <div className="input-box">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label={t.send}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L14 8M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="input-hint">{t.hint}</p>
          </div>
        </main>
      </div>
    </>
  );
}