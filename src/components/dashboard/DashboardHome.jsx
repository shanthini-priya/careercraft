import Card from "../ui/Card";
import C from "../../constants/colors";

function MetricCard({ label, value, sub, color }) {
  return (
    <Card style={{ textAlign: "left", padding: "20px 22px" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: color || "#0F172A" }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{sub}</div>
    </Card>
  );
}

function DashboardHome({ nav }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const documents = [
    { name: "My Portfolio", type: "Portfolio", updated: "Today", status: "Ready" },
    { name: "LinkedIn Profile", type: "LinkedIn", updated: "Yesterday", status: "Ready" },
    { name: "GitHub README", type: "GitHub", updated: "Yesterday", status: "Ready" },
    { name: "Software Engineer Cover Letter", type: "Cover Letter", updated: "2 days ago", status: "Draft" },
  ];
  const statusColor = { Ready: "#22C55E", Draft: "#F59E0B", "Needs Review": "#EF4444" };
  const statusBg = { Ready: "rgba(34,197,94,0.15)", Draft: "rgba(245,158,11,0.15)", "Needs Review": "rgba(239,68,68,0.15)" };
  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: 0 }}>{greeting}, Shanthini 👋</h1>
          <p style={{ color: "#64748B", marginTop: 6, fontSize: 15, marginBottom: 0 }}>Let's build a stronger professional profile.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, color: "#94A3B8" }}>🔍</span>
          <span style={{ fontSize: 14, color: "#94A3B8" }}>👤</span>
        </div>
      </div>

      {/* Four metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <MetricCard label="Portfolio Score" value={85} sub="Good — improve" color={C.violet[400]}/>
        <MetricCard label="Career Matches" value={4} sub="Roles for you" color={C.indigo[400]}/>
        <MetricCard label="Documents Created" value={8} sub="Assets generated" color={C.cyan[400]}/>
        <MetricCard label="Recruiter Score" value="4.7" sub="Strong profile" color={C.teal[400]}/>
      </div>

      {/* One main action area */}
      <Card style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A", margin: 0, marginBottom: 6 }}>Your profile is 85% ready</h3>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>Add 1 more project to improve your profile.</p>
        </div>
        <button onClick={() => nav("#profile-form")} style={{ padding: "12px 28px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
          Improve My Profile
        </button>
      </Card>

      {/* Recent documents table */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A", margin: 0 }}>Recent Documents</h3>
          <button onClick={() => nav("#portfolio")} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Export
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: "#94A3B8", textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB" }}>Document</th>
                <th style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB" }}>Type</th>
                <th style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB" }}>Updated</th>
                <th style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d, i) => (
                <tr key={i} style={{ borderBottom: i < documents.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                  <td style={{ padding: "12px", color: "#0F172A", fontWeight: 600 }}>{d.name}</td>
                  <td style={{ padding: "12px", color: "#475569" }}>{d.type}</td>
                  <td style={{ padding: "12px", color: "#475569" }}>{d.updated}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: statusBg[d.status], color: statusColor[d.status], fontWeight: 600, fontSize: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[d.status] }}/>{d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Primary action */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => nav("#ai-assistant")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, #EC4899)`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
          ＋ Create with AI
        </button>
      </div>
    </div>
  );
}

export default DashboardHome;
