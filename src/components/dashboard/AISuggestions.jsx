import Card from "../ui/Card";
import Badge from "../ui/Badge";
import C from "../../constants/colors";

function AISuggestions({ nav }) {
  const suggestions = [
    { icon: "🐙", title: "Add a GitHub link", desc: "Connect your repository to boost credibility.", points: "+5 points", color: C.indigo[400], to: "#portfolio" },
    { icon: "🎓", title: "Add certification", desc: "Add a relevant cert to strengthen your profile.", points: "+3 points", color: C.violet[400], to: "#profile-form" },
    { icon: "✏️", title: "Update project descriptions", desc: "Add impact metrics to project write-ups.", points: "+2 points", color: C.teal[400], to: "#portfolio" },
  ];
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 16 }}>AI Suggestions to Boost Your Score</h3>
      {suggestions.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < suggestions.length - 1 ? "1px solid #F1F5F9" : "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{s.title}</span>
              <Badge color="teal">{s.points}</Badge>
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{s.desc}</div>
            <button onClick={() => nav(s.to)} style={{ marginTop: 6, background: "none", border: "none", color: C.indigo[600], fontWeight: 600, fontSize: 12, cursor: "pointer", padding: 0 }}>Do this →</button>
          </div>
        </div>
      ))}
    </Card>
  );
}

export default AISuggestions;