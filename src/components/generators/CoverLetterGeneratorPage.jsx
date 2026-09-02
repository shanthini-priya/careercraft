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

function CoverLetterGeneratorPage() {
  const [input, setInput] = useState({ company: "", jobTitle: "", description: "", name: "Alex Johnson" });
  const [generated, setGenerated] = useState(false);
  const set = (k) => (e) => setInput(p => ({ ...p, [k]: e.target.value }));

  const letter = input.description
    ? `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${input.jobTitle || "Software Developer"} position at ${input.company || "your company"}. As a passionate developer with a track record of building impactful web applications, I am excited about the opportunity to contribute to your team.\n\nWhy This Company:\nI admire ${input.company || "your company"} for its innovative approach and am eager to bring my technical skills and drive to your mission.\n\nWhat I Bring:\nBased on the job description (${input.description.slice(0, 80)}...), I bring relevant experience in modern web development, strong problem-solving skills, and a collaborative mindset that fits your culture.\n\nI would welcome the opportunity to discuss how my background aligns with your needs. Thank you for your time and consideration.\n\nSincerely,\n${input.name || "Alex Johnson"}` : "";

  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) {} };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 800 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, marginBottom: 4 }}>Cover Letter Generator</h1>
      <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 0, marginBottom: 24 }}>Create a personalized cover letter from a job description.</p>

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 16 }}>Job Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Company Name</label>
            <input style={fieldStyle} value={input.company} onChange={set("company")}/>
          </div>
          <div>
            <label style={labelStyle}>Job Title</label>
            <input style={fieldStyle} value={input.jobTitle} onChange={set("jobTitle")}/>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Job Description</label>
          <textarea style={{ ...fieldStyle, minHeight: 100 }} placeholder="Paste the job description here…" value={input.description} onChange={set("description")}/>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Your Name</label>
          <input style={fieldStyle} value={input.name} onChange={set("name")}/>
        </div>
        <Btn onClick={() => setGenerated(true)}>✨ Generate Cover Letter</Btn>
      </Card>

      {generated && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Badge color="teal">Generated Letter</Badge>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" small onClick={() => copy(letter)}>📋 Copy</Btn>
              <Btn variant="outline" small onClick={() => alert("Download started (simulated)")}>⬇ Download</Btn>
            </div>
          </div>
          <div style={{ background: "#E2E8F0", borderRadius: 12, padding: 28 }}>
            <div style={{ background: "#fff", borderRadius: 4, padding: "36px 40px", boxShadow: "0 6px 24px rgba(0,0,0,0.08)", whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.7, color: "#1E293B", minHeight: 400 }}>
              {letter}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverLetterGeneratorPage;