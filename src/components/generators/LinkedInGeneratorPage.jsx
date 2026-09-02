import { useState } from "react";
import C from "../../constants/colors";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";

const fieldStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
  fontSize: 14, boxSizing: "border-box", outline: "none", background: "#fff",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };

function LinkedInGeneratorPage() {
  const [input, setInput] = useState({
    role: "Full Stack Developer",
    years: "2",
    skills: "React, Node.js, Python",
    goal: "Land a full-time developer role at a product company",
  });
  const [generated, setGenerated] = useState(false);

  const output = {
    headline: `Full Stack Developer | Building Scalable Web Apps with React & Node.js | Passionate About Clean Code`,
    about: `I'm a Full Stack Developer with ${input.years || "2"} years of experience turning complex problems into elegant, user-friendly solutions. My core stack includes ${input.skills}. I focus on performance, clean architecture, and delivering measurable business impact. My career goal: ${input.goal}.`,
    exp1: `• Architected and shipped 5+ full-stack applications using React, Node.js, and cloud infrastructure, improving user engagement by 35%\n• Optimized database queries and API responses, reducing average load time by 40%`,
    exp2: `• Collaborated with designers and PMs to translate requirements into production-ready features\n• Introduced automated testing, boosting release confidence and cutting bugs by 25%`,
    featured: `1. Portfolio Website (React)\n2. E-commerce Platform (Node.js + MongoDB)\n3. Real-time Chat App (Socket.io, Redis)`,
  };

  const set = (k) => (e) => setInput(p => ({ ...p, [k]: e.target.value }));
  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) {} };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, marginBottom: 4 }}>LinkedIn Content Generator</h1>
      <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 0, marginBottom: 24 }}>Generate a professional LinkedIn presence from a few inputs.</p>

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 16 }}>Your Input</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Current Role</label>
            <input style={fieldStyle} value={input.role} onChange={set("role")}/>
          </div>
          <div>
            <label style={labelStyle}>Years of Experience</label>
            <input style={fieldStyle} value={input.years} onChange={set("years")}/>
          </div>
          <div>
            <label style={labelStyle}>Skills (comma-separated)</label>
            <input style={fieldStyle} value={input.skills} onChange={set("skills")}/>
          </div>
          <div>
            <label style={labelStyle}>Career Goal</label>
            <input style={fieldStyle} value={input.goal} onChange={set("goal")}/>
          </div>
        </div>
        <button onClick={() => setGenerated(true)} style={{ marginTop: 16, padding: "12px 28px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>✨ Generate All</button>
      </Card>

      {generated && (
        <>
          {[
            ["💼", "Professional Headline", output.headline],
            ["📝", "About Section", output.about],
            ["🏢", "Experience Descriptions", output.exp1 + "\n\n" + output.exp2],
            ["⭐", "Featured Section Suggestions", output.featured],
          ].map(([icon, title, text], i) => (
            <Card key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", margin: 0 }}>{icon} {title}</h3>
                <button onClick={() => copy(text)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid " + C.indigo[400], background: C.indigo[50], color: C.indigo[600], fontSize: 12, cursor: "pointer", fontWeight: 600 }}>📋 Copy</button>
              </div>
              <textarea style={{ ...fieldStyle, minHeight: 90, whiteSpace: "pre-wrap" }} defaultValue={text}/>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

export default LinkedInGeneratorPage;