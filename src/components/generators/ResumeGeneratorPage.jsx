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

function ResumeGeneratorPage() {
  const [data, setData] = useState({
    name: "Alex Johnson",
    title: "Full Stack Developer",
    email: "alex@example.com",
    phone: "+1 555 123 4567",
    summary: "Results-driven Full Stack Developer with 2+ years of experience building scalable web applications using React, Node.js, and cloud technologies.",
    experience: "Software Developer Intern, TechCorp (2022-2023) — Built REST APIs and improved query performance by 40%.\nFrontend Developer, Freelance (2021-2022) — Delivered 10+ responsive websites for clients.",
    education: "B.Tech in Computer Science, Example University (2021-2025)",
    skills: "React, JavaScript, TypeScript, Node.js, Python, SQL, Docker, Git",
  });
  const set = (k) => (e) => setData(p => ({ ...p, [k]: e.target.value }));

  const generateWithAI = () => {
    setData(p => ({
      ...p,
      summary: "Innovative Full Stack Developer with 2+ years of experience architecting and delivering high-performance web applications. Proven track record of improving system efficiency by 40% through optimized database queries and modern frontend frameworks. Adept at collaborating with cross-functional teams to translate complex requirements into production-ready solutions.",
    }));
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0 }}>Resume Generator</h1>
          <p style={{ color: "#94A3B8", fontSize: 14, margin: 0 }}>Create an ATS-optimized resume with live preview.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small onClick={() => alert("Resume downloaded (simulated)")}>⬇ Download as PDF</Btn>
          <Btn onClick={generateWithAI}>✨ Generate with AI</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Left: form */}
        <div>
          <Card>
            <label style={labelStyle}>Full Name</label>
            <input style={{ ...fieldStyle, marginBottom: 12 }} value={data.name} onChange={set("name")}/>
            <label style={labelStyle}>Professional Title</label>
            <input style={{ ...fieldStyle, marginBottom: 12 }} value={data.title} onChange={set("title")}/>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Email</label>
                <input style={fieldStyle} value={data.email} onChange={set("email")}/>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Phone</label>
                <input style={fieldStyle} value={data.phone} onChange={set("phone")}/>
              </div>
            </div>
            <label style={labelStyle}>Professional Summary</label>
            <textarea style={{ ...fieldStyle, minHeight: 90, marginBottom: 12 }} value={data.summary} onChange={set("summary")}/>
            <label style={labelStyle}>Experience</label>
            <textarea style={{ ...fieldStyle, minHeight: 120, marginBottom: 12 }} value={data.experience} onChange={set("experience")}/>
            <label style={labelStyle}>Education</label>
            <input style={{ ...fieldStyle, marginBottom: 12 }} value={data.education} onChange={set("education")}/>
            <label style={labelStyle}>Skills</label>
            <input style={fieldStyle} value={data.skills} onChange={set("skills")}/>
          </Card>
        </div>

        {/* Right: live resume preview */}
        <div>
          <Badge color="teal">Live Preview</Badge>
          <div style={{ background: "#E2E8F0", borderRadius: 16, padding: 32, marginTop: 10 }}>
            <div style={{ background: "#fff", borderRadius: 4, padding: "40px 36px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", minHeight: 480 }}>
              <div style={{ textAlign: "center", borderBottom: "2px solid #1E293B", paddingBottom: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>{data.name}</div>
                <div style={{ fontSize: 14, color: C.indigo[600], fontWeight: 600, marginTop: 4 }}>{data.title}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>{data.email} · {data.phone}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.indigo[600], letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Summary</div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{data.summary}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.indigo[600], letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Experience</div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{data.experience}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.indigo[600], letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Education</div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{data.education}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.indigo[600], letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Skills</div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{data.skills}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeGeneratorPage;