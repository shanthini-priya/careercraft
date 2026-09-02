import C from "../../constants/colors";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

function BeforeAfter() {
  const before = [
    "Multiple platforms, multiple forms",
    "Manual writing — hours of effort",
    "Generic, templated content",
    "No recruiter-perspective feedback",
    "Resume and portfolio made separately",
    "No idea how strong your profile is",
  ];
  const after = [
    "One conversation, everything generated",
    "AI-enhanced content in 30 seconds",
    "Personalized for your role and field",
    "Recruiter simulation with real feedback",
    "Resume, LinkedIn, GitHub README included",
    "Portfolio score with improvement tips",
  ];
  return (
    <section style={{ background: "#F8FAFC", padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge color="coral">Why CareerCraft?</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", marginTop: 12 }}>The old way vs the new way</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <Card style={{ background: "#FFF5F5" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#DC2626", marginBottom: 18 }}>❌ Before</div>
            {before.map(t => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ color: "#DC2626", fontSize: 16, marginTop: 1 }}>✕</span>
                <span style={{ fontSize: 14, color: "#64748B", lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </Card>
          <Card style={{ background: "#F0FDF4" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#16A34A", marginBottom: 18 }}>✓ After</div>
            {after.map(t => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ color: "#16A34A", fontSize: 16, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </section>
  );
}

export default BeforeAfter;
