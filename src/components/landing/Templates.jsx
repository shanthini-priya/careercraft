import { useState } from "react";
import C from "../../constants/colors";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

function Templates() {
  const [active, setActive] = useState(0);
  const templates = [
    { name: "Modern Developer", tag: "For developers", icon: "💻", bg: "#0F172A", accent: "#6472E8", sample: "dark" },
    { name: "Professional", tag: "For job seekers", icon: "👔", bg: "#1E3A5F", accent: "#38BDF8", sample: "corp" },
    { name: "Creative", tag: "For designers", icon: "🎨", bg: "#4C1D95", accent: "#F472B6", sample: "creative" },
    { name: "Minimal", tag: "For everyone", icon: "⬜", bg: "#F8FAFC", accent: "#374151", sample: "minimal" },
    { name: "Student", tag: "For freshers", icon: "🎓", bg: "#064E3B", accent: "#34D399", sample: "student" },
  ];
  const t = templates[active];
  return (
    <section id="templates" style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Badge color="violet">Templates</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", marginTop: 12 }}>Five portfolio themes</h2>
          <p style={{ fontSize: 16, color: "#64748B", marginTop: 10 }}>AI recommends the right one based on your career goal. You can switch anytime.</p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
          {templates.map((tp, i) => (
            <button key={tp.name} onClick={() => setActive(i)} style={{
              padding: "8px 18px", borderRadius: 999, border: `1.5px solid ${i === active ? C.indigo[600] : "#E2E8F0"}`,
              background: i === active ? C.indigo[50] : "#fff",
              color: i === active ? C.indigo[600] : "#64748B",
              fontWeight: i === active ? 600 : 400, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}>
              <span>{tp.icon}</span> {tp.name}
            </button>
          ))}
        </div>
        <div style={{
          borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
          border: "1px solid #E2E8F0", maxWidth: 700, margin: "0 auto",
        }}>
          <div style={{ background: t.bg, padding: "40px 36px", minHeight: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: t.accent, opacity: 0.3 }}/>
              <div>
                <div style={{ height: 14, width: 140, background: t.accent, borderRadius: 7, opacity: 0.7, marginBottom: 8 }}/>
                <div style={{ height: 10, width: 100, background: "#fff", borderRadius: 5, opacity: 0.2 }}/>
              </div>
            </div>
            <div style={{ height: 10, width: "80%", background: "#fff", borderRadius: 5, opacity: 0.15, marginBottom: 8 }}/>
            <div style={{ height: 10, width: "65%", background: "#fff", borderRadius: 5, opacity: 0.12, marginBottom: 28 }}/>
            <div style={{ display: "flex", gap: 10 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ flex: 1, height: 80, borderRadius: 10, background: t.accent, opacity: 0.15 }}/>
              ))}
            </div>
          </div>
          <div style={{ background: "#fff", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#0F172A" }}>{t.name}</span>
              <span style={{ fontSize: 13, color: "#94A3B8", marginLeft: 10 }}>{t.tag}</span>
            </div>
            <Badge color="indigo">AI recommended</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Templates;
