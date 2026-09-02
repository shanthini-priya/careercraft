import C from "../../constants/colors";
import Badge from "../ui/Badge";

function HowItWorks() {
  const steps = [
    { n: "01", icon: "💬", title: "Tell the AI about yourself", desc: "Start a conversation. Share your skills, projects, and career goals — as casually as you like." },
    { n: "02", icon: "🧠", title: "AI understands and enriches", desc: "The AI analyzes your input, identifies gaps, asks follow-up questions, and enhances every detail." },
    { n: "03", icon: "⚡", title: "Your complete identity is generated", desc: "Portfolio, resume, LinkedIn content, GitHub README, and cover letter — all created at once." },
    { n: "04", icon: "🚀", title: "Publish, share, and improve", desc: "Get a public portfolio link. Use AI commands to refine it anytime. Track your portfolio score over time." },
  ];
  return (
    <section id="how" style={{ padding: "80px 24px", background: "#F8FAFC" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Badge color="teal">The process</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", marginTop: 12 }}>Four steps to your professional identity</h2>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 40, left: "10%", right: "10%", height: 2, background: "linear-gradient(90deg, #E2E8F0, #6472E8, #9B7FE8, #22C89A)", borderRadius: 2, zIndex: 0 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative", zIndex: 1 }}>
            {steps.map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[50]}, ${C.violet[50]})`, border: `2px solid ${C.indigo[100]}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: "0 4px 16px rgba(99,114,232,0.12)" }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.indigo[400], marginBottom: 6, letterSpacing: 1 }}>{s.n}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
