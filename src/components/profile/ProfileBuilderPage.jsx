import { useState } from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";
import C from "../../constants/colors";

const SUGGESTED_SKILLS = ["React", "Python", "JavaScript", "Node.js", "TypeScript", "Java", "C++", "SQL", "Git", "Docker", "AWS", "MongoDB"];

function StepIndicator({ step }) {
  const steps = ["Personal Info", "Skills", "Projects", "Education"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {steps.map((s, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: done ? C.teal[400] : active ? `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})` : "#E5E7EB",
                color: active || done ? "#fff" : "#94A3B8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14,
              }}>
                {done ? "✓" : idx}
              </div>
              <span style={{ fontSize: 11, color: active ? C.indigo[600] : "#94A3B8", fontWeight: active ? 600 : 400, marginTop: 6 }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: idx < step ? C.teal[400] : "#E5E7EB", margin: "0 10px", marginBottom: 20 }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

const fieldStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
  fontSize: 14, boxSizing: "border-box", outline: "none", background: "#fff",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };

function ProfileBuilderPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", location: "", title: "", bio: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [projects, setProjects] = useState([{ name: "", desc: "", tech: "", github: "", demo: "" }]);
  const [education, setEducation] = useState([{ institution: "", degree: "", field: "", start: "", end: "" }]);
  const [saved, setSaved] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const addSkill = (s) => { if (s && !skills.includes(s)) setSkills(prev => [...prev, s]); setSkillInput(""); };
  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const projSet = (i) => (k) => (e) => setProjects(prev => prev.map((p, idx) => idx === i ? { ...p, [k]: e.target.value } : p));
  const projRemove = (i) => setProjects(prev => prev.filter((_, idx) => idx !== i));
  const projAdd = () => setProjects(prev => [...prev, { name: "", desc: "", tech: "", github: "", demo: "" }]);

  const eduSet = (i) => (k) => (e) => setEducation(prev => prev.map((p, idx) => idx === i ? { ...p, [k]: e.target.value } : p));
  const eduRemove = (i) => setEducation(prev => prev.filter((_, idx) => idx !== i));
  const eduAdd = () => setEducation(prev => [...prev, { institution: "", degree: "", field: "", start: "", end: "" }]);

  const saveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 760 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, marginBottom: 4 }}>Build your profile</h1>
      <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 0, marginBottom: 28 }}>Complete these steps to create a strong professional profile.</p>
      <StepIndicator step={step}/>

      {/* ── Step 1: Personal Info ── */}
      {step === 1 && (
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A", marginBottom: 18 }}>Personal Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={fieldStyle} placeholder="Alex Johnson" value={form.fullName} onChange={set("fullName")}/>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={fieldStyle} placeholder="you@example.com" value={form.email} onChange={set("email")}/>
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={fieldStyle} placeholder="+1 555 123 4567" value={form.phone} onChange={set("phone")}/>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input style={fieldStyle} placeholder="San Francisco, CA" value={form.location} onChange={set("location")}/>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Professional Title</label>
              <input style={fieldStyle} placeholder="Full Stack Developer" value={form.title} onChange={set("title")}/>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Bio / Summary</label>
              <textarea style={{ ...fieldStyle, minHeight: 100, resize: "vertical" }} placeholder="A short summary about you…" value={form.bio} onChange={set("bio")}/>
            </div>
          </div>
        </Card>
      )}

      {/* ── Step 2: Skills ── */}
      {step === 2 && (
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A", marginBottom: 14 }}>Your Skills</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input style={fieldStyle} placeholder="Type a skill and press Enter" value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { addSkill(skillInput.trim()); } }}/>
            <button onClick={() => addSkill(skillInput.trim())} style={{ padding: "0 20px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 600, border: "none", cursor: "pointer" }}>Add</button>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>Suggestions:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).map(s => (
                <button key={s} onClick={() => addSkill(s)} style={{ padding: "6px 14px", borderRadius: 999, border: `1px solid ${C.indigo[400]}`, background: C.indigo[50], color: C.indigo[600], fontSize: 13, cursor: "pointer" }}>+ {s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skills.map(s => (
              <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, background: `linear-gradient(135deg, ${C.violet[600]}, ${C.indigo[600]})`, color: "#fff", fontSize: 13 }}>
                {s}
                <button onClick={() => removeSkill(s)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>✕</button>
              </span>
            ))}
            {skills.length === 0 && <span style={{ fontSize: 13, color: "#94A3B8" }}>No skills added yet.</span>}
          </div>
        </Card>
      )}

      {/* ── Step 3: Projects ── */}
      {step === 3 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A", margin: 0 }}>Your Projects</h3>
            <Btn variant="outline" onClick={projAdd} small>+ Add Project</Btn>
          </div>
          {projects.map((p, i) => (
            <div key={i} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 18, marginBottom: 14, position: "relative" }}>
              <button onClick={projRemove(i)} style={{ position: "absolute", top: 12, right: 12, background: C.coral[50], border: "none", color: C.coral[600], width: 26, height: 26, borderRadius: "50%", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>✕</button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Project Name</label>
                  <input style={fieldStyle} placeholder="E-commerce Website" value={p.name} onChange={projSet(i)("name")}/>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Description</label>
                  <textarea style={{ ...fieldStyle, minHeight: 80 }} placeholder="Describe the project and its impact…" value={p.desc} onChange={projSet(i)("desc")}/>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Technologies (comma-separated)</label>
                  <input style={fieldStyle} placeholder="React, Node.js, MongoDB" value={p.tech} onChange={projSet(i)("tech")}/>
                </div>
                <div>
                  <label style={labelStyle}>GitHub URL</label>
                  <input style={fieldStyle} placeholder="https://github.com/you/repo" value={p.github} onChange={projSet(i)("github")}/>
                </div>
                <div>
                  <label style={labelStyle}>Live Demo URL</label>
                  <input style={fieldStyle} placeholder="https://yourapp.com" value={p.demo} onChange={projSet(i)("demo")}/>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && <span style={{ fontSize: 13, color: "#94A3B8" }}>No projects. Add one above.</span>}
        </Card>
      )}

      {/* ── Step 4: Education ── */}
      {step === 4 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A", margin: 0 }}>Your Education</h3>
            <Btn variant="outline" onClick={eduAdd} small>+ Add Education</Btn>
          </div>
          {education.map((e, i) => (
            <div key={i} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 18, marginBottom: 14, position: "relative" }}>
              <button onClick={eduRemove(i)} style={{ position: "absolute", top: 12, right: 12, background: C.coral[50], border: "none", color: C.coral[600], width: 26, height: 26, borderRadius: "50%", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>✕</button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Institution</label>
                  <input style={fieldStyle} placeholder="University name" value={e.institution} onChange={eduSet(i)("institution")}/>
                </div>
                <div>
                  <label style={labelStyle}>Degree</label>
                  <input style={fieldStyle} placeholder="B.Tech in Computer Science" value={e.degree} onChange={eduSet(i)("degree")}/>
                </div>
                <div>
                  <label style={labelStyle}>Field of Study</label>
                  <input style={fieldStyle} placeholder="Computer Science" value={e.field} onChange={eduSet(i)("field")}/>
                </div>
                <div>
                  <label style={labelStyle}>Start Year</label>
                  <input style={fieldStyle} placeholder="2021" value={e.start} onChange={eduSet(i)("start")}/>
                </div>
                <div>
                  <label style={labelStyle}>End Year</label>
                  <input style={fieldStyle} placeholder="2025 or Present" value={e.end} onChange={eduSet(i)("end")}/>
                </div>
              </div>
            </div>
          ))}
          {education.length === 0 && <span style={{ fontSize: 13, color: "#94A3B8" }}>No education entries. Add one above.</span>}
        </Card>
      )}

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <Btn variant="ghost" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>← Back</Btn>
        {step < 4 ? (
          <Btn variant="primary" onClick={() => setStep(s => Math.min(4, s + 1))}>Next →</Btn>
        ) : (
          <Btn variant="teal" onClick={saveProfile}>{saved ? "✓ Saved!" : "Save Profile"}</Btn>
        )}
      </div>
    </div>
  );
}

export default ProfileBuilderPage;