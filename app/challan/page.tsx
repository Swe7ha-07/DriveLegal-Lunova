"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Violation = { label: string; fine: number; icon: string };
type Challan = { id: number; country: string; state: string; violations: Violation[]; total: number; date: string };

const DATA: Record<string, string[]> = {
  India: ["Tamil Nadu", "Kerala", "Karnataka", "Delhi", "Maharashtra"],
  USA: ["California", "Texas", "New York"],
  UAE: ["Dubai", "Abu Dhabi"],
};

const VIOLATIONS: Violation[] = [
  { label: "No Helmet", fine: 1000, icon: "⛑️" },
  { label: "No Seatbelt", fine: 1000, icon: "🪢" },
  { label: "Signal Jumping", fine: 5000, icon: "🚦" },
  { label: "Overspeeding", fine: 2000, icon: "💨" },
  { label: "Mobile Usage", fine: 5000, icon: "📱" },
  { label: "Drunk Driving", fine: 10000, icon: "🍺" },
  { label: "Wrong Parking", fine: 1000, icon: "🅿️" },
];

export default function ChallanPage() {
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Tamil Nadu");
  const [selected, setSelected] = useState<Violation[]>([]);
  const [history, setHistory] = useState<Challan[]>([]);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("challan_history");
    if (data) setHistory(JSON.parse(data));
  }, []);

  const toggle = (v: Violation) => {
    const exists = selected.find((x) => x.label === v.label);
    setSelected(exists ? selected.filter((x) => x.label !== v.label) : [...selected, v]);
    setGenerated(false);
  };

  const total = selected.reduce((sum, v) => sum + v.fine, 0);

  const generate = () => {
    const newChallan: Challan = {
      id: Date.now(), country, state, violations: selected, total,
      date: new Date().toLocaleString(),
    };
    const updated = [newChallan, ...history];
    setHistory(updated);
    localStorage.setItem("challan_history", JSON.stringify(updated));
    setSelected([]);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  const download = () => {
    const text = `🚦 DriveLegal Challan\n\nLocation: ${country} > ${state}\n\nViolations:\n${selected.map((v) => `- ${v.label} (₹${v.fine})`).join("\n")}\n\nTotal Fine: ₹${total}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "challan.txt"; a.click();
  };

  const clearHistory = () => {
    if (!confirm("Clear all challan history?")) return;
    localStorage.removeItem("challan_history");
    setHistory([]);
  };

  const getSeverityColor = (fine: number) => {
    if (fine >= 10000) return { bg: "rgba(255,40,40,0.12)", border: "rgba(255,40,40,0.25)", text: "#ff6060", badge: "rgba(255,40,40,0.15)", badgeText: "#ff8080" };
    if (fine >= 5000) return { bg: "rgba(255,140,0,0.10)", border: "rgba(255,140,0,0.22)", text: "#ffaa40", badge: "rgba(255,140,0,0.15)", badgeText: "#ffbb66" };
    return { bg: "rgba(232,255,71,0.06)", border: "rgba(232,255,71,0.15)", text: "#c8dd30", badge: "rgba(232,255,71,0.1)", badgeText: "#d8ec40" };
  };

  return (
    <>
      <style>{`
        @import url('<link href="https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet">');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0a0f;
          --bg2: #111118;
          --surface: #1e1e28;
          --surface2: #252530;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.12);
          --accent: #e8ff47;
          --text: #f0f0f5;
          --muted: #888899;
          --muted2: #444455;
        }

        html, body { min-height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

        .page-wrap {
          max-width: 880px; margin: 0 auto; padding: 0 24px 120px;
        }

        /* ── HEADER ── */
        .top-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 0 24px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 32px;
          position: sticky; top: 0; z-index: 40;
          background: var(--bg);
        }

        .page-logo {
          .page-logo {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  letter-spacing: -0.5px;
}
        }

        .logo-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .logo-badge { font-size: 10px; font-weight: 600; background: var(--accent); color: #000; border-radius: 4px; padding: 2px 6px; font-family: 'DM Sans', sans-serif; }

        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          padding: 7px 14px; border-radius: 20px; border: 1px solid var(--border2);
          background: var(--surface2); color: var(--muted); font-size: 13px;
          text-decoration: none; transition: all 0.15s;
        }
        .nav-link:hover { color: var(--text); }

        /* ── SECTION TITLES ── */
        .section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.8px; text-transform: uppercase; color: var(--muted);
        }

        /* ── LOCATION ROW ── */
        .location-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px;
        }

        .select-wrap {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: 12px; padding: 0 16px; display: flex; align-items: center; gap: 10px;
          transition: border-color 0.15s;
        }
        .select-wrap:focus-within { border-color: rgba(232,255,71,0.35); }
        .select-label { font-size: 11px; color: var(--muted); letter-spacing: 0.3px; flex-shrink: 0; }
        .select-wrap select {
          flex: 1; background: transparent; border: none; outline: none; padding: 14px 0;
          color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer;
        }
        .select-wrap select option { background: #1e1e28; }

        /* ── VIOLATIONS GRID ── */
        .violations-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px;
          margin-bottom: 32px;
        }

        .violation-card {
          padding: 14px 16px; border-radius: 12px; cursor: pointer;
          border: 1px solid var(--border); background: var(--surface2);
          transition: all 0.18s ease; position: relative; overflow: hidden;
        }
        .violation-card:hover { border-color: var(--border2); transform: translateY(-1px); }
        .violation-card.selected { transform: translateY(-2px); }

        .v-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .v-icon { font-size: 20px; }
        .v-check {
          width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; font-size: 11px;
        }
        .v-check.on { background: var(--accent); border-color: var(--accent); color: #000; }

        .v-name { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 4px; }
        .v-fine { font-size: 12px; font-family: 'DM Mono', monospace; }

        /* ── SUMMARY CARD ── */
        .summary-card {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: 16px; padding: 24px; margin-bottom: 32px;
        }

        .selected-list { margin: 16px 0; }
        .selected-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid var(--border);
        }
        .selected-item:last-child { border-bottom: none; }
        .si-name { font-size: 14px; color: var(--text); display: flex; align-items: center; gap: 8px; }
        .si-fine { font-size: 14px; font-family: 'DM Mono', monospace; font-weight: 500; }

        .total-row {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 16px; margin-top: 8px; border-top: 1px solid var(--border2);
        }
        .total-label { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: var(--text); }
        .total-amount {
          font-family: 'DM Mono', monospace; font-size: 24px; font-weight: 500;
          color: var(--accent); letter-spacing: -0.5px;
        }

        /* ── ACTION BUTTONS ── */
        .action-row { display: flex; gap: 10px; }

        .btn {
          padding: 13px 22px; border-radius: 10px; font-size: 14px; font-weight: 500;
          cursor: pointer; border: none; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 7px;
        }

        .btn-primary {
          background: var(--accent); color: #000; flex: 1;
        }
        .btn-primary:hover { background: #d4eb3c; transform: translateY(-1px); }
        .btn-primary:active { transform: scale(0.98); }
        .btn-primary:disabled { background: var(--muted2); color: var(--muted); cursor: not-allowed; transform: none; }

        .btn-secondary {
          background: var(--surface2); color: var(--text);
          border: 1px solid var(--border2);
        }
        .btn-secondary:hover { background: var(--surface); border-color: rgba(255,255,255,0.2); }
        .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── SUCCESS TOAST ── */
        .toast {
          position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px);
          background: var(--accent); color: #000; padding: 12px 20px; border-radius: 24px;
          font-size: 14px; font-weight: 600; z-index: 100;
          opacity: 0; transition: all 0.3s ease; pointer-events: none;
          white-space: nowrap;
        }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* ── HISTORY ── */
        .history-grid { display: flex; flex-direction: column; gap: 10px; }

        .history-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 16px 20px;
          transition: border-color 0.15s;
        }
        .history-card:hover { border-color: var(--border2); }

        .h-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .h-location { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--text); }
        .h-amount { font-family: 'DM Mono', monospace; font-size: 15px; font-weight: 500; }
        .h-meta { font-size: 11px; color: var(--muted); }

        .h-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
        .h-tag {
          font-size: 11px; padding: 3px 8px; border-radius: 4px;
          background: var(--surface2); color: var(--muted); font-weight: 500;
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          padding: 40px; text-align: center; border: 1px dashed var(--border2);
          border-radius: 16px; color: var(--muted); font-size: 14px;
        }

        /* ── FLOATING CLEAR ── */
        .fab-clear {
          position: fixed; bottom: 24px; right: 24px;
          padding: 12px 18px; border-radius: 24px; border: none;
          background: rgba(255,40,40,0.12); color: #ff6060;
          border: 1px solid rgba(255,40,40,0.25);
          font-size: 13px; font-weight: 500; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s; backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .fab-clear:hover { background: rgba(255,40,40,0.2); color: #ff8080; transform: translateY(-2px); }

        @media (max-width: 600px) {
          .page-wrap { padding: 0 14px 120px; }
          .location-row { grid-template-columns: 1fr; }
          .violations-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="page-wrap">
        {/* ── TOP BAR ── */}
        <div className="top-bar">
          <div className="page-logo">
            <div className="logo-icon">🚦</div>
            DriveLegal
            <span className="logo-badge">AI</span>
          </div>
          <div className="nav-links">
            <Link href="/" className="nav-link">💬 Chat</Link>
            <Link href="/map" className="nav-link">🗺️ Map</Link>
          </div>
        </div>

        {/* ── PAGE TITLE ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: -0.5, color: "var(--text)", marginBottom: 6 }}>
            📄 Challan Generator
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Select violations, calculate fines, and generate official challans
          </p>
        </div>

        {/* ── LOCATION ── */}
        <div className="section-header">
          <div className="section-title">📍 Location</div>
        </div>
        <div className="location-row">
          <div className="select-wrap">
            <div className="select-label">Country</div>
            <select value={country} onChange={(e) => { setCountry(e.target.value); setState(DATA[e.target.value][0]); }}>
              {Object.keys(DATA).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="select-wrap">
            <div className="select-label">State</div>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              {DATA[country].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* ── VIOLATIONS ── */}
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">⚠️ Violations</div>
          {selected.length > 0 && (
            <span style={{ fontSize: 12, color: "var(--muted)", background: "var(--surface2)", padding: "3px 10px", borderRadius: 20, border: "1px solid var(--border)" }}>
              {selected.length} selected
            </span>
          )}
        </div>
        <div className="violations-grid">
          {VIOLATIONS.map((v) => {
            const isSelected = !!selected.find((x) => x.label === v.label);
            const colors = getSeverityColor(v.fine);
            return (
              <div
                key={v.label}
                className={`violation-card${isSelected ? " selected" : ""}`}
                onClick={() => toggle(v)}
                style={isSelected ? { background: colors.bg, borderColor: colors.border } : {}}
              >
                <div className="v-top">
                  <span className="v-icon">{v.icon}</span>
                  <div className={`v-check${isSelected ? " on" : ""}`}>
                    {isSelected && "✓"}
                  </div>
                </div>
                <div className="v-name">{v.label}</div>
                <div className="v-fine" style={{ color: isSelected ? colors.text : "var(--muted)" }}>
                  ₹{v.fine.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SUMMARY ── */}
        {selected.length > 0 && (
          <div>
            <div className="section-header">
              <div className="section-title">🧾 Summary</div>
            </div>
            <div className="summary-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--surface2)", borderRadius: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>📍</span>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{country} · {state}</span>
              </div>

              <div className="selected-list">
                {selected.map((v) => {
                  const colors = getSeverityColor(v.fine);
                  return (
                    <div className="selected-item" key={v.label}>
                      <div className="si-name">
                        <span style={{ fontSize: 16 }}>{v.icon}</span>
                        {v.label}
                      </div>
                      <div className="si-fine" style={{ color: colors.text }}>
                        ₹{v.fine.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="total-row">
                <div className="total-label">Total Fine</div>
                <div className="total-amount">₹{total.toLocaleString()}</div>
              </div>
            </div>

            <div className="action-row" style={{ marginBottom: 40 }}>
              <button className="btn btn-primary" onClick={generate} disabled={selected.length === 0}>
                ✅ Generate Challan
              </button>
              <button className="btn btn-secondary" onClick={download} disabled={selected.length === 0}>
                ⬇ Download
              </button>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        <div className="section-header" style={{ marginTop: selected.length === 0 ? 0 : 8 }}>
          <div className="section-title">📜 History</div>
          {history.length > 0 && (
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{history.length} challans</span>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">No challans generated yet</div>
        ) : (
          <div className="history-grid">
            {history.map((h) => (
              <div className="history-card" key={h.id}>
                <div className="h-top">
                  <div className="h-location">📍 {h.country} · {h.state}</div>
                  <div className="h-amount" style={{ color: h.total >= 10000 ? "#ff6060" : h.total >= 5000 ? "#ffaa40" : "var(--accent)" }}>
                    ₹{h.total.toLocaleString()}
                  </div>
                </div>
                <div className="h-meta">{h.date}</div>
                <div className="h-tags">
                  {h.violations.map((v) => (
                    <span key={v.label} className="h-tag">{v.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={`toast${generated ? " show" : ""}`}>✅ Challan generated successfully</div>

      {/* Clear FAB */}
      {history.length > 0 && (
        <button className="fab-clear" onClick={clearHistory}>
          🗑️ Clear History
        </button>
      )}
    </>
  );
}

function getSeverityColor(fine: number) {
  if (fine >= 10000) return { bg: "rgba(255,40,40,0.12)", border: "rgba(255,40,40,0.25)", text: "#ff6060" };
  if (fine >= 5000) return { bg: "rgba(255,140,0,0.10)", border: "rgba(255,140,0,0.22)", text: "#ffaa40" };
  return { bg: "rgba(232,255,71,0.06)", border: "rgba(232,255,71,0.15)", text: "#c8dd30" };
}