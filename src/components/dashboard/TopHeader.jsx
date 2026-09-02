import { useState, useEffect } from "react";
import C from "../../constants/colors";

const ROUTE_TITLES = {
  "#dashboard": "Dashboard", "#portfolio": "Portfolio", "#ai-assistant": "AI Assistant",
  "#resume": "Resume", "#linkedin": "LinkedIn", "#github-readme": "GitHub README",
  "#cover-letter": "Cover Letter", "#score": "Portfolio Score", "#recruiter-sim": "Recruiter Simulation",
  "#templates": "Templates", "#profile-form": "Profile", "#settings": "Settings",
};

function TopHeader({ route, nav }) {
  const [userOpen, setUserOpen] = useState(false);
  const title = ROUTE_TITLES[route] || "Dashboard";
  return (
    <header style={{
      position: "fixed", top: 0, right: 0, left: 240, height: 64, zIndex: 40,
      background: "#fff", borderBottom: "1px solid #E5E7EB",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px",
    }}>
      <div>
        <div style={{ fontSize: 12, color: "#94A3B8" }}>Home / {title}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{title}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#374151" }}>🔍</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#374151", position: "relative" }}>
          🔔
          <span style={{ position: "absolute", top: -4, right: -6, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 5px" }}>3</span>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[400]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }} onClick={() => setUserOpen(o => !o)}>
          AJ
        </div>
        {userOpen && (
          <div style={{ position: "absolute", top: 52, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", border: "1px solid #E5E7EB", width: 180, padding: 8, zIndex: 60 }}>
            {[["👤","Profile","#profile-form"],["⚙️","Settings","#settings"],["⎋","Sign out","#home"]].map(([icon, label, to]) => (
              <div key={label} onClick={() => { setUserOpen(false); nav(to); }} style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, color: "#374151", display: "flex", gap: 10, alignItems: "center" }}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default TopHeader;