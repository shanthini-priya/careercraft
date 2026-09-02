import Card from "../ui/Card";
import C from "../../constants/colors";

function ActivityFeed({ nav }) {
  const items = [
    { icon: "📈", color: C.teal[50], text: "Portfolio score increased to 82", time: "2 min ago" },
    { icon: "📄", color: C.indigo[50], text: "Resume generated", time: "1 hr ago" },
    { icon: "👤", color: C.violet[50], text: "Profile updated", time: "3 hrs ago" },
    { icon: "💼", color: C.amber[50], text: "LinkedIn content created", time: "Yesterday" },
    { icon: "🐙", color: C.coral[50], text: "GitHub README optimized", time: "2 days ago" },
  ];
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 16 }}>Recent Activity</h3>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < items.length - 1 ? "1px solid #F1F5F9" : "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: it.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{it.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#374151" }}>{it.text}</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{it.time}</div>
          </div>
        </div>
      ))}
      <button onClick={() => nav("#portfolio")} style={{ marginTop: 12, width: "100%", padding: "9px", borderRadius: 8, background: C.indigo[50], color: C.indigo[600], fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
        View all activity
      </button>
    </Card>
  );
}

export default ActivityFeed;