import C from "../../constants/colors";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

function GeneratedAssets() {
  const assets = [
    { icon: "🌐", label: "Portfolio", desc: "Published at portfolioai.com/u/you" },
    { icon: "📄", label: "Resume", desc: "ATS-optimized, download-ready PDF" },
    { icon: "💼", label: "LinkedIn", desc: "Headline, About, and Experience copy" },
    { icon: "🐙", label: "GitHub README", desc: "Professional project READMEs" },
    { icon: "✉️", label: "Cover Letter", desc: "Personalized per job and company" },
    { icon: "📊", label: "Portfolio Score", desc: "82/100 with improvement tips" },
  ];
  return (
    <section style={{ padding: "80px 24px", background: `linear-gradient(160deg, ${C.indigo[50]}, #F8F8FF)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Badge color="indigo">Everything included</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", marginTop: 12 }}>Six career assets, one generation</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {assets.map(a => (
            <Card key={a.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{a.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 4 }}>{a.label}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GeneratedAssets;
