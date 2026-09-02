import { useState } from "react";
import C from "../../constants/colors";

function EnhancedSidebar({ nav, route, collapsed, onToggle }) {
  const groups = [
    { label: "MAIN", items: [
      ["#dashboard", "🏠", "Dashboard"],
      ["#profile-form", "👤", "My Profile"],
      ["#ai-assistant", "✨", "AI Builder"],
      ["#portfolio", "💼", "Portfolio"],
      ["#documents", "📄", "Documents"],
      ["#career-match", "🎯", "Career Match"],
      ["#score", "📊", "My Score"],
      ["#feedback", "⭐", "Feedback"],
    ]},
    { label: "SETTINGS", items: [
      ["#settings", "⚙️", "Settings"],
    ]},
  ];
  const width = collapsed ? 64 : 240;
  return (
    <aside style={{
      width, height: "100vh", background: "#0F172A", padding: 0,
      position: "fixed", top: 0, left: 0, zIndex: 50,
      display: "flex", flexDirection: "column", overflow: "hidden",
      transition: "width 0.25s ease",
    }}>
      {/* Logo row + collapse toggle */}
      <div style={{ padding: "14px 12px", display: "flex", alignItems: "center", gap: 10, height: 64, borderBottom: "1px solid #1E293B" }}>
        {!collapsed && (
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo[400]}, ${C.violet[400]}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>C</span>
            <svg style={{ position: "absolute", top: -2, right: -2 }} width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L5.6 3.4 L9 4 L5.6 4.6 L5 8 L4.4 4.6 L1 4 L4.4 3.4 Z" fill="#FBBF24"/>
            </svg>
          </div>
        )}
        {collapsed && (
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo[400]}, ${C.violet[400]}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", flexShrink: 0, position: "relative" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>C</span>
            <svg style={{ position: "absolute", top: -2, right: -2 }} width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L5.6 3.4 L9 4 L5.6 4.6 L5 8 L4.4 4.6 L1 4 L4.4 3.4 Z" fill="#FBBF24"/>
            </svg>
          </div>
        )}
        {!collapsed && <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden" }}>CareerCraft</span>}
        <button onClick={onToggle} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 20, flexShrink: 0 }}>
          {collapsed ? "☰" : "≣"}
        </button>
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
        {groups.map(g => (
          <div key={g.label} style={{ marginBottom: 10 }}>
            {!collapsed && (
              <div style={{ padding: "8px 20px 6px", fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1.2 }}>{g.label}</div>
            )}
            {g.items.map(([to, icon, label]) => {
              const active = route === to;
              const showDot = (to === "#ai-assistant" || to === "#score");
              return (
                <a key={to} href={to} onClick={e => { e.preventDefault(); nav(to); }} title={label} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "12px 0" : "10px 20px",
                  color: active ? "#fff" : "#94A3B8", textDecoration: "none", fontSize: 14,
                  fontWeight: active ? 600 : 400, background: active ? "rgba(99,114,232,0.2)" : "transparent",
                  borderLeft: active ? `3px solid ${C.indigo[400]}` : "3px solid transparent",
                  transition: "all 0.15s", justifyContent: collapsed ? "center" : "flex-start",
                  position: "relative", whiteSpace: "nowrap",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  {!collapsed && <span style={{ overflow: "hidden" }}>{label}</span>}
                  {!collapsed && showDot && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", position: "absolute", left: 228, top: 16 }}/>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </div>

      {/* Upgrade to Pro */}
      {!collapsed && (
        <div style={{ margin: "10px 14px", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg, #6472E8, #9B7FE8)", color: "#fff" }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Upgrade to Pro</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 10 }}>Unlock unlimited AI generations & advanced analytics.</div>
          <button onClick={() => nav("#settings")} style={{ width: "100%", padding: "8px", borderRadius: 8, background: "#fff", color: C.indigo[600], fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}>Go Pro →</button>
        </div>
      )}

      {/* User card */}
      <div style={{ padding: collapsed ? "12px 0" : "14px 20px", borderTop: "1px solid #1E293B" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[400]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>AJ</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#22C55E", border: "2px solid #0F172A" }}/>
          </div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Alex Johnson</div>
                <div style={{ color: "#64748B", fontSize: 11, whiteSpace: "nowrap" }}>CSE Student</div>
              </div>
              <button onClick={() => nav("#home")} title="Sign out" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #1E293B", color: "#94A3B8", fontSize: 13, cursor: "pointer", padding: "6px 8px", borderRadius: 8, flexShrink: 0 }}>
                ⎋
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

export default EnhancedSidebar;