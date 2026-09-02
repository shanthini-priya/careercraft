import C from "../../constants/colors";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

function Testimonials() {
  const testi = [
    { name: "Arjun M.", role: "CS Final Year → Placed at TCS", quote: "I had zero idea how to write a portfolio. In 20 minutes I had a complete profile, resume, and LinkedIn. Got an interview call within a week.", avatar: "AM" },
    { name: "Priya S.", role: "Fresher → Frontend Dev at startup", quote: "The recruiter simulation feature was eye-opening. It told me exactly what was weak. I fixed those gaps and my response rate tripled.", avatar: "PS" },
    { name: "Rahul K.", role: "CS Student → Internship secured", quote: "The AI turned my basic project descriptions into something that sounds genuinely impressive. My projects were the same — the words just became professional.", avatar: "RK" },
  ];
  return (
    <section style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge color="teal">Success stories</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", marginTop: 12 }}>Students who got hired</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {testi.map(t => (
            <Card key={t.name} style={{ position: "relative" }}>
              <div style={{ fontSize: 36, color: C.indigo[100], fontFamily: "Georgia", position: "absolute", top: 16, right: 20, lineHeight: 1 }}>"</div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[400]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
