import { useState } from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";
import C from "../../constants/colors";

const TEMPLATES = [
  { name: "Modern Developer", bg: "#0F172A", accent: "#6472E8", text: "#E2E8F0", sectionBg: "#1E293B", cardBg: "#1E293B" },
  { name: "Professional", bg: "#F1F5F9", accent: "#38BDF8", text: "#1E293B", sectionBg: "#fff", cardBg: "#fff" },
  { name: "Creative", bg: "linear-gradient(135deg, #4C1D95, #7C3AED)", accent: "#F472B6", text: "#fff", sectionBg: "rgba(255,255,255,0.1)", cardBg: "rgba(255,255,255,0.12)" },
  { name: "Minimal", bg: "#FFFFFF", accent: "#374151", text: "#111827", sectionBg: "#F9FAFB", cardBg: "#F9FAFB" },
  { name: "Student", bg: "#F0FDF4", accent: "#34D399", text: "#064E3B", sectionBg: "#fff", cardBg: "#fff" },
];

function AccordionSection({ title, open, onToggle, children, render }) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, marginBottom: 10, overflow: "hidden", background: "#fff" }}>
      <div onClick={onToggle} style={{ padding: "13px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: open ? C.indigo[50] : "#fff" }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{title}</span>
        <span style={{ fontSize: 16, color: C.indigo[600], transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>›</span>
      </div>
      {open && <div style={{ padding: "14px 16px", borderTop: "1px solid #E5E7EB" }}>{children}</div>}
    </div>
  );
}

const fieldStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
  fontSize: 14, boxSizing: "border-box", outline: "none", background: "#fff",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };

function PortfolioBuilderPage() {
  const [template, setTemplate] = useState(0);
  const [openSection, setOpenSection] = useState("hero");
  const [data, setData] = useState({
    name: "Alex Johnson",
    tagline: "Full Stack Developer | Crafting web experiences that matter",
    cta: "View My Work",
    bio: "I'm a passionate developer who loves building clean, scalable web applications using React, Node.js, and cloud technologies.",
    skills: ["React", "JavaScript", "Node.js", "Python", "SQL", "Docker"],
    skillInput: "",
    projects: [
      { name: "Library Management System", desc: "A full CRUD app to manage library books, members, and loans.", tech: "React, Node.js, MongoDB", github: "github.com/you/libmgr", demo: "libmgr.app" },
    ],
    contact: { email: "alex@example.com", linkedin: "linkedin.com/in/alex", github: "github.com/you" },
  });
  const shown = { hero: true, about: true, skills: true, projects: true, contact: true };
  const [toggles, setToggles] = useState(shown);

  const setD = (k) => (e) => setData(p => ({ ...p, [k]: e.target.value }));
  const setContact = (k) => (e) => setData(p => ({ ...p, contact: { ...p.contact, [k]: e.target.value } }));

  const projSet = (i) => (k) => (e) => setData(p => ({ ...p, projects: p.projects.map((pr, idx) => idx === i ? { ...pr, [k]: e.target.value } : pr) }));
  const projRemove = (i) => setData(p => ({ ...p, projects: p.projects.filter((_, idx) => idx !== i) }));
  const projAdd = () => setData(p => ({ ...p, projects: [...p.projects, { name: "", desc: "", tech: "", github: "", demo: "" }] }));

  const addSkill = () => { const s = data.skillInput.trim(); if (s && !data.skills.includes(s)) setData(p => ({ ...p, skills: [...p.skills, s], skillInput: "" })); };
  const removeSkill = (s) => setData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const t = TEMPLATES[template];

  const renderPreview = (isOpen) => (
    <div style={{ background: t.bg, color: t.text, minHeight: 400, borderRadius: 14, overflow: "hidden", padding: 28, fontFamily: "Inter, sans-serif" }}>
      {toggles.hero && (
        <div style={{ textAlign: "center", padding: "24px 0 32px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: t.accent, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 22 }}>{data.name.split(" ").map(w => w[0]).join("").slice(0,2)}</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{data.name}</div>
          <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 16 }}>{data.tagline}</div>
          {isOpen && <button style={{ padding: "10px 22px", borderRadius: 999, background: t.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{data.cta}</button>}
        </div>
      )}
      {toggles.about && (
        <div style={{ background: t.sectionBg, borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: t.accent }}>About Me</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>{data.bio}</div>
        </div>
      )}
      {toggles.skills && (
        <div style={{ background: t.sectionBg, borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: t.accent }}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills.map(s => (
              <span key={s} style={{ padding: "6px 14px", borderRadius: 999, background: t.accent, color: "#fff", fontSize: 12 }}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {toggles.projects && (
        <div style={{ display: "grid", gridTemplateColumns: isOpen ? "1fr 1fr" : "1fr", gap: 12, marginBottom: 16 }}>
          {data.projects.map((p, i) => (
            <div key={i} style={{ background: t.sectionBg, borderRadius: 10, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: t.accent }}>{p.name || "Untitled project"}</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.85, marginBottom: 8 }}>{p.desc}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>{p.tech}</div>
            </div>
          ))}
        </div>
      )}
      {toggles.contact && (
        <div style={{ background: t.sectionBg, borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: t.accent }}>Contact</div>
          <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.8 }}>{data.contact.email} · {data.contact.linkedin} · {data.contact.github}</div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0 }}>Portfolio Builder</h1>
          <p style={{ color: "#94A3B8", fontSize: 14, margin: 0 }}>Edit on the left, see live preview on the right.</p>
        </div>
        <Btn variant="outline" onClick={() => window.open("#", "_blank")}>Open in new tab</Btn>
      </div>

      {/* Template selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TEMPLATES.map((tp, i) => (
          <button key={tp.name} onClick={() => setTemplate(i)} style={{
            padding: "9px 16px", borderRadius: 999, border: `1.5px solid ${i === template ? C.indigo[600] : "#E2E8F0"}`,
            background: i === template ? C.indigo[50] : "#fff", color: i === template ? C.indigo[600] : "#64748B",
            fontWeight: i === template ? 600 : 400, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
          }}>{tp.name}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Left: editor */}
        <div style={{ width: "45%", flexShrink: 0 }}>
          <AccordionSection title="Hero Section" open={openSection === "hero"} onToggle={() => setOpenSection(openSection === "hero" ? null : "hero")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>Show on portfolio</span>
              <button onClick={() => setToggles(p => ({ ...p, hero: !p.hero }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.hero ? C.teal[400] : "#E5E7EB", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <span style={{ position: "absolute", top: 2, left: toggles.hero ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }}/>
              </button>
            </div>
            <label style={labelStyle}>Name</label>
            <input style={{ ...fieldStyle, marginBottom: 10 }} value={data.name} onChange={setD("name")}/>
            <label style={labelStyle}>Tagline</label>
            <input style={{ ...fieldStyle, marginBottom: 10 }} value={data.tagline} onChange={setD("tagline")}/>
            <label style={labelStyle}>CTA Text</label>
            <input style={fieldStyle} value={data.cta} onChange={setD("cta")}/>
          </AccordionSection>

          <AccordionSection title="About" open={openSection === "about"} onToggle={() => setOpenSection(openSection === "about" ? null : "about")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>Show on portfolio</span>
              <button onClick={() => setToggles(p => ({ ...p, about: !p.about }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.about ? C.teal[400] : "#E5E7EB", border: "none", cursor: "pointer", position: "relative" }}>
                <span style={{ position: "absolute", top: 2, left: toggles.about ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }}/>
              </button>
            </div>
            <textarea style={{ ...fieldStyle, minHeight: 100 }} value={data.bio} onChange={setD("bio")}/>
          </AccordionSection>

          <AccordionSection title="Skills" open={openSection === "skills"} onToggle={() => setOpenSection(openSection === "skills" ? null : "skills")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>Show on portfolio</span>
              <button onClick={() => setToggles(p => ({ ...p, skills: !p.skills }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.skills ? C.teal[400] : "#E5E7EB", border: "none", cursor: "pointer", position: "relative" }}>
                <span style={{ position: "absolute", top: 2, left: toggles.skills ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }}/>
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input style={fieldStyle} placeholder="Add skill" value={data.skillInput} onChange={setD("skillInput")} onKeyDown={e => { if (e.key === "Enter") addSkill(); }}/>
              <button onClick={addSkill} style={{ padding: "0 16px", borderRadius: 10, background: C.indigo[600], color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.skills.map(s => (
                <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.indigo[50], color: C.indigo[800], padding: "6px 12px", borderRadius: 999, fontSize: 12 }}>
                  {s}
                  <button onClick={() => removeSkill(s)} style={{ background: "none", border: "none", cursor: "pointer", color: C.indigo[800], fontSize: 13 }}>✕</button>
                </span>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection title="Projects" open={openSection === "projects"} onToggle={() => setOpenSection(openSection === "projects" ? null : "projects")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>Show on portfolio</span>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={projAdd} style={{ background: C.indigo[50], border: "1px solid " + C.indigo[400], color: C.indigo[600], padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>+ Add</button>
                <button onClick={() => setToggles(p => ({ ...p, projects: !p.projects }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.projects ? C.teal[400] : "#E5E7EB", border: "none", cursor: "pointer", position: "relative" }}>
                  <span style={{ position: "absolute", top: 2, left: toggles.projects ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }}/>
                </button>
              </span>
            </div>
            {data.projects.map((p, i) => (
              <div key={i} style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 12, marginBottom: 10, position: "relative" }}>
                <button onClick={projRemove(i)} style={{ position: "absolute", top: 8, right: 8, background: C.coral[50], border: "none", color: C.coral[600], borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontWeight: 700, fontSize: 11 }}>✕</button>
                <label style={labelStyle}>Name</label>
                <input style={{ ...fieldStyle, marginBottom: 8, padding: "8px 12px" }} value={p.name} onChange={projSet(i)("name")}/>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...fieldStyle, minHeight: 60, marginBottom: 8, padding: "8px 12px" }} value={p.desc} onChange={projSet(i)("desc")}/>
                <label style={labelStyle}>Tech stack</label>
                <input style={{ ...fieldStyle, marginBottom: 8, padding: "8px 12px" }} placeholder="React, Node.js" value={p.tech} onChange={projSet(i)("tech")}/>
                <div style={{ display: "flex", gap: 8 }}>
                  <input style={{ ...fieldStyle, padding: "8px 12px" }} placeholder="GitHub URL" value={p.github} onChange={projSet(i)("github")}/>
                  <input style={{ ...fieldStyle, padding: "8px 12px" }} placeholder="Demo URL" value={p.demo} onChange={projSet(i)("demo")}/>
                </div>
              </div>
            ))}
          </AccordionSection>

          <AccordionSection title="Contact" open={openSection === "contact"} onToggle={() => setOpenSection(openSection === "contact" ? null : "contact")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>Show on portfolio</span>
              <button onClick={() => setToggles(p => ({ ...p, contact: !p.contact }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.contact ? C.teal[400] : "#E5E7EB", border: "none", cursor: "pointer", position: "relative" }}>
                <span style={{ position: "absolute", top: 2, left: toggles.contact ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }}/>
              </button>
            </div>
            <label style={labelStyle}>Email</label>
            <input style={{ ...fieldStyle, marginBottom: 10 }} value={data.contact.email} onChange={setContact("email")}/>
            <label style={labelStyle}>LinkedIn</label>
            <input style={{ ...fieldStyle, marginBottom: 10 }} value={data.contact.linkedin} onChange={setContact("linkedin")}/>
            <label style={labelStyle}>GitHub</label>
            <input style={fieldStyle} value={data.contact.github} onChange={setContact("github")}/>
          </AccordionSection>
        </div>

        {/* Right: live preview */}
        <div style={{ flex: 1, background: "#EEF0F3", borderRadius: 16, padding: 24, border: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <Badge color="violet">Live Preview · {t.name}</Badge>
            <span style={{ fontSize: 13, color: "#94A3B8" }}>Updates in real time</span>
          </div>
          {renderPreview(true)}
        </div>
      </div>
    </div>
  );
}

export default PortfolioBuilderPage;