import C from "../../constants/colors";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

function Features() {
  const features = [
    {
      icon: "🤖", color: "indigo", title: "Conversational onboarding",
      desc: "Talk to the AI instead of filling a form. It asks smart follow-up questions and builds your profile progressively.",
    },
    {
      icon: "✨", color: "violet", title: "AI content enhancement",
      desc: "\"Made a website\" becomes a polished, recruiter-ready project description with impact and metrics.",
    },
    {
      icon: "🎨", color: "teal", title: "Smart design matching",
      desc: "The system recommends a portfolio design based on your role — developer, designer, data scientist, student.",
    },
    {
      icon: "📊", color: "amber", title: "Portfolio score 0–100",
      desc: "Get an objective score across profile completeness, keyword density, recruiter readability, and project quality.",
    },
    {
      icon: "👔", color: "coral", title: "Recruiter simulation",
      desc: "See your portfolio through a recruiter's eyes. Get specific feedback on strengths, gaps, and first impression.",
    },
    {
      icon: "💬", color: "violet", title: "Natural-language editing",
      desc: "\"Make my portfolio more professional\" or \"Highlight my strongest project\" — the AI applies the changes.",
    },
  ];
  return (
    <section id="features" style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Badge color="indigo">What you get</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", marginTop: 12 }}>Seven innovations in one tool</h2>
          <p style={{ fontSize: 16, color: "#64748B", marginTop: 10 }}>Not just a portfolio builder — a complete AI career system.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {features.map(f => (
            <Card key={f.title} style={{ borderTop: `3px solid ${C[f.color]?.[400] || C.indigo[400]}` }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
