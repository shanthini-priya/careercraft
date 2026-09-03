import { useState, useEffect, useRef } from "react";
import C from "./src/constants/colors";

// ─── Tiny router state ───────────────────────────────────────────────────────
function useRoute() {
  const [route, setRoute] = useState(window.location.hash || "#home");
  useEffect(() => {
    const handler = () => setRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const nav = (r) => { window.location.hash = r; };
  return [route, nav];
}

// ─── Components ─────────────────────────────────────────────────────────────

function NavLink({ to, children, nav, current }) {
  const active = current === to;
  return (
    <a
      href={to}
      onClick={(e) => { e.preventDefault(); nav(to); }}
      style={{
        fontSize: 14, fontWeight: active ? 600 : 400,
        color: active ? C.indigo[400] : C.textMuted,
        textDecoration: "none", padding: "6px 0",
        borderBottom: active ? `2px solid ${C.indigo[400]}` : "2px solid transparent",
        transition: "all 0.18s",
      }}
    >{children}</a>
  );
}

function Btn({ children, variant = "primary", onClick, small, href, disabled }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontWeight: 600, borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none", border: "none", transition: "all 0.18s",
    fontSize: small ? 13 : 15, padding: small ? "8px 18px" : "13px 28px",
    opacity: disabled ? 0.5 : 1,
  };
  const styles = {
    primary: { background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff" },
    outline:  { background: "transparent", color: C.indigo[400], border: `1.5px solid ${C.indigo[400]}` },
    ghost:    { background: "rgba(255,255,255,0.08)", color: C.textBody, border: "none" },
    teal:     { background: `linear-gradient(135deg, ${C.cyan[400]}, ${C.teal[400]})`, color: "#fff" },
  };
  const style = { ...base, ...styles[variant] };
  const Tag = href ? "a" : "button";
  return <Tag style={style} onClick={disabled ? undefined : onClick} href={href} disabled={disabled ? true : undefined}>{children}</Tag>;
}

function Badge({ children, color = "indigo" }) {
  const map = {
    indigo: { bg: C.indigo[50], text: C.indigo[400] },
    teal:   { bg: C.teal[50],   text: C.teal[400] },
    violet: { bg: C.violet[50], text: C.violet[400] },
    amber:  { bg: C.amber[50],  text: C.amber[400] },
    coral:  { bg: C.coral[50],  text: C.coral[400] },
  };
  return (
    <span style={{
      background: map[color].bg, color: map[color].text,
      fontSize: 12, fontWeight: 600, borderRadius: 999,
      padding: "3px 11px", display: "inline-block",
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.surface, borderRadius: 16,
      border: `1px solid ${C.border}`,
      padding: "24px 28px", ...style,
    }}>{children}</div>
  );
}

// ─── Score Ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 80, color = C.indigo[600], _label }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
        fontSize={size * 0.22} fontWeight={700} fill={C.text}>{score}</text>
    </svg>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ nav, route }) {
  const links = [
    ["#home", "Home"], ["#features", "Features"],
    ["#how", "How It Works"], ["#templates", "Templates"],
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(8,11,24,0.9)", backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => nav("#home")}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>C</span>
            <svg style={{ position: "absolute", top: -3, right: -3 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L5.6 3.4 L9 4 L5.6 4.6 L5 8 L4.4 4.6 L1 4 L4.4 3.4 Z" fill="#FBBF24"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: C.text }}>CareerCraft</span>
        </div>

        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} nav={nav} current={route}>{label}</NavLink>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="outline" small onClick={() => nav("#login")}>Log in</Btn>
          <Btn variant="primary" small onClick={() => nav("#register")}>Get started</Btn>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection({ nav }) {
  const [typed, setTyped] = useState("");
  const full = "I'm a 2nd-year CSE student. I know React, Python, and built a library management system.";
  const idx = useRef(0);
  useEffect(() => {
    const t = setInterval(() => {
      if (idx.current < full.length) {
        setTyped(full.slice(0, idx.current + 1));
        idx.current++;
      } else clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, background: "linear-gradient(160deg, #0F172A 0%, #141C33 60%, #0F172A 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <Badge color="violet">AI-Powered · Free to start</Badge>
            <h1 style={{ fontSize: 46, fontWeight: 800, color: C.text, lineHeight: 1.15, marginTop: 16, marginBottom: 0 }}>
              One input.<br/>
              <span style={{ background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Complete career identity.
              </span>
            </h1>
            <p style={{ fontSize: 18, color: C.textBody, marginTop: 20, lineHeight: 1.7, maxWidth: 480 }}>
              Portfolio, resume, LinkedIn content, GitHub README, and cover letter — all generated from a single conversation with AI.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
              <Btn variant="primary" onClick={() => nav("#register")}>
                Build my portfolio
                <span style={{ fontSize: 18 }}>→</span>
              </Btn>
              <Btn variant="outline" onClick={() => nav("#how")}>See how it works</Btn>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 28 }}>
              {[["🌐", "Portfolio"], ["📄", "Resume"], ["💼", "LinkedIn"], ["🐙", "GitHub README"]].map(([icon, label]) => (
                <span key={label} style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <Card style={{ boxShadow: `0 20px 60px rgba(37,99,235,0.25)`, borderRadius: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>AI</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>CareerCraft Assistant</div>
                  <div style={{ fontSize: 12, color: "#10B981" }}>● Online</div>
                </div>
              </div>

              <div style={{ background: "#1B2440", borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 14, color: C.textBody, lineHeight: 1.6 }}>Tell me about yourself — I&apos;ll build your complete professional identity.</p>
              </div>

              <div style={{ background: `linear-gradient(135deg, ${C.indigo[50]}, ${C.violet[50]})`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, marginLeft: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                  {typed}<span style={{ borderRight: `2px solid ${C.indigo[400]}`, animation: "blink 0.8s step-end infinite" }}></span>
                </p>
              </div>

              {typed.length > 50 && (
                <div style={{ background: "#1B2440", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ margin: 0, fontSize: 14, color: C.textBody }}>
                    Great! I can see you&apos;re a CSE student with frontend + backend skills.
                    What&apos;s the biggest problem your library system solves? 🎯
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13, color: C.textMuted }}>
                  Reply to AI…
                </div>
                <button style={{ background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, border: "none", borderRadius: 10, width: 40, height: 40, cursor: "pointer", color: "#fff", fontSize: 18 }}>↑</button>
              </div>
            </Card>

            <div style={{
              position: "absolute", top: -16, right: -20,
              background: C.surface, borderRadius: 14, padding: "10px 16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
              border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <ScoreRing score={82} size={48} />
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Portfolio Score</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>82 / 100</div>
              </div>
            </div>

            <div style={{
              position: "absolute", bottom: -16, left: -20,
              background: C.surface, borderRadius: 14, padding: "10px 16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
              border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ fontSize: 22 }}>⚡</div>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Generated in</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>~30 seconds</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, marginTop: 64, justifyContent: "center", flexWrap: "wrap" }}>
          {[["2,400+", "Portfolios created"], ["94%", "Recruiter approval"], ["6 assets", "Per generation"], ["30 sec", "Avg. time to portfolio"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.indigo[400] }}>{num}</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Before / After ──────────────────────────────────────────────────────────
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
    <section style={{ background: "#0B0F1E", padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge color="coral">Why CareerCraft?</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginTop: 12 }}>The old way vs the new way</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <Card style={{ background: "rgba(220,38,38,0.07)" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#F87171", marginBottom: 18 }}>❌ Before</div>
            {before.map(t => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ color: "#F87171", fontSize: 16, marginTop: 1 }}>✕</span>
                <span style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </Card>
          <Card style={{ background: "rgba(22,163,74,0.07)" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#34D399", marginBottom: 18 }}>✓ After</div>
            {after.map(t => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ color: "#34D399", fontSize: 16, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 14, color: C.textBody, lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
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
    <section id="features" style={{ padding: "80px 24px", background: C.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Badge color="indigo">What you get</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginTop: 12 }}>Seven innovations in one tool</h2>
          <p style={{ fontSize: 16, color: C.textMuted, marginTop: 10 }}>Not just a portfolio builder — a complete AI career system.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {features.map(f => (
            <Card key={f.title} style={{ borderTop: `3px solid ${C[f.color]?.[400] || C.indigo[400]}` }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", icon: "💬", title: "Tell the AI about yourself", desc: "Start a conversation. Share your skills, projects, and career goals — as casually as you like." },
    { n: "02", icon: "🧠", title: "AI understands and enriches", desc: "The AI analyzes your input, identifies gaps, asks follow-up questions, and enhances every detail." },
    { n: "03", icon: "⚡", title: "Your complete identity is generated", desc: "Portfolio, resume, LinkedIn content, GitHub README, and cover letter — all created at once." },
    { n: "04", icon: "🚀", title: "Publish, share, and improve", desc: "Get a public portfolio link. Use AI commands to refine it anytime. Track your portfolio score over time." },
  ];
  return (
    <section id="how" style={{ padding: "80px 24px", background: "#0B0F1E" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Badge color="teal">The process</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginTop: 12 }}>Four steps to your professional identity</h2>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 40, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, ${C.border}, ${C.indigo[600]}, ${C.violet[600]}, ${C.cyan[400]})`, borderRadius: 2, zIndex: 0 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative", zIndex: 1 }}>
            {steps.map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[50]}, ${C.violet[50]})`, border: `2px solid ${C.indigo[100]}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: `0 4px 16px rgba(37,99,235,0.25)` }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.indigo[400], marginBottom: 6, letterSpacing: 1 }}>{s.n}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio Templates ─────────────────────────────────────────────────────
function Templates() {
  const [active, setActive] = useState(0);
  const templates = [
    { name: "Modern Developer", tag: "For developers", icon: "💻", bg: "#0F172A", accent: "#3B82F6", sample: "dark" },
    { name: "Professional", tag: "For job seekers", icon: "👔", bg: "#0E2740", accent: "#06B6D4", sample: "corp" },
    { name: "Creative", tag: "For designers", icon: "🎨", bg: "#2E1065", accent: "#A855F7", sample: "creative" },
    { name: "Minimal", tag: "For everyone", icon: "⬜", bg: "#151B2E", accent: "#94A3B8", sample: "minimal" },
    { name: "Student", tag: "For freshers", icon: "🎓", bg: "#064E3B", accent: "#10B981", sample: "student" },
  ];
  const t = templates[active];
  return (
    <section id="templates" style={{ padding: "80px 24px", background: C.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Badge color="violet">Templates</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginTop: 12 }}>Five portfolio themes</h2>
          <p style={{ fontSize: 16, color: C.textMuted, marginTop: 10 }}>AI recommends the right one based on your career goal. You can switch anytime.</p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
          {templates.map((tp, i) => (
            <button key={tp.name} onClick={() => setActive(i)} style={{
              padding: "8px 18px", borderRadius: 999, border: `1.5px solid ${i === active ? C.indigo[400] : C.border}`,
              background: i === active ? C.indigo[50] : C.surface,
              color: i === active ? C.indigo[400] : C.textMuted,
              fontWeight: i === active ? 600 : 400, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}>
              <span>{tp.icon}</span> {tp.name}
            </button>
          ))}
        </div>
        <div style={{
          borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          border: `1px solid ${C.border}`, maxWidth: 700, margin: "0 auto",
        }}>
          <div style={{ background: t.bg, padding: "40px 36px", minHeight: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: t.accent, opacity: 0.3 }}/>
              <div>
                <div style={{ height: 14, width: 140, background: t.accent, borderRadius: 7, opacity: 0.7, marginBottom: 8 }}/>
                <div style={{ height: 10, width: 100, background: "#fff", borderRadius: 5, opacity: 0.2 }}/>
              </div>
            </div>
            <div style={{ height: 10, width: "80%", background: "#fff", borderRadius: 5, opacity: 0.15, marginBottom: 8 }}/>
            <div style={{ height: 10, width: "65%", background: "#fff", borderRadius: 5, opacity: 0.12, marginBottom: 28 }}/>
            <div style={{ display: "flex", gap: 10 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ flex: 1, height: 80, borderRadius: 10, background: t.accent, opacity: 0.15 }}/>
              ))}
            </div>
          </div>
          <div style={{ background: C.surface, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}` }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{t.name}</span>
              <span style={{ fontSize: 13, color: C.textMuted, marginLeft: 10 }}>{t.tag}</span>
            </div>
            <Badge color="indigo">AI recommended</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Generated Assets ────────────────────────────────────────────────────────
function GeneratedAssets() {
  const assets = [
    { icon: "🌐", label: "Portfolio", desc: "Published at careercraft.ai/u/you" },
    { icon: "📄", label: "Resume", desc: "ATS-optimized, download-ready PDF" },
    { icon: "💼", label: "LinkedIn", desc: "Headline, About, and Experience copy" },
    { icon: "🐙", label: "GitHub README", desc: "Professional project READMEs" },
    { icon: "✉️", label: "Cover Letter", desc: "Personalized per job and company" },
    { icon: "📊", label: "Portfolio Score", desc: "82/100 with improvement tips" },
  ];
  return (
    <section style={{ padding: "80px 24px", background: "linear-gradient(160deg, #0F172A 0%, #171F3E 55%, #0F172A 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Badge color="indigo">Everything included</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginTop: 12 }}>Six career assets, one generation</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {assets.map(a => (
            <Card key={a.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{a.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>{a.label}</div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function Testimonials() {
  const testi = [
    { name: "Arjun M.", role: "CS Final Year → Placed at TCS", quote: "I had zero idea how to write a portfolio. In 20 minutes I had a complete profile, resume, and LinkedIn. Got an interview call within a week.", avatar: "AM" },
    { name: "Priya S.", role: "Fresher → Frontend Dev at startup", quote: "The recruiter simulation feature was eye-opening. It told me exactly what was weak. I fixed those gaps and my response rate tripled.", avatar: "PS" },
    { name: "Rahul K.", role: "CS Student → Internship secured", quote: "The AI turned my basic project descriptions into something that sounds genuinely impressive. My projects were the same — the words just became professional.", avatar: "RK" },
  ];
  return (
    <section style={{ padding: "80px 24px", background: C.bg }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge color="teal">Success stories</Badge>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginTop: 12 }}>Students who got hired</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {testi.map(t => (
            <Card key={t.name} style={{ position: "relative" }}>
              <div style={{ fontSize: 36, color: C.indigo[100], fontFamily: "Georgia", position: "absolute", top: 16, right: 20, lineHeight: 1 }}>&quot;</div>
              <p style={{ fontSize: 14, color: C.textBody, lineHeight: 1.7, marginBottom: 20 }}>&quot;{t.quote}&quot;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[400]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection({ nav }) {
  return (
    <section style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})` }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Ready to build your professional identity?</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginBottom: 36 }}>
          Join 2,400+ students and developers who created their portfolio in under 30 seconds.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => nav("#register")} style={{ background: "#fff", color: C.violet[600], fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer" }}>
            Create my portfolio — free
          </button>
          <button onClick={() => nav("#how")} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, fontSize: 16, padding: "14px 32px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer" }}>
            See how it works
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer({ nav }) {
  return (
    <footer style={{ background: C.midnight, padding: "48px 24px 32px", color: C.textMuted, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>C</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>CareerCraft</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              AI-powered portfolio and career identity generator for students, freshers, and job seekers.
            </p>
          </div>
          {[["Product", ["Features", "Templates", "Pricing", "Changelog"]], ["Resources", ["Documentation", "Blog", "Career tips", "FAQ"]], ["Company", ["About", "Contact", "Privacy", "Terms"]]].map(([col, items]) => (
            <div key={col}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#fff", marginBottom: 14 }}>{col}</div>
              {items.map(i => (
                <div key={i} onClick={() => { if (i === "Privacy") window.location.hash = "#privacy"; else if (i === "Terms") window.location.hash = "#terms"; else nav("#home"); }} style={{ fontSize: 14, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}>{i}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13 }}>© 2026 CareerCraft. Built with ❤️ for job seekers.</span>
          <span style={{ fontSize: 13 }}>Made by your team · Innovation Lab Project</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Login Page ──────────────────────────────────────────────────────────────
const ONBOARD_FLAG = "careercraft_onboarded";

async function needsOnboarding(userId) {
  // Returning user with a completed onboarding -> dashboard.
  try {
    if (userId && localStorage.getItem(`${ONBOARD_FLAG}_${userId}`) === "done") return false;
  } catch (_) { /* ignore storage access failures */ }
  // No signal yet -> treat as new (send to onboarding).
  return true;
}

async function markOnboarded(userId) {
  try {
    if (userId) localStorage.setItem(`${ONBOARD_FLAG}_${userId}`, "done");
  } catch (_) { /* ignore storage access failures */ }
}

function AuthShell({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ color: "#fff", fontSize: 24, fontWeight: 800 }}>C</span>
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: C.text, margin: 0 }}>Build Your Career with AI</h1>
          <p style={{ color: C.textMuted, fontSize: 14, marginTop: 6 }}>Create your professional identity</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function SocialButton({ label, icon, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "13px", borderRadius: 12, background: C.surface, border: `1px solid ${C.border}`,
      color: C.text, fontWeight: 600, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12,
      opacity: disabled ? 0.6 : 1, transition: "border-color 0.2s, background 0.2s",
    }} onMouseEnter={e => e.currentTarget.style.borderColor = C.indigo[400]} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function AuthField({ label, type, value, onChange, placeholder, autoComplete }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.textBody, marginBottom: 6 }}>{label}</label>
      <input
        type={type} autoComplete={autoComplete} placeholder={placeholder}
        value={value} onChange={onChange}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, boxSizing: "border-box", outline: "none", background: "#1E2745", color: C.text }}
      />
    </div>
  );
}

function Alert({ kind, children }) {
  const color = kind === "success" ? "#34D399" : C.coral[400];
  const bg = kind === "success" ? "rgba(16,185,129,0.1)" : C.coral[50];
  return (
    <div style={{ marginBottom: 16, padding: "11px 14px", borderRadius: 10, background: bg, color, fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>{children}</div>
  );
}

function LoginPage({ nav }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const { authApi } = await import("./src/api/auth");
      const user = await authApi.login(form);
      const isNew = user ? await needsOnboarding(user?.id) : false;
      nav(isNew ? "#onboarding" : "#dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setProviderLoading(true);
    setError(null);
    try {
      const { authApi } = await import("./src/api/auth");
      await authApi.signInWithProvider(provider);
      // OAuth redirects the browser here; nothing else to do.
    } catch (err) {
      setError(err.message);
      setProviderLoading(false);
    }
  };

  const handleReset = async () => {
    setError(null);
    setResetSent(false);
    try {
      const { authApi } = await import("./src/api/auth");
      await authApi.resetPassword(form.email);
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell>
      <Card style={{ padding: 32 }}>
        {error && <Alert kind="error">{error}</Alert>}
        {info && <Alert kind="success">{info}</Alert>}
        {resetSent && <Alert kind="success">If an account exists, we&apos;ve emailed a password reset link. Check your inbox.</Alert>}

        {forgot ? (
          <>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: C.text, margin: 0, marginBottom: 6 }}>Reset your password</h2>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 18 }}>Enter your email and we&apos;ll send you a reset link.</p>
            <AuthField label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email"/>
            <button onClick={handleReset} style={{ width: "100%", padding: "13px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
              Send reset link
            </button>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: C.textMuted }}>
              <span onClick={() => setForgot(false)} style={{ color: C.indigo[400], fontWeight: 600, cursor: "pointer" }}>← Back to sign in</span>
            </div>
          </>
        ) : (
          <>
            <SocialButton label="Continue with Google" icon="🌐" onClick={() => handleSocial("google")} disabled={providerLoading}/>
            <SocialButton label="Continue with GitHub" icon="◉" onClick={() => handleSocial("github")} disabled={providerLoading}/>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: C.border }}/><span style={{ fontSize: 12, color: C.textMuted }}>OR</span><div style={{ flex: 1, height: 1, background: C.border }}/>
            </div>

            <AuthField label="Email" type="email" value={form.email} onChange={set("email")} placeholder="Enter your email" autoComplete="email"/>
            <AuthField label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Enter your password" autoComplete="current-password"/>
            <div style={{ textAlign: "right", marginBottom: 18 }}>
              <span onClick={() => setForgot(true)} style={{ fontSize: 13, color: C.indigo[400], cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 10, background: loading ? "#334155" : `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
            <div style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: C.textMuted }}>
              Don&apos;t have an account?{" "}
              <span onClick={() => nav("#register")} style={{ color: C.indigo[400], fontWeight: 600, cursor: "pointer" }}>Create Account</span>
            </div>
          </>
        )}
      </Card>
    </AuthShell>
  );
}

// ─── Register Page ───────────────────────────────────────────────────────────
function RegisterPage({ nav }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const { authApi } = await import("./src/api/auth");
      const user = await authApi.register(form);
      if (user) {
        // Session available (no email confirmation required) -> onboard now.
        nav("#onboarding");
      } else {
        // Email confirmation required -> prompt user.
        setInfo("Account created! We've emailed you a confirmation link. Click it, then sign in to continue.");
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setProviderLoading(true);
    setError(null);
    try {
      const { authApi } = await import("./src/api/auth");
      await authApi.signInWithProvider(provider);
    } catch (err) {
      setError(err.message);
      setProviderLoading(false);
    }
  };

  return (
    <AuthShell>
      <Card style={{ padding: 32 }}>
        {error && <Alert kind="error">{error}</Alert>}
        {info && <Alert kind="success">{info}</Alert>}

        <SocialButton label="Continue with Google" icon="🌐" onClick={() => handleSocial("google")} disabled={providerLoading}/>
        <SocialButton label="Continue with GitHub" icon="◉" onClick={() => handleSocial("github")} disabled={providerLoading}/>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: C.border }}/><span style={{ fontSize: 12, color: C.textMuted }}>OR</span><div style={{ flex: 1, height: 1, background: C.border }}/>
        </div>

        <AuthField label="Full name" type="text" value={form.name} onChange={set("name")} placeholder="Alex Johnson" autoComplete="name"/>
        <AuthField label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email"/>
        <AuthField label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="new-password"/>
        <AuthField label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" autoComplete="new-password"/>

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 10, background: loading ? "#334155" : `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 6 }}>
          {loading ? "Creating account…" : "Create Account"}
        </button>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: C.textMuted }}>
          Already have an account?{" "}
          <span onClick={() => nav("#login")} style={{ color: C.indigo[400], fontWeight: 600, cursor: "pointer" }}>Sign In</span>
        </div>
      </Card>
    </AuthShell>
  );
}

// ─── Onboarding (AI chat — ChatGPT-style) ────────────────────────────────────
const ONBOARD_STARTERS = [
  "I'm a CS student — where do I start?",
  "Let me tell you about my skills",
  "Here's my education",
  "I've built a cool project",
];

function OnboardingPage({ nav }) {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm CareerCraft, your AI portfolio coach. 👋 No forms, no stress — just tell me about yourself in your own words. To get started: what do you do, and what are you aiming for?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const scrollRef = useRef(null);

  const scrollChat = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  };

  useEffect(() => { scrollChat(); }, [messages, loading]);

  const handleSend = async (override) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    const history = [
      ...messages.map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })),
      { role: "user", content: text },
    ];

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const { api } = await import("./src/api/client");
      const res = await api.post("/onboard/converse", { messages: history }).catch((e) => {
        if (e?.response?.data?.message) throw new Error(e.response.data.message);
        if (e?.message) throw new Error(e.message);
        throw new Error("Couldn't reach the AI. Is the backend running?");
      });

      const reply = res?.reply || "…";
      setMessages((prev) => [...prev, { from: "ai", text: reply }]);
      if (res?.profile) setDone(true);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "ai", text: `⚠️ ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const finishAndSave = async () => {
    setSaved(true);
    try {
      const { authApi } = await import("./src/api/auth");
      const user = await authApi.me().catch(() => null);
      markOnboarded(user?.user?.id || user?.id);
    } catch (_) { /* ignore */ }
    nav("#dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Badge color="indigo">AI Onboarding</Badge>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginTop: 10 }}>Tell the AI about yourself</h2>
          <p style={{ color: C.textMuted, fontSize: 14 }}>Just talk — the AI reads your answers and builds your portfolio from the conversation.</p>
        </div>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>AI</span>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>CareerCraft Assistant</div>
              <div style={{ fontSize: 12, color: "#10B981" }}>● Online — powered by Gemini</div>
            </div>
            {done && saved === false && (
              <button onClick={finishAndSave} style={{ marginLeft: "auto", padding: "9px 16px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                ⚡ Build my portfolio
              </button>
            )}
          </div>
          <div ref={scrollRef} style={{ height: 380, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, scrollBehavior: "smooth" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "78%", padding: "11px 16px", borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.from === "user" ? `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})` : C.surface,
                  border: m.from === "user" ? "none" : `1px solid ${C.border}`,
                  color: m.from === "user" ? "#fff" : C.textBody, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 16px" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.indigo[400], opacity: 0.4, animation: `blink 1.2s ${i * 0.2}s infinite` }}/>
                ))}
              </div>
            )}
            {done && saved === false && (
              <div style={{ padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.indigo[600]}55`, background: `${C.indigo[600]}14`, color: C.textBody, fontSize: 14, lineHeight: 1.6 }}>
                ✅ I&apos;ve captured your profile from our chat — skills, projects and education are saved. Ready when you are!
              </div>
            )}
            {done && saved && (
              <div style={{ textAlign: "center", padding: "6px 0", color: C.textMuted, fontSize: 13 }}>Saving… building your portfolio…</div>
            )}
          </div>
          {!done && !loading && (
            <div style={{ padding: "0 24px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ONBOARD_STARTERS.map((s) => (
                <button key={s} onClick={() => handleSend(s)} style={{ padding: "7px 14px", borderRadius: 999, border: `1px solid ${C.border}`, background: "transparent", color: C.textBody, fontSize: 13, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div style={{ padding: "14px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              disabled={loading}
              placeholder={done ? "You're all set — hit Build my portfolio!" : "Tell me about yourself…"}
              style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", background: "#1E2745", color: C.text }}
            />
            <button onClick={() => handleSend()} disabled={loading} style={{ background: loading ? "#334155" : `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, border: "none", borderRadius: 10, width: 44, height: 44, cursor: loading ? "not-allowed" : "pointer", color: "#fff", fontSize: 18 }}>↑</button>
          </div>
        </Card>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button onClick={finishAndSave} style={{ padding: "13px 36px", borderRadius: 12, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
            ⚡ Generate my professional identity
          </button>
          <p style={{ color: C.textMuted, fontSize: 12, marginTop: 10 }}>Chat with me first so I can auto-fill your profile — or just generate now.</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2 — Enhanced Dashboard + Analytics Charts
// ═══════════════════════════════════════════════════════════════════════════

const ROUTE_TITLES = {
  "#dashboard": "Dashboard", "#portfolio": "Portfolio", "#ai-assistant": "AI Builder",
  "#resume": "Resume", "#linkedin": "LinkedIn", "#github-readme": "GitHub README",
  "#cover-letter": "Cover Letter", "#score": "My Score", "#recruiter-sim": "Recruiter Simulation",
  "#templates": "Templates", "#profile-form": "My Profile", "#settings": "Settings",
  "#documents": "Documents", "#career-match": "Career Match", "#feedback": "Feedback",
};

// ─── Enhanced Sidebar (collapsible) ──────────────────────────────────────────
function EnhancedSidebar({ nav, route, collapsed, onToggle }) {
  const groups = [
    { label: "MAIN", items: [
      ["#dashboard", "🏠", "Dashboard"],
      ["#profile-form", "👤", "My Profile"],
      ["#ai-assistant", "✨", "AI Builder"],
      ["#portfolio", "💼", "Portfolio"],
      ["#documents", "📄", "Documents"],
      ["#career-match", "🎯", "Career Match"],
      ["#score", "📊", "My Score"],
      ["#feedback", "⭐", "Feedback"],
    ]},
    { label: "SETTINGS", items: [
      ["#settings", "⚙️", "Settings"],
    ]},
  ];
  const width = collapsed ? 64 : 240;
  return (
    <aside style={{
      width, height: "100vh", background: C.midnight, padding: 0,
      position: "fixed", top: 0, left: 0, zIndex: 50,
      display: "flex", flexDirection: "column", overflow: "hidden",
      transition: "width 0.25s ease",
    }}>
      {/* Logo row + collapse toggle */}
      <div style={{ padding: "14px 12px", display: "flex", alignItems: "center", gap: 10, height: 64, borderBottom: `1px solid ${C.border}` }}>
        {!collapsed && (
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>C</span>
            <svg style={{ position: "absolute", top: -2, right: -2 }} width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L5.6 3.4 L9 4 L5.6 4.6 L5 8 L4.4 4.6 L1 4 L4.4 3.4 Z" fill="#FBBF24"/>
            </svg>
          </div>
        )}
        {collapsed && (
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", flexShrink: 0, position: "relative" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>C</span>
            <svg style={{ position: "absolute", top: -2, right: -2 }} width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L5.6 3.4 L9 4 L5.6 4.6 L5 8 L4.4 4.6 L1 4 L4.4 3.4 Z" fill="#FBBF24"/>
            </svg>
          </div>
        )}
        {!collapsed && <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden" }}>CareerCraft</span>}
        <button onClick={onToggle} style={{ marginLeft: "auto", background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20, flexShrink: 0 }}>
          {collapsed ? "☰" : "≣"}
        </button>
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
        {groups.map(g => (
          <div key={g.label} style={{ marginBottom: 10 }}>
            {!collapsed && (
              <div style={{ padding: "8px 20px 6px", fontSize: 10, fontWeight: 700, color: "#64748B", letterSpacing: 1.2 }}>{g.label}</div>
            )}
            {g.items.map(([to, icon, label]) => {
              const active = route === to;
              return (
                <a key={to} href={to} onClick={e => { e.preventDefault(); nav(to); }} title={label} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "12px 0" : "10px 20px",
                  color: active ? "#fff" : C.textMuted, textDecoration: "none", fontSize: 14,
                  fontWeight: active ? 600 : 400, background: active ? "rgba(37,99,235,0.2)" : "transparent",
                  borderLeft: active ? `3px solid ${C.indigo[400]}` : "3px solid transparent",
                  transition: "all 0.15s", justifyContent: collapsed ? "center" : "flex-start",
                  position: "relative", whiteSpace: "nowrap", borderRadius: 0,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  {!collapsed && <span style={{ overflow: "hidden" }}>{label}</span>}
                </a>
              );
            })}
          </div>
        ))}
      </div>

      {/* User card */}
      <div style={{ padding: collapsed ? "12px 0" : "14px 20px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[400]}, ${C.violet[400]})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>AJ</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#22C55E", border: `2px solid ${C.midnight}` }}/>
          </div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Alex Johnson</div>
                <div style={{ color: C.textMuted, fontSize: 11, whiteSpace: "nowrap" }}>CSE Student</div>
              </div>
              <button onClick={async () => { const { authApi } = await import("./src/api/auth"); authApi.logout(); nav("#home"); }} title="Sign out" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 13, cursor: "pointer", padding: "6px 8px", borderRadius: 8, flexShrink: 0 }}>
                ⎋
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

// ─── Top Header Bar ──────────────────────────────────────────────────────────
function TopHeader({ route, nav }) {
  const [userOpen, setUserOpen] = useState(false);
  const title = ROUTE_TITLES[route] || "Dashboard";
  return (
    <header style={{
      position: "fixed", top: 0, right: 0, left: 240, height: 64, zIndex: 40,
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px",
    }}>
      <div>
        <div style={{ fontSize: 12, color: C.textMuted }}>Home / {title}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{title}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textBody }}>🔍</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textBody, position: "relative" }}>
          🔔
          <span style={{ position: "absolute", top: -4, right: -6, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 5px" }}>3</span>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }} onClick={() => setUserOpen(o => !o)}>
          AJ
        </div>
        {userOpen && (
          <div style={{ position: "absolute", top: 52, right: 0, background: C.surface, borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", border: `1px solid ${C.border}`, width: 180, padding: 8, zIndex: 60 }}>
            {[["👤","Profile","#profile-form"],["⚙️","Settings","#settings"],["⎋","Sign out","#home"]].map(([icon, label, to]) => (
              <div key={label} onClick={() => { setUserOpen(false); nav(to); }} style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, color: C.textBody, display: "flex", gap: 10, alignItems: "center" }}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Metric Card (count-up + trend + sparkline) ──────────────────────────────
function MetricCard({ label, value, sub, color }) {
  return (
    <Card style={{ textAlign: "left", padding: "20px 22px" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: color || C.text }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.textBody, marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{sub}</div>
    </Card>
  );
}

// ─── Enhanced DashboardHome (minimal) ────────────────────────────────────────
function EnhancedDashboardHome({ nav }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const [userName, setUserName] = useState("there");
  const [score, setScore] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [, setUserLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { authApi } = await import("./src/api/auth");
        const data = await authApi.me();
        if (!cancelled) setUserName(data.user?.name?.split(" ")[0] || "there");
      } catch (_) {
        /* not authed */
      } finally {
        if (!cancelled) setUserLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { api } = await import("./src/api/client");
        const data = await api.get("/score");
        if (!cancelled) setScore(data.score);
      } catch (_) {
        /* ignore */
      } finally {
        if (!cancelled) setScoreLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [docCount, setDocCount] = useState(null);
  const [careerMatches, setCareerMatches] = useState(null);
  const [recruiterReadiness, setRecruiterReadiness] = useState(null);
  const [docsLoading, setDocsLoading] = useState(true);
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { api } = await import("./src/api/client");
        const [countsRes, docsRes] = await Promise.all([
          api.get("/generate/counts"),
          api.get("/generate/documents"),
        ]);
        if (cancelled) return;
        const c = countsRes?.counts || {};
        setDocCount(c.documents ?? null);
        setCareerMatches(c.careerMatches ?? null);
        setRecruiterReadiness(c.recruiterReadiness ?? null);
        const docs = docsRes?.documents || [];
        setRecentDocs(docs.slice(0, 4).map((d) => ({
          name: d.name,
          type: d.type,
          updated: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : "—",
          status: d.type === "Cover Letter" ? "Draft" : "Ready",
        })));
        if (docs.length === 0) {
          setRecentDocs([
            { name: "My Portfolio", type: "Portfolio", updated: "Today", status: "Ready" },
            { name: "LinkedIn Profile", type: "LinkedIn", updated: "Yesterday", status: "Ready" },
            { name: "GitHub README", type: "GitHub", updated: "Yesterday", status: "Ready" },
            { name: "Cover Letter", type: "Cover Letter", updated: "—", status: "Draft" },
          ]);
        }
      } catch (_) {
        /* ignore */
      } finally {
        if (!cancelled) setDocsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const scoreVal = score?.score ?? null;
  const completion = score?.breakdown?.profileCompleteness ?? 85;
  const improveText =
    scoreVal != null && scoreVal >= 90
      ? "Your profile looks great! Keep adding achievements."
      : scoreVal != null && scoreVal >= 70
      ? "Add 1 more project and detailed descriptions to improve your profile."
      : "Complete your profile, skills, and projects to boost your score.";

  const statusColor = { Ready: "#22C55E", Draft: "#F59E0B", "Needs Review": "#EF4444" };
  const statusBg = { Ready: "rgba(34,197,94,0.15)", Draft: "rgba(245,158,11,0.15)", "Needs Review": "rgba(239,68,68,0.15)" };
  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0 }}>{greeting}, {userName} 👋</h1>
          <p style={{ color: C.textMuted, marginTop: 6, fontSize: 15, marginBottom: 0 }}>Let&apos;s build a stronger professional profile.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, color: C.textMuted }}>🔍</span>
          <span style={{ fontSize: 14, color: C.textMuted }}>👤</span>
        </div>
      </div>

      {/* Four metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <MetricCard label="Portfolio Score" value={scoreLoading ? "—" : (scoreVal ?? 85)} sub="Good — improve" color={C.violet[400]}/>
        <MetricCard label="Career Matches" value={docsLoading ? "—" : (careerMatches ?? 0)} sub="Roles for you" color={C.indigo[400]}/>
        <MetricCard label="Documents Created" value={docsLoading ? "—" : (docCount ?? 0)} sub="Assets generated" color={C.cyan[400]}/>
        <MetricCard label="Recruiter Score" value={docsLoading || recruiterReadiness == null ? "—" : (recruiterReadiness / 20).toFixed(1)} sub="Strong profile" color={C.teal[400]}/>
      </div>

      {/* One main action area */}
      <Card style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, margin: 0, marginBottom: 6 }}>Your profile is {completion}% complete</h3>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>{improveText}</p>
        </div>
        <button onClick={() => nav("#profile-form")} style={{ padding: "12px 28px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
          Improve My Profile
        </button>
      </Card>

      {/* Recent documents table */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, margin: 0 }}>Recent Documents</h3>
          <button onClick={() => nav("#portfolio")} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.textBody, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Export
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: C.textMuted, textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>Document</th>
                <th style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>Type</th>
                <th style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>Updated</th>
                <th style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDocs.map((d, i) => (
                <tr key={i} style={{ borderBottom: i < recentDocs.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <td style={{ padding: "12px", color: C.text, fontWeight: 600 }}>{d.name}</td>
                  <td style={{ padding: "12px", color: C.textBody }}>{d.type}</td>
                  <td style={{ padding: "12px", color: C.textBody }}>{d.updated}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: statusBg[d.status], color: statusColor[d.status], fontWeight: 600, fontSize: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[d.status] }}/>{d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Primary action */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => nav("#ai-assistant")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, #EC4899)`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
          ＋ Create with AI
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3 — Multi-step Profile Builder
// ═══════════════════════════════════════════════════════════════════════════

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
                background: done ? C.teal[400] : active ? `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})` : C.border,
                color: active || done ? "#fff" : C.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14,
              }}>
                {done ? "✓" : idx}
              </div>
              <span style={{ fontSize: 11, color: active ? C.indigo[400] : C.textMuted, fontWeight: active ? 600 : 400, marginTop: 6 }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: idx < step ? C.teal[400] : C.border, margin: "0 10px", marginBottom: 20 }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

const fieldStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.border}`,
  fontSize: 14, boxSizing: "border-box", outline: "none", background: "#1E2745", color: C.text,
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: C.textBody, marginBottom: 6 };

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { api } = await import("./src/api/client");
        const data = await api.get("/profile");
        if (cancelled || !data?.profile) return;
        const p = data.profile;
        setForm({
          fullName: p.user?.name || "",
          email: p.user?.email || "",
          phone: p.phone || "",
          location: p.location || "",
          title: p.title || "",
          bio: p.bio || "",
        });
        setSkills(p.skills?.map(s => s.name) || []);
        const loadedProjects = p.projects?.map(pr => ({
          name: pr.name || "", desc: pr.description || "",
          tech: (pr.technologies || []).join(", "), github: pr.githubUrl || "", demo: pr.liveUrl || "",
        })) || [];
        if (loadedProjects.length > 0) setProjects(loadedProjects);
        const loadedEdu = p.education?.map(e => ({
          institution: e.institution || "", degree: e.degree || "", field: e.fieldOfStudy || "",
          start: e.startYear || "", end: e.endYear || "",
        })) || [];
        if (loadedEdu.length > 0) setEducation(loadedEdu);
      } catch (_) {
        /* profile may not exist yet */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const addSkill = (s) => { if (s && !skills.includes(s)) setSkills(prev => [...prev, s]); setSkillInput(""); };
  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const projSet = (i) => (k) => (e) => setProjects(prev => prev.map((p, idx) => idx === i ? { ...p, [k]: e.target.value } : p));
  const projRemove = (i) => setProjects(prev => prev.filter((_, idx) => idx !== i));
  const projAdd = () => setProjects(prev => [...prev, { name: "", desc: "", tech: "", github: "", demo: "" }]);

  const eduSet = (i) => (k) => (e) => setEducation(prev => prev.map((p, idx) => idx === i ? { ...p, [k]: e.target.value } : p));
  const eduRemove = (i) => setEducation(prev => prev.filter((_, idx) => idx !== i));
  const eduAdd = () => setEducation(prev => [...prev, { institution: "", degree: "", field: "", start: "", end: "" }]);

  const saveProfile = async () => {
    setSaved(true);
    setError(null);
    try {
      const { api } = await import("./src/api/client");
      await api.put("/profile", {
        title: form.title,
        bio: form.bio,
        phone: form.phone,
        location: form.location,
      });
      if (form.fullName) {
        const { api } = await import("./src/api/client");
        await api.put("/auth/me", { name: form.fullName });
      }
      for (const s of skills) {
        try { await api.post("/profile/skills", { name: s }); } catch (_) { /* exists */ }
      }
      for (const pr of projects) {
        if (!pr.name) continue;
        try {
          await api.post("/profile/projects", {
            name: pr.name,
            description: pr.desc,
            technologies: pr.tech.split(",").map(t => t.trim()).filter(Boolean),
            githubUrl: pr.github || null,
            liveUrl: pr.demo || null,
          });
        } catch (_) { /* exists */ }
      }
    } catch (err) {
      setError(err.message);
    }
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 760 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, marginBottom: 4 }}>Build your profile</h1>
      <p style={{ color: C.textMuted, fontSize: 14, marginTop: 0, marginBottom: 28 }}>Complete these steps to create a strong professional profile.</p>
      <StepIndicator step={step}/>

      {/* ── Step 1: Personal Info ── */}
      {step === 1 && (
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 18 }}>Personal Information</h3>
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
          <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 14 }}>Your Skills</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input style={fieldStyle} placeholder="Type a skill and press Enter" value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { addSkill(skillInput.trim()); } }}/>
            <button onClick={() => addSkill(skillInput.trim())} style={{ padding: "0 20px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 600, border: "none", cursor: "pointer" }}>Add</button>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Suggestions:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).map(s => (
                <button key={s} onClick={() => addSkill(s)} style={{ padding: "6px 14px", borderRadius: 999, border: `1px solid ${C.indigo[400]}`, background: C.indigo[50], color: C.indigo[400], fontSize: 13, cursor: "pointer" }}>+ {s}</button>
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
            {skills.length === 0 && <span style={{ fontSize: 13, color: C.textMuted }}>No skills added yet.</span>}
          </div>
        </Card>
      )}

      {/* ── Step 3: Projects ── */}
      {step === 3 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, margin: 0 }}>Your Projects</h3>
            <Btn variant="outline" onClick={projAdd} small>+ Add Project</Btn>
          </div>
          {projects.map((p, i) => (
            <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 14, position: "relative" }}>
              <button onClick={projRemove(i)} style={{ position: "absolute", top: 12, right: 12, background: C.coral[50], border: "none", color: C.coral[400], width: 26, height: 26, borderRadius: "50%", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>✕</button>
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
          {projects.length === 0 && <span style={{ fontSize: 13, color: C.textMuted }}>No projects. Add one above.</span>}
        </Card>
      )}

      {/* ── Step 4: Education ── */}
      {step === 4 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, margin: 0 }}>Your Education</h3>
            <Btn variant="outline" onClick={eduAdd} small>+ Add Education</Btn>
          </div>
          {education.map((e, i) => (
            <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 14, position: "relative" }}>
              <button onClick={eduRemove(i)} style={{ position: "absolute", top: 12, right: 12, background: C.coral[50], border: "none", color: C.coral[400], width: 26, height: 26, borderRadius: "50%", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>✕</button>
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
          {education.length === 0 && <span style={{ fontSize: 13, color: C.textMuted }}>No education entries. Add one above.</span>}
        </Card>
      )}

      {/* Navigation buttons */}
      {error && (
        <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: C.coral[50], color: C.coral[400], fontSize: 13, fontWeight: 500 }}>⚠️ {error}</div>
      )}
      {loading && (
        <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: C.indigo[50], color: C.indigo[400], fontSize: 13, fontWeight: 500 }}>Loading your profile…</div>
      )}
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

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 4 — Portfolio Builder (Live Preview + Template Switching)
// ═══════════════════════════════════════════════════════════════════════════

const TEMPLATES = [
  { name: "Modern Developer", bg: "#0F172A", accent: "#3B82F6", text: "#E2E8F0", sectionBg: "#1E293B", cardBg: "#1E293B" },
  { name: "Professional", bg: "#0E2740", accent: "#06B6D4", text: "#E2E8F0", sectionBg: "#0A1A2E", cardBg: "#0A1A2E" },
  { name: "Creative", bg: "linear-gradient(135deg, #2E1065, #7C3AED)", accent: "#A855F7", text: "#fff", sectionBg: "rgba(255,255,255,0.1)", cardBg: "rgba(255,255,255,0.12)" },
  { name: "Minimal", bg: "#151B2E", accent: "#94A3B8", text: "#F8FAFC", sectionBg: "#1D2540", cardBg: "#1D2540" },
  { name: "Student", bg: "#064E3B", accent: "#10B981", text: "#E2E8F0", sectionBg: "#043A2C", cardBg: "#043A2C" },
];

function AccordionSection({ title, open, onToggle, children, _render }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden", background: C.surface }}>
      <div onClick={onToggle} style={{ padding: "13px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: open ? C.indigo[50] : C.surface }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{title}</span>
        <span style={{ fontSize: 16, color: C.indigo[400], transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>›</span>
      </div>
      {open && <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}` }}>{children}</div>}
    </div>
  );
}

const TEMPLATE_IDS = (name) => {
  const map = {
    "modern-developer": 0,
    professional: 1,
    creative: 2,
    minimal: 3,
    student: 4,
  };
  return map[name] ?? 0;
};

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
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { api } = await import("./src/api/client");
        const res = await api.get("/portfolio");
        if (cancelled || !res.portfolio) return;
        const p = res.portfolio;
        setTemplate(TEMPLATE_IDS(p.templateId));
        const secByType = {};
        (p.sections || []).forEach(s => { secByType[s.type] = s; });
        setData(prev => {
          const next = { ...prev };
          const hero = secByType.hero?.content;
          if (hero) {
            next.name = hero.name ?? prev.name;
            next.tagline = hero.tagline ?? prev.tagline;
            next.cta = hero.cta ?? prev.cta;
          }
          const about = secByType.about?.content;
          if (about?.bio) next.bio = about.bio;
          const skills = secByType.skills?.content;
          if (skills?.items) next.skills = skills.items;
          const projects = secByType.projects?.content;
          if (projects?.items) next.projects = projects.items;
          const contact = secByType.contact?.content;
          if (contact) next.contact = { ...prev.contact, ...contact };
          setToggles(tt => ({
            hero: secByType.hero?.visible ?? tt.hero,
            about: secByType.about?.visible ?? tt.about,
            skills: secByType.skills?.visible ?? tt.skills,
            projects: secByType.projects?.visible ?? tt.projects,
            contact: secByType.contact?.visible ?? tt.contact,
          }));
          return next;
        });
      } catch (_) {
        /* load without persisted data */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const savePortfolio = async () => {
    setSaving(true);
    setStatus(null);
    setNotice(null);
    try {
      const { api } = await import("./src/api/client");
      await api.put("/portfolio/template", { templateId: TEMPLATES[template].name.toLowerCase().replace(/\s+/g, "-") });
      const sections = [
        { type: "hero", content: { name: data.name, tagline: data.tagline, cta: data.cta }, visible: toggles.hero },
        { type: "about", content: { bio: data.bio }, visible: toggles.about },
        { type: "skills", content: { items: data.skills }, visible: toggles.skills },
        { type: "projects", content: { items: data.projects }, visible: toggles.projects },
        { type: "contact", content: { email: data.contact.email, linkedin: data.contact.linkedin, github: data.contact.github }, visible: toggles.contact },
      ];
      for (const sc of sections) {
        await api.put(`/portfolio/sections/${sc.type}`, { content: sc.content, visible: sc.visible });
      }
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setNotice(err.message || "Failed to save portfolio");
    } finally {
      setSaving(false);
    }
  };

  const publishPortfolio = async () => {
    setPublishing(true);
    setStatus(null);
    setNotice(null);
    try {
      const { api } = await import("./src/api/client");
      const res = await api.post("/portfolio/publish");
      const url = res.portfolio?.publicUrl
        ? `${window.location.origin}/#portfolio/${res.portfolio.publicUrl}`
        : null;
      setStatus("published");
      setNotice(url ? `Published! Link: ${url}` : "Portfolio published!");
    } catch (err) {
      setStatus("error");
      setNotice(err.message || "Failed to publish portfolio");
    } finally {
      setPublishing(false);
    }
  };

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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Portfolio Builder</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Edit on the left, see live preview on the right.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {status === "published" && <Badge color="teal">Published ✓</Badge>}
          {status === "saved" && <Badge color="indigo">Saved ✓</Badge>}
          <Btn variant="outline" onClick={savePortfolio} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
          <Btn onClick={publishPortfolio} disabled={publishing}>{publishing ? "Publishing…" : "Publish"}</Btn>
        </div>
      </div>
      {notice && status === "error" && (
        <div style={{ background: C.coral[50], color: C.coral[400], border: `1px solid ${C.coral[400]}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{notice}</div>
      )}
      {notice && status === "published" && (
        <div style={{ background: "rgba(16,185,129,0.1)", color: "#34D399", border: "1px solid #16a34a", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{notice}</div>
      )}

      {/* Template selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TEMPLATES.map((tp, i) => (
          <button key={tp.name} onClick={() => setTemplate(i)} style={{
            padding: "9px 16px", borderRadius: 999, border: `1.5px solid ${i === template ? C.indigo[400] : C.border}`,
            background: i === template ? C.indigo[50] : C.surface, color: i === template ? C.indigo[400] : C.textMuted,
            fontWeight: i === template ? 600 : 400, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
          }}>{tp.name}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Left: editor */}
        <div style={{ width: "45%", flexShrink: 0 }}>
          <AccordionSection title="Hero Section" open={openSection === "hero"} onToggle={() => setOpenSection(openSection === "hero" ? null : "hero")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: C.textBody }}>Show on portfolio</span>
              <button onClick={() => setToggles(p => ({ ...p, hero: !p.hero }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.hero ? C.teal[400] : C.border, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
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
              <span style={{ fontSize: 13, color: C.textBody }}>Show on portfolio</span>
              <button onClick={() => setToggles(p => ({ ...p, about: !p.about }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.about ? C.teal[400] : C.border, border: "none", cursor: "pointer", position: "relative" }}>
                <span style={{ position: "absolute", top: 2, left: toggles.about ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }}/>
              </button>
            </div>
            <textarea style={{ ...fieldStyle, minHeight: 100 }} value={data.bio} onChange={setD("bio")}/>
          </AccordionSection>

          <AccordionSection title="Skills" open={openSection === "skills"} onToggle={() => setOpenSection(openSection === "skills" ? null : "skills")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: C.textBody }}>Show on portfolio</span>
              <button onClick={() => setToggles(p => ({ ...p, skills: !p.skills }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.skills ? C.teal[400] : C.border, border: "none", cursor: "pointer", position: "relative" }}>
                <span style={{ position: "absolute", top: 2, left: toggles.skills ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }}/>
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input style={fieldStyle} placeholder="Add skill" value={data.skillInput} onChange={setD("skillInput")} onKeyDown={e => { if (e.key === "Enter") addSkill(); }}/>
              <button onClick={addSkill} style={{ padding: "0 16px", borderRadius: 10, background: C.indigo[600], color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.skills.map(s => (
                <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.indigo[50], color: C.indigo[400], padding: "6px 12px", borderRadius: 999, fontSize: 12 }}>
                  {s}
                  <button onClick={() => removeSkill(s)} style={{ background: "none", border: "none", cursor: "pointer", color: C.indigo[400], fontSize: 13 }}>✕</button>
                </span>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection title="Projects" open={openSection === "projects"} onToggle={() => setOpenSection(openSection === "projects" ? null : "projects")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: C.textBody }}>Show on portfolio</span>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={projAdd} style={{ background: C.indigo[50], border: `1px solid ${C.indigo[400]}`, color: C.indigo[400], padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>+ Add</button>
                <button onClick={() => setToggles(p => ({ ...p, projects: !p.projects }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.projects ? C.teal[400] : C.border, border: "none", cursor: "pointer", position: "relative" }}>
                  <span style={{ position: "absolute", top: 2, left: toggles.projects ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }}/>
                </button>
              </span>
            </div>
            {data.projects.map((p, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10, position: "relative" }}>
                <button onClick={projRemove(i)} style={{ position: "absolute", top: 8, right: 8, background: C.coral[50], border: "none", color: C.coral[400], borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontWeight: 700, fontSize: 11 }}>✕</button>
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
              <span style={{ fontSize: 13, color: C.textBody }}>Show on portfolio</span>
              <button onClick={() => setToggles(p => ({ ...p, contact: !p.contact }))} style={{ width: 40, height: 20, borderRadius: 999, background: toggles.contact ? C.teal[400] : C.border, border: "none", cursor: "pointer", position: "relative" }}>
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
        <div style={{ flex: 1, background: "#111A30", borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <Badge color="violet">Live Preview · {t.name}</Badge>
            <span style={{ fontSize: 13, color: C.textMuted }}>Updates in real time</span>
          </div>
          {renderPreview(true)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 5 — AI Assistant
// ═══════════════════════════════════════════════════════════════════════════

const AI_SUGGESTIONS = [
  "Improve my portfolio headline",
  "Suggest projects to add",
  "Review my resume content",
  "Optimize for ATS",
];

function AIAssistantPage() {
  const [chats, setChats] = useState([{ id: 1, title: "Portfolio help", messages: [
    { from: "ai", text: "I'm your AI career assistant. I can help improve your portfolio, resume, LinkedIn, and more. What would you like to work on?" }
  ]}]);
  const [activeChat, setActiveChat] = useState(1);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const getChat = () => chats.find(c => c.id === activeChat);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    setInput("");
    const history = [
      ...getChat().messages.map(m => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })),
      { role: "user", content: msg },
    ];
    setChats(prev => prev.map(c => {
      if (c.id !== activeChat) return c;
      return { ...c, messages: [...c.messages, { from: "user", text: msg }] };
    }));
    setTyping(true);
    try {
      const { api } = await import("./src/api/client");
      const res = await api.post("/ai/chat", { messages: history });
      const reply = res?.reply || "Hmm, I got an empty response. Try rephrasing?";
      setChats(prev => prev.map(c => {
        if (c.id !== activeChat) return c;
        return { ...c, messages: [...c.messages, { from: "ai", text: reply }] };
      }));
    } catch (err) {
      setChats(prev => prev.map(c => {
        if (c.id !== activeChat) return c;
        return { ...c, messages: [...c.messages, { from: "ai", text: `⚠️ ${err.message}` }] };
      }));
    } finally {
      setTyping(false);
    }
  };

  const enhancement = (text) => {
    if (text.includes("Full Stack Developer")) return "✨ **Full Stack Developer** delivering **scalable, user-centric web products** — 5+ projects shipped, React + Node.js specialist focused on performance and clean architecture.";
    if (text.includes("library")) return "Built a full-featured library management system serving 1,200+ members, cutting book-loan processing time by 50% with automated reminders and real-time catalog search.";
    return text + " — enhanced ✨";
  };

  const applyAction = (action, idx) => {
    const c = getChat();
    const target = c.messages[idx];
    if (!target) return;
    let newText = target.text;
    if (action === "enhance") newText = enhancement(target.text);
    if (action === "shorten") newText = target.text.split(".").slice(0, 2).join(".") + ".";
    if (action === "professional") newText = "I have refined my professional positioning to emphasize measurable outcomes, technical depth, and alignment with hiring managers' priorities. " + target.text;
    setChats(prev => prev.map(ch => {
      if (ch.id !== activeChat) return ch;
      const msgs = ch.messages.map((m, i) => i === idx ? { ...m, text: newText } : m);
      return { ...ch, messages: msgs };
    }));
  };

  const copy = (text) => {
    try { navigator.clipboard.writeText(text.replace(/\*\*/g, "")); } catch (e) { /* clipboard may be unavailable */ }
  };

  const newChat = () => {
    const id = Date.now();
    setChats(prev => [...prev, { id, title: "New chat " + (prev.length + 1), messages: [
      { from: "ai", text: "I'm your AI career assistant. I can help improve your portfolio, resume, LinkedIn, and more. What would you like to work on?" }
    ]}]);
    setActiveChat(id);
  };

  const c = getChat();

  const renderRich = (text) => text.replace(/\*\*(.*?)\*\*/g, (m, g) => `<b>${g}</b>`);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", background: C.bg }}>
      {/* Left sidebar: conversation history */}
      <div style={{ width: 220, borderRight: `1px solid ${C.border}`, padding: "16px 12px", display: "flex", flexDirection: "column" }}>
        <button onClick={newChat} style={{ padding: "10px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", marginBottom: 14 }}>+ New Chat</button>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: 1, marginBottom: 8, padding: "0 8px" }}>CONVERSATIONS</div>
        {chats.map(ch => (
          <div key={ch.id} onClick={() => setActiveChat(ch.id)} style={{
            padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 13,
            background: ch.id === activeChat ? C.indigo[50] : "transparent",
            color: ch.id === activeChat ? C.indigo[400] : C.textBody, fontWeight: ch.id === activeChat ? 600 : 400,
            marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{ch.title}</div>
        ))}
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16, background: C.bg }}>
          {c.messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                padding: "12px 18px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.from === "user" ? `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})` : C.surface,
                color: m.from === "user" ? "#fff" : C.text, fontSize: 14, lineHeight: 1.6,
                border: m.from === "user" ? "none" : `1px solid ${C.border}`,
                boxShadow: m.from === "user" ? "none" : "0 2px 10px rgba(0,0,0,0.3)",
                maxWidth: "70%",
              }}
              dangerouslySetInnerHTML={{ __html: renderRich(m.text) }}
              />
              {m.from === "ai" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button onClick={() => applyAction("enhance", i)} style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${C.indigo[400]}`, background: C.indigo[50], color: C.indigo[400], fontSize: 11, cursor: "pointer" }}>✨ Enhance this content</button>
                  <button onClick={() => applyAction("shorten", i)} style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${C.violet[400]}`, background: C.violet[50], color: C.violet[400], fontSize: 11, cursor: "pointer" }}>✂️ Make it shorter</button>
                  <button onClick={() => applyAction("professional", i)} style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${C.teal[400]}`, background: C.teal[50], color: C.teal[400], fontSize: 11, cursor: "pointer" }}>💼 More professional</button>
                  <button onClick={() => copy(m.text)} style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${C.border}`, background: C.surface, color: C.textMuted, fontSize: 11, cursor: "pointer" }}>📋 Copy</button>
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: 6, padding: "12px 18px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, alignSelf: "flex-start" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.cyan[400], animation: "blink 1s infinite", animationDelay: `${i * 0.15}s` }}/>)}
            </div>
          )}
        </div>

        {/* Suggestion chips */}
        <div style={{ padding: "12px 32px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {AI_SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ padding: "7px 14px", borderRadius: 999, border: `1px solid ${C.indigo[100]}`, background: C.surface, color: C.indigo[400], fontSize: 12, cursor: "pointer" }}>{s}</button>
          ))}
        </div>

        <div style={{ padding: "16px 32px", display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Ask to improve your portfolio, resume, LinkedIn…"
            style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", background: "#1E2745", color: C.text }}
          />
          <button onClick={() => send()} style={{ background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, border: "none", borderRadius: 12, width: 48, height: 48, cursor: "pointer", color: "#fff", fontSize: 18 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 6 — Generators (Resume, LinkedIn, GitHub README, Cover Letter)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Resume Generator ────────────────────────────────────────────────────────
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
  const [generating, setGenerating] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [genError, setGenError] = useState(null);
  const set = (k) => (e) => setData(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { authApi } = await import("./src/api/auth");
        const { api } = await import("./src/api/client");
        const [meRes, profileRes] = await Promise.all([authApi.me().catch(() => null), api.get("/profile").catch(() => null)]);
        if (cancelled) return;
        const p = profileRes?.profile;
        setData(prev => ({
          ...prev,
          name: meRes?.user?.name || p?.user?.name || prev.name,
          email: meRes?.user?.email || prev.email,
          title: p?.title || prev.title,
          phone: p?.phone || prev.phone,
          summary: p?.bio || prev.summary,
          experience: p?.experience?.length
            ? p.experience.map(e => `${e.position}, ${e.company} (${(e.startDate||"").slice(0,4)}-${e.current ? "present" : (e.endDate||"").slice(0,4)}) — ${e.description || ""}`).join("\n")
            : prev.experience,
          education: p?.education?.length
            ? p.education.map(e => `${e.degree}, ${e.institution} (${e.startYear}-${e.endYear || "present"})`).join("\n")
            : prev.education,
          skills: p?.skills?.length ? p.skills.map(s => s.name).join(", ") : prev.skills,
        }));
      } catch (_) { /* keep defaults */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const generateWithAI = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      const { api } = await import("./src/api/client");
      const res = await api.post("/generate/resume");
      const r = res?.resume;
      if (!r) throw new Error("No resume returned");
      setData({
        name: r.personalInfo?.name || data.name,
        title: r.personalInfo?.title || data.title,
        email: r.personalInfo?.email || data.email,
        phone: r.personalInfo?.phone || data.phone,
        summary: r.summary || data.summary,
        experience: r.experience?.length
          ? r.experience.map(e => `${e.position}, ${e.company} (${(e.startDate||"").slice(0,4)}-${e.current ? "present" : (e.endDate||"").slice(0,4)}) — ${e.description || ""}`).join("\n")
          : data.experience,
        education: r.education?.length
          ? r.education.map(e => `${e.degree}${e.fieldOfStudy ? " in " + e.fieldOfStudy : ""}, ${e.institution} (${e.startYear}-${e.endYear || "present"})`).join("\n")
          : data.education,
        skills: r.skills?.length ? r.skills.map(s => s.name).join(", ") : data.skills,
      });
      if (r.atsScore != null) setAtsScore(r.atsScore);
    } catch (err) {
      setGenError(err.message || "Failed to generate resume. Complete your profile first.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPdf = () => {
    try {
      const win = window.open("", "_blank");
      if (!win) return alert("Popup blocked. Allow popups to download your resume.");
      win.document.write(`<!DOCTYPE html><html><head><title>${data.name} - Resume</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;padding:0 24px;color:#111}h1{margin:0;font-size:28px}p{line-height:1.6;margin:6px 0}.muted{color:#666;font-size:13px}.sec{margin-top:20px}.sec h3{text-transform:uppercase;font-size:12px;letter-spacing:1px;color:#3B82F6;margin:0 0 6px}pre{white-space:pre-wrap;font-family:inherit;line-height:1.6;margin:0}</style></head><body><div style="text-align:center;border-bottom:2px solid #111;padding-bottom:12px"><h1>${esc(data.name)}</h1><div style="color:#3B82F6;font-weight:600">${esc(data.title)}</div><div class="muted">${esc(data.email)} · ${esc(data.phone)}</div></div><div class="sec"><h3>Summary</h3><p>${esc(data.summary)}</p></div><div class="sec"><h3>Experience</h3><pre>${esc(data.experience)}</pre></div><div class="sec"><h3>Education</h3><p>${esc(data.education)}</p></div><div class="sec"><h3>Skills</h3><p>${esc(data.skills)}</p></div><script>window.onload=function(){window.print();}</script></body></html>`);
      win.document.close();
    } catch (e) { alert("Couldn't open PDF export."); }
  };
  const esc = (s) => String(s || "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Resume Generator</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Create an ATS-optimized resume with live preview.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {atsScore != null && <Badge color="teal">ATS {atsScore}</Badge>}
          <Btn variant="ghost" small onClick={downloadPdf}>⬇ Download as PDF</Btn>
          <Btn onClick={generateWithAI} disabled={generating}>{generating ? "Generating…" : "✨ Generate with AI"}</Btn>
        </div>
      </div>
      {genError && (
        <div style={{ background: C.coral[50], color: C.coral[400], border: `1px solid ${C.coral[400]}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>⚠️ {genError}</div>
      )}

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
          <div style={{ background: "#101A2E", borderRadius: 16, padding: 32, marginTop: 10 }}>
            <div style={{ background: C.surface, borderRadius: 4, padding: "40px 36px", boxShadow: "0 8px 30px rgba(0,0,0,0.4)", border: `1px solid ${C.border}`, minHeight: 480 }}>
              <div style={{ textAlign: "center", borderBottom: `2px solid ${C.border}`, paddingBottom: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{data.name}</div>
                <div style={{ fontSize: 14, color: C.indigo[400], fontWeight: 600, marginTop: 4 }}>{data.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>{data.email} · {data.phone}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.indigo[400], letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Summary</div>
                <div style={{ fontSize: 12, color: C.textBody, lineHeight: 1.6 }}>{data.summary}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.indigo[400], letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Experience</div>
                <div style={{ fontSize: 12, color: C.textBody, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{data.experience}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.indigo[400], letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Education</div>
                <div style={{ fontSize: 12, color: C.textBody, lineHeight: 1.6 }}>{data.education}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.indigo[400], letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Skills</div>
                <div style={{ fontSize: 12, color: C.textBody, lineHeight: 1.6 }}>{data.skills}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LinkedIn Generator ──────────────────────────────────────────────────────
function LinkedInGeneratorPage() {
  const [input, setInput] = useState({
    role: "Full Stack Developer",
    years: "2",
    skills: "React, Node.js, Python",
    goal: "Land a full-time developer role at a product company",
  });
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [output, setOutput] = useState(null);

  const set = (k) => (e) => setInput(p => ({ ...p, [k]: e.target.value }));
  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) { /* clipboard may be unavailable */ } };

  const generate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      const { api } = await import("./src/api/client");
      const res = await api.post("/generate/linkedin");
      const li = res?.linkedin;
      if (!li) throw new Error("No LinkedIn content returned");
      const experienceText = (li.experience || []).map(e =>
        `${[e.position, e.company].filter(Boolean).join(" — ")}${e.startDate ? ` (${e.startDate.slice(0,4)}-${e.current ? "present" : (e.endDate||"").slice(0,4)})` : ""}\n${e.description || ""}`
      ).join("\n\n");
      const featuredText = (li.featured || []).map(f => `• ${f.title}${f.url ? ` - ${f.url}` : ""}`).join("\n") || "—";
      setOutput({
        headline: li.headline || "",
        about: li.aboutSection || "",
        exp: experienceText || "—",
        featured: featuredText,
        posts: li.postSuggestions || [],
      });
      setGenerated(true);
    } catch (err) {
      setGenError(err.message || "Failed to generate LinkedIn content. Complete your profile first.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, marginBottom: 4 }}>LinkedIn Content Generator</h1>
      <p style={{ color: C.textMuted, fontSize: 14, marginTop: 0, marginBottom: 24 }}>Generate your LinkedIn presence from your saved profile.</p>
      {genError && (
        <div style={{ background: C.coral[50], color: C.coral[400], border: `1px solid ${C.coral[400]}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>⚠️ {genError}</div>
      )}

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 16 }}>Your Profile (auto-loaded)</h3>
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
        <button onClick={generate} disabled={generating} style={{ marginTop: 16, padding: "12px 28px", borderRadius: 10, background: generating ? "#334155" : `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: generating ? "not-allowed" : "pointer" }}>
          {generating ? "Generating…" : "✨ Generate All"}
        </button>
      </Card>

      {generated && output && (
        <>
          {[
            ["💼", "Professional Headline", output.headline],
            ["📝", "About Section", output.about],
            ["🏢", "Experience Descriptions", output.exp],
            ["⭐", "Featured Section Suggestions", output.featured],
          ].map(([icon, title, text], i) => (
            <Card key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, margin: 0 }}>{icon} {title}</h3>
                <button onClick={() => copy(text)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.indigo[400]}`, background: C.indigo[50], color: C.indigo[400], fontSize: 12, cursor: "pointer", fontWeight: 600 }}>📋 Copy</button>
              </div>
              <textarea style={{ ...fieldStyle, minHeight: 90, whiteSpace: "pre-wrap" }} defaultValue={text}/>
            </Card>
          ))}
          {output.posts.length > 0 && (
            <Card>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, margin: 0, marginBottom: 12 }}>💬 Post Suggestions</h3>
              {output.posts.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "10px 0", borderBottom: i < output.posts.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 13, color: C.textBody, flex: 1, lineHeight: 1.5 }}>{p}</span>
                  <button onClick={() => copy(p)} style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${C.indigo[400]}`, background: C.indigo[50], color: C.indigo[400], fontSize: 11, cursor: "pointer" }}>📋</button>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── GitHub README Generator ─────────────────────────────────────────────────
function GitHubReadmeGeneratorPage() {
  const [username, setUsername] = useState("your-username");
  const [repos, setRepos] = useState([]);
  const [repoInput, setRepoInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [generating] = useState(false);
  const [genError, setGenError] = useState(null);

  const loadDefault = async () => {
    try {
      const { authApi } = await import("./src/api/auth");
      const me = await authApi.me();
      const name = me?.user?.name;
      if (name) setUsername(name.toLowerCase().replace(/\s+/g, ""));
      const { api } = await import("./src/api/client");
      const res = await api.post("/generate/github-readme");
      const r = res?.readme;
      if (r) {
        setMarkdown(r.content || r.markdown || "");
        setRepos((r.repositories || []).map(x => x.name).filter(Boolean));
      }
    } catch (e) {
      setGenError(e.message || "Failed to load. Complete your profile first.");
    }
  };

  useEffect(() => { loadDefault(); }, []);

  const addRepo = () => { if (repoInput.trim() && !repos.includes(repoInput.trim())) setRepos(prev => [...prev, repoInput.trim()]); setRepoInput(""); };
  const removeRepo = (r) => setRepos(prev => prev.filter(x => x !== r));

  const deriveMarkdown = () => {
    if (markdown) return markdown;
    return `# Hi there, I'm @${username} 👋

## 👨‍💻 About Me
I'm a passionate software developer focused on building elegant, scalable web applications.

## 📌 Featured Projects
${repos.map(r => `- **${r}** — A project that demonstrates my skills in building real-world applications.`).join("\n")}

## 📫 Contact
- GitHub: [@${username}](https://github.com/${username})
`;
  };

  const copyMd = () => { try { navigator.clipboard.writeText(deriveMarkdown()); } catch (e) { /* clipboard may be unavailable */ } };

  const renderMarkdown = () => (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: 1.6, fontSize: 14, color: "#CBD5E1" }}>
      <h1 style={{ fontSize: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 8, color: C.text }}>Hi there, I&apos;m @{username} 👋</h1>
      <h2 style={{ fontSize: 18, marginTop: 16, color: C.text }}>👨‍💻 About Me</h2>
      <p>I&apos;m a passionate software developer focused on building elegant, scalable web applications.</p>
      <h2 style={{ fontSize: 18, marginTop: 16, color: C.text }}>📌 Featured Projects</h2>
      {repos.length > 0 ? repos.map(r => (
        <div key={r} style={{ marginLeft: 16, marginBottom: 4 }}>• <b>{r}</b> — A project that demonstrates my skills</div>
      )) : <div style={{ marginLeft: 16 }}>—</div>}
      <h2 style={{ fontSize: 18, marginTop: 16, color: C.text }}>📫 Contact</h2>
      <p>GitHub: <a style={{ color: "#3B82F6" }}>@{username}</a></p>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>GitHub README Generator</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Generate a professional profile README from your profile.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small onClick={copyMd}>📋 Copy Markdown</Btn>
          <Btn onClick={loadDefault} disabled={generating}>{generating ? "Generating…" : "✦ Generate"}</Btn>
        </div>
      </div>
      {genError && (
        <div style={{ background: C.coral[50], color: C.coral[400], border: `1px solid ${C.coral[400]}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>⚠️ {genError}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <Card>
            <label style={labelStyle}>GitHub Username</label>
            <input style={{ ...fieldStyle, marginBottom: 16 }} value={username} onChange={e => setUsername(e.target.value)}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Repositories to Highlight</label>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input style={fieldStyle} placeholder="repo-name" value={repoInput} onChange={e => setRepoInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addRepo(); }}/>
              <button onClick={addRepo} style={{ padding: "0 16px", borderRadius: 10, background: C.indigo[600], color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {repos.map(r => (
                <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.indigo[50], color: C.indigo[400], padding: "6px 12px", borderRadius: 999, fontSize: 12 }}>
                  {r}
                  <button onClick={() => removeRepo(r)} style={{ background: "none", border: "none", cursor: "pointer", color: C.indigo[400], fontSize: 13 }}>✕</button>
                </span>
              ))}
              {repos.length === 0 && <span style={{ fontSize: 12, color: C.textMuted }}>Click Generate to pull your projects.</span>}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
              Generated sections: About Me, Tech Stack, Featured Projects, Stats, Contact — pulled from your saved profile.
            </div>
          </Card>
        </div>

        <div>
          <Badge color="teal">Live Markdown Preview</Badge>
          <div style={{ background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`, padding: 28, marginTop: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.35)", maxHeight: 560, overflowY: "auto" }}>
            {markdown ? (
              <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap", fontSize: 12, color: "#CBD5E1" }}>{markdown}</div>
            ) : (
              renderMarkdown()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cover Letter Generator ──────────────────────────────────────────────────
function CoverLetterGeneratorPage() {
  const [input, setInput] = useState({ company: "", jobTitle: "", description: "" });
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [letter, setLetter] = useState("");
  const set = (k) => (e) => setInput(p => ({ ...p, [k]: e.target.value }));
  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) { /* clipboard may be unavailable */ } };

  const generateCoverLetter = async () => {
    if (!input.company.trim() || !input.jobTitle.trim()) {
      setGenError("Please enter both the company name and job title.");
      return;
    }
    setGenerating(true);
    setGenError(null);
    try {
      const { api } = await import("./src/api/client");
      const res = await api.post("/generate/cover-letter", {
        companyName: input.company,
        jobTitle: input.jobTitle,
        jobDescription: input.description,
      });
      const content = res?.coverLetter?.content;
      if (!content) throw new Error("No cover letter returned");
      setLetter(content);
      setGenerated(true);
    } catch (err) {
      setGenError(err.message || "Failed to generate. Complete your profile first.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadLetter = () => {
    try {
      const win = window.open("", "_blank");
      if (!win) return alert("Popup blocked. Allow popups to download your cover letter.");
      const esc = (s) => String(s || "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
      win.document.write(`<!DOCTYPE html><html><head><title>Cover Letter</title><style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;padding:0 24px;color:#111}pre{white-space:pre-wrap;font-family:inherit;line-height:1.8;font-size:14px}</style></head><body><pre>${esc(letter)}</pre><script>window.onload=function(){window.print();}</script></body></html>`);
      win.document.close();
    } catch (e) { alert("Couldn't open PDF export."); }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 800 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, marginBottom: 4 }}>Cover Letter Generator</h1>
      <p style={{ color: C.textMuted, fontSize: 14, marginTop: 0, marginBottom: 24 }}>Create a personalized cover letter from a job description.</p>
      {genError && (
        <div style={{ background: C.coral[50], color: C.coral[400], border: `1px solid ${C.coral[400]}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>⚠️ {genError}</div>
      )}

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 16 }}>Job Details</h3>
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
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Job Description</label>
          <textarea style={{ ...fieldStyle, minHeight: 100 }} placeholder="Paste the job description here…" value={input.description} onChange={set("description")}/>
        </div>
        <Btn onClick={generateCoverLetter} disabled={generating}>{generating ? "Generating…" : "✨ Generate Cover Letter"}</Btn>
      </Card>

      {generated && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Badge color="teal">Generated Letter</Badge>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" small onClick={() => copy(letter)}>📋 Copy</Btn>
              <Btn variant="outline" small onClick={downloadLetter}>⬇ Download</Btn>
            </div>
          </div>
          <div style={{ background: "#101A2E", borderRadius: 12, padding: 28 }}>
            <div style={{ background: C.surface, borderRadius: 4, padding: "36px 40px", boxShadow: "0 6px 24px rgba(0,0,0,0.4)", border: `1px solid ${C.border}`, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.7, color: C.textBody, minHeight: 400 }}>
              {letter}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 7 — Portfolio Score + Recruiter Simulation
// ═══════════════════════════════════════════════════════════════════════════

// ─── SVG Radar Chart ─────────────────────────────────────────────────────────
function RadarChart() {
  const dims = [
    { label: "Profile Completeness", value: 87 },
    { label: "Content Quality", value: 78 },
    { label: "Keyword Optimization", value: 72 },
    { label: "Visual Appeal", value: 90 },
    { label: "Recruiter Readiness", value: 78 },
  ];
  const size = 260, cx = size / 2, cy = size / 2;
  const R = size / 2 - 30;
  const n = dims.length;

  const point = (i, r) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", margin: "0 auto" }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f} points={dims.map((_, i) => point(i, R * f).join(",")).join(" ")} fill="none" stroke={C.border} strokeWidth={1}/>
      ))}
      {dims.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.border} strokeWidth={1}/>;
      })}
      <polygon points={dims.map((_, i) => point(i, R * dims[i].value / 100).join(",")).join(" ")} fill={C.indigo[400]} opacity={0.35} stroke={C.indigo[600]} strokeWidth={2}/>
      {dims.map((d, i) => {
        const [x, y] = point(i, R * d.value / 100);
        return <circle key={i} cx={x} cy={y} r={3.5} fill={C.indigo[600]}/>;
      })}
      {dims.map((d, i) => {
        const [x, y] = point(i, R + 18);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize={10} fill={C.textMuted} fontWeight={600}>{d.label.split(" ")[0]} {d.value}</text>
        );
      })}
    </svg>
  );
}

// ─── Portfolio Score Page ────────────────────────────────────────────────────
function PortfolioScorePage() {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  const loadScore = async () => {
    setLoading(true);
    try {
      const { api } = await import("./src/api/client");
      const data = await api.get("/score");
      setScore(data.score);
    } catch (_) {
      setScore(null);
    } finally {
      setLoading(false);
    }
  };

  const calculate = async () => {
    setCalculating(true);
    try {
      const { api } = await import("./src/api/client");
      const data = await api.post("/score/calculate");
      setScore(data.score);
    } catch (_) {
      /* ignore */
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => { loadScore(); }, []);

  const breakdown = score?.breakdown || {};
  const dimensions = [
    { label: "Profile Completeness", value: breakdown.profileCompleteness ?? 87, color: C.indigo[400], desc: "Complete personal info, skills, and contact details." },
    { label: "Content Quality", value: breakdown.contentQuality ?? 78, color: C.violet[400], desc: "Well-written descriptions with measurable impact." },
    { label: "Keyword Optimization", value: breakdown.keywordOptimization ?? 72, color: C.cyan[400], desc: "Presence of relevant skills and role keywords in content." },
    { label: "Visual Appeal", value: breakdown.visualAppeal ?? 90, color: C.amber[400], desc: "Design quality, layout, and professional look." },
    { label: "Recruiter Readiness", value: breakdown.recruiterReadiness ?? 78, color: C.coral[400], desc: "How quickly a recruiter can find key info." },
  ];
  const tips = score?.tips?.length
    ? score.tips.map(t => ({ text: t, points: "tip" }))
    : [
        { text: "Add a GitHub link to your projects", points: "+5 points" },
        { text: "Add a relevant certification", points: "+3 points" },
        { text: "Update project descriptions with impact metrics", points: "+2 points" },
        { text: "Add a professional profile photo", points: "+2 points" },
        { text: "Include your location and availability", points: "+1 point" },
      ];
  const overall = score?.score ?? 82;

  const renderTip = (t, i) => {
    if (typeof t === "string") {
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderBottom: i < tips.length - 1 ? `1px solid ${C.border}` : "none" }}>
          <span style={{ fontSize: 13, color: C.textBody, flex: 1 }}>{t}</span>
        </div>
      );
    }
    return (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < tips.length - 1 ? `1px solid ${C.border}` : "none" }}>
        <span style={{ fontSize: 13, color: C.textBody, flex: 1 }}>{t.text.split(" (+")[0]}</span>
        <Badge color="teal">+{t.text.split("(")[1]?.replace(")", "") || "5 points"}</Badge>
      </div>
    );
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <Badge color="indigo">My Score</Badge>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
          <ScoreRing score={overall} size={120} color={C.indigo[600]}/>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 4 }}>Overall Score</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: C.text }}>{loading ? "…" : overall}<span style={{ fontSize: 20, color: C.textMuted }}>/100</span></div>
            <button onClick={calculate} disabled={calculating} style={{ marginTop: 12, padding: "10px 20px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: calculating ? "wait" : "pointer" }}>
              {calculating ? "Calculating…" : "↻ Recalculate Score"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, marginBottom: 24 }}>
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 12 }}>Score Dimensions</h3>
          <RadarChart/>
        </Card>
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 16 }}>Detailed Breakdown</h3>
          {dimensions.map(d => (
            <div key={d.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textBody }}>{d.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.value}/100</span>
              </div>
              <div style={{ height: 8, background: C.border, borderRadius: 999 }}>
                <div style={{ height: "100%", width: `${d.value}%`, background: d.color, borderRadius: 999, transition: "width 0.5s" }}/>
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{d.desc}</div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 14 }}>Improvement Tips</h3>
          {tips.map((t, i) => renderTip(t, i))}
        </Card>
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 14 }}>Score History</h3>
          <svg width="100%" height={120} viewBox="0 0 300 120" style={{ display: "block" }}>
            {[["Mar",70],["Apr",74],["May",76],["Jun",78],["Jul",82]].map(([l, v], i, arr) => {
              const x = 20 + (i / (arr.length - 1)) * 260;
              const y = 105 - ((v - 60) / 30) * 90;
              return <circle key={l} cx={x} cy={y} r={5} fill={C.indigo[600]}/>;
            })}
            {[["Mar",70],["Apr",74],["May",76],["Jun",78],["Jul",82]].map(([_l, v], i, arr) => {
              const x = 20 + (i / (arr.length - 1)) * 260;
              const y = 105 - ((v - 60) / 30) * 90;
              if (i < arr.length - 1) {
                const x2 = 20 + ((i + 1) / (arr.length - 1)) * 260;
                const y2 = 105 - ((arr[i + 1][1] - 60) / 30) * 90;
                return <line key={i} x1={x} y1={y} x2={x2} y2={y2} stroke={C.indigo[400]} strokeWidth={2}/>;
              }
              return null;
            })}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {["Mar","Apr","May","Jun","Jul"].map(m => <span key={m} style={{ fontSize: 11, color: C.textMuted }}>{m}</span>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Recruiter Simulation Page ───────────────────────────────────────────────
function RecruiterSimulationPage({ nav }) {
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadingSim, setLoadingSim] = useState(false);
  const [simError, setSimError] = useState(null);
  const [simulations, setSimulations] = useState([]);

  const startSim = async () => {
    setStarted(true);
    setLoadingSim(true);
    setSimError(null);
    try {
      const { api } = await import("./src/api/client");
      const res = await api.get("/score/recruiter-simulation");
      const sims = res?.simulations || [];
      setSimulations(sims);
      if (sims.length) {
        const sim = sims[0];
        const like = sim.likelihood ?? 70;
        setFeedback({
          firstImpression: Math.max(1, Math.round(like / 20)),
          technical: Math.max(1, Math.round(like / 22)),
          communication: Math.max(1, Math.round(like / 25)),
          overall: `Evaluating your candidacy for ${sim.role || "the role"} at ${sim.company || "the company"}: our simulated recruiter estimates your likelihood of advancing is around ${like}%. ${(sim.feedback || []).join(" ")}`,
          strengths: (sim.matchReasons || []).filter(Boolean),
          improvements: (sim.feedback || []).filter(Boolean),
          label: `${sim.recruiterName || "Recruiter"}, ${sim.company || ""}`,
        });
      } else {
        setFeedback(null);
        setSimError("No simulation results available yet. Complete your profile first.");
      }
    } catch (err) {
      setSimError(err.message || "Failed to run recruiter simulation. Complete your profile first.");
    } finally {
      setLoadingSim(false);
    }
  };

  const StarRow = ({ value }) => (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 18, color: i <= value ? C.amber[400] : C.border }}>★</span>
      ))}
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Recruiter Simulation</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>See your portfolio through a recruiter&apos;s eyes.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small onClick={() => nav("#score")}>← Back to Score</Btn>
          {feedback && <Btn onClick={startSim}>↻ Re-run Simulation</Btn>}
        </div>
      </div>

      {!started && (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>👔</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>Ready to be evaluated by a virtual recruiter?</h3>
          <p style={{ fontSize: 14, color: C.textMuted, maxWidth: 460, margin: "0 auto 24px" }}>Our AI will walk through each section of your portfolio — hero, about, skills, projects, and contact — and give you honest, actionable feedback.</p>
          <Btn variant="primary" onClick={startSim}>🚀 Start Simulation</Btn>
        </Card>
      )}

      {started && !feedback && !simError && (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 40, marginBottom: 16, animation: "blink 1s infinite" }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{loadingSim ? "Recruiter is reviewing your portfolio…" : "Ready to be evaluated by a virtual recruiter?"}</h3>
          <p style={{ fontSize: 13, color: C.textMuted }}>{loadingSim ? "Scanning hero section, about, skills, projects, and contact info." : "Press Start Simulation to begin."}</p>
        </Card>
      )}

      {simError && (
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Couldn&apos;t run the simulation</h3>
          <p style={{ fontSize: 13, color: C.coral[400], margin: "0 0 16px" }}>{simError}</p>
          <Btn variant="outline" onClick={() => { setSimError(null); setStarted(false); }}>← Try Again</Btn>
        </Card>
      )}

      {feedback && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, margin: 0 }}>AI Recruiter Feedback</h3>
              {feedback.label && <Badge color="indigo">{feedback.label}</Badge>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>First Impression</div>
                <StarRow value={feedback.firstImpression}/>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>Technical Depth</div>
                <StarRow value={feedback.technical}/>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>Communication Quality</div>
                <StarRow value={feedback.communication}/>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>Overall Assessment</div>
              <p style={{ margin: 0, fontSize: 13, color: C.textBody, lineHeight: 1.6 }}>{feedback.overall}</p>
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "#34D399", marginBottom: 12 }}>✓ Strengths</h3>
              {feedback.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: "#34D399", fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.textBody, lineHeight: 1.4 }}>{s}</span>
                </div>
              ))}
            </Card>
            <Card>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: C.amber[400], marginBottom: 12 }}>△ Areas for Improvement</h3>
              {feedback.improvements.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: C.amber[400], fontSize: 14 }}>△</span>
                  <span style={{ fontSize: 13, color: C.textBody, lineHeight: 1.4 }}>{s}</span>
                </div>
              ))}
            </Card>
          </div>

          {simulations.length > 1 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 12 }}>All Evaluations</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {simulations.map((sim) => (
                  <div key={sim.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{sim.company}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>{sim.recruiterName} · {sim.role}</div>
                      </div>
                      <Badge color="teal">{sim.likelihood}% match</Badge>
                    </div>
                    {(sim.feedback || []).slice(0, 2).map((f, i) => (
                      <div key={i} style={{ fontSize: 12.5, color: C.textBody, lineHeight: 1.5 }}>• {f}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 7b — Documents Hub, Career Match, Feedback
// ═══════════════════════════════════════════════════════════════════════════

function DocumentsHubPage({ nav }) {
  const [docs, setDocs] = useState([]);
  const [counts, setCounts] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { api } = await import("./src/api/client");
      const res = await api.get("/generate/documents");
      setDocs(res?.documents || []);
      setCounts(res?.counts || { total: 0 });
    } catch (e) {
      setDocs([]);
      setCounts({ total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openPreview = (d) => {
    let text = "";
    if (d.type === "Resume" && d.content) {
      const c = d.content;
      text = `Name: ${c.personalInfo?.name || ""}\nTitle: ${c.personalInfo?.title || ""}\n\nSummary:\n${c.summary || ""}\n\nExperience:\n${(c.experience || []).map(e => `${e.position} at ${e.company}${e.startDate ? ` (${e.startDate.slice(0,4)}-${e.current ? "present" : (e.endDate||"").slice(0,4)})` : ""} — ${e.description || ""}`).join("\n")}\n\nSkills:\n${(c.skills || []).map(s => s.name).join(", ")}`;
    } else if (d.type === "Cover Letter" && d.content?.content) {
      text = d.content.content;
    } else if (d.type === "GitHub" && d.content?.content) {
      text = d.content.content;
    } else if (d.type === "LinkedIn" && d.content?.aboutSection) {
      text = `Headline:\n${d.content.headline || ""}\n\nAbout Section:\n${d.content.aboutSection || ""}`;
    }
    setPreview({ ...d, text });
  };

  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (_) { /* ignore */ } };

  const typeMeta = {
    Resume: { icon: "📄", color: C.indigo[400] },
    LinkedIn: { icon: "💼", color: C.cyan[400] },
    GitHub: { icon: "🐙", color: C.violet[400] },
    "Cover Letter": { icon: "✉️", color: C.amber[400] },
    Portfolio: { icon: "🖥️", color: C.teal[400] },
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Documents Hub</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>All your generated professional documents in one place.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small onClick={() => nav("#portfolio")}>New Portfolio</Btn>
          <Btn variant="ghost" small onClick={() => nav("#resume")}>New Resume</Btn>
          <Btn variant="ghost" small onClick={() => nav("#cover-letter")}>New Cover Letter</Btn>
        </div>
      </div>

      {counts.total > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          <MetricCard label="Resumes" value={counts.resumes ?? 0} sub="Generated" color={C.indigo[400]}/>
          <MetricCard label="LinkedIn" value={counts.linkedin ?? 0} sub="Profiles" color={C.cyan[400]}/>
          <MetricCard label="GitHub" value={counts.github ?? 0} sub="Readmes" color={C.violet[400]}/>
          <MetricCard label="Cover Letters" value={counts.coverLetters ?? 0} sub="Written" color={C.amber[400]}/>
        </div>
      )}

      {loading ? (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}><p style={{ color: C.textMuted }}>Loading your documents…</p></Card>
      ) : docs.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>No documents yet</h3>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>Generate a resume, LinkedIn profile, GitHub README, or cover letter and it appears here.</p>
          <Btn onClick={() => nav("#resume")}>+ Create your first document</Btn>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 12 }}>All Documents ({docs.length})</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {docs.map((d) => {
                const meta = typeMeta[d.type] || { icon: "📄", color: C.indigo[400] };
                return (
                  <Card key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      <div style={{ fontSize: 26 }}>{meta.icon}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>
                          {d.type}
                          {d.atsScore != null && ` · ATS ${d.atsScore}`} · {d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : "—"}
                        </div>
                      </div>
                    </div>
                    <Btn variant="outline" small onClick={() => openPreview(d)}>View</Btn>
                  </Card>
                );
              })}
            </div>
          </div>

          {preview ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, margin: 0 }}>{preview.name}</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="ghost" small onClick={() => copy(preview.text)}>📋 Copy</Btn>
                  <Btn variant="ghost" small onClick={() => setPreview(null)}>✕ Close</Btn>
                </div>
              </div>
              <div style={{ background: "#101A2E", borderRadius: 12, padding: 20 }}>
                <div style={{ background: C.surface, borderRadius: 6, border: `1px solid ${C.border}`, padding: 24, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.7, color: C.textBody, maxHeight: 520, overflowY: "auto" }}>
                  {preview.text}
                </div>
              </div>
            </div>
          ) : (
            <Card style={{ textAlign: "center", padding: "40px", color: C.textMuted }}>Select a document to preview it.</Card>
          )}
        </div>
      )}
    </div>
  );
}

function CareerMatchPage({ nav }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { api } = await import("./src/api/client");
        const scoreRes = await api.get("/score");
        let m = [];
        if (scoreRes?.score) {
          const b = scoreRes.score.breakdown || {};
          const base = Math.round((b.keywordOptimization ?? 70) / 10);
          m = [
            { title: "Full Stack Developer", tag: "Best match", match: Math.min(96, base + 5), skills: ["React", "Node.js", "PostgreSQL"], type: "Remote · Full-time" },
            { title: "Frontend Engineer", tag: "Strong", match: Math.min(96, base + 3), skills: ["React", "TypeScript", "CSS"], type: "Hybrid · Full-time" },
            { title: "Software Engineer", tag: "Great fit", match: Math.min(96, base), skills: ["JavaScript", "SQL", "Git"], type: "On-site · Full-time" },
            { title: "Product Engineer", tag: "Good", match: Math.max(60, base - 4), skills: ["React", "Node.js", "AWS"], type: "Remote · Full-time" },
          ];
        }
        if (!cancelled) setMatches(m);
      } catch (_) {
        if (!cancelled) setMatches([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const badgeColor = { "Best match": "teal", Strong: "indigo", "Great fit": "violet", Good: "cyan" };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Career Match</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Roles that align with your skills and profile.</p>
        </div>
        <Btn variant="ghost" small onClick={() => nav("#score")}>View full score</Btn>
      </div>

      {loading ? (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}><p style={{ color: C.textMuted }}>Calculating matches…</p></Card>
      ) : matches.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>No matches yet</h3>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>Complete your profile to get personalized role recommendations.</p>
          <Btn onClick={() => nav("#profile-form")}>Build my profile</Btn>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {matches.map((m, i) => (
            <Card key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{m.title}</h3>
                  <Badge color={badgeColor[m.tag] || "indigo"}>{m.tag}</Badge>
                </div>
                <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 4 }}>{m.type}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {m.skills.map((s, j) => (
                    <span key={j} style={{ background: C.indigo[50], color: C.indigo[400], padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.teal[400] }}>{m.match}%</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>match</div>
                <button onClick={() => alert(`You've been redirected to a draft application for the ${m.title} role (this is a demo).`)} style={{ marginTop: 10, padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>Apply</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackPage({ nav }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { api } = await import("./src/api/client");
        const [scoreRes, docsRes] = await Promise.all([
          api.get("/score"),
          api.get("/generate/documents"),
        ]);
        if (cancelled) return;
        const score = scoreRes?.score;
        const docs = docsRes?.documents || [];
        const b = score?.breakdown || {};
        const tips = (score?.tips || []).map(t => ({ text: typeof t === "string" ? t : t, points: "tip" }));
        const items = [
          { icon: "📊", label: "Overall Score", value: score?.score ?? 0, note: b.keywordOptimization != null ? `Keyword optimization: ${b.keywordOptimization}/100` : null },
          { icon: "📄", label: "Content Quality", value: b.contentQuality ?? 0, note: b.contentQuality != null ? (b.contentQuality >= 75 ? "Strong content" : "Add more detail and impact") : null },
          { icon: "🚀", label: "Documents Generated", value: docs.length, note: docs.length === 0 ? "Generate your first document" : `${docs.length} assets ready` },
        ];
        setFeedback({ items, tips });
      } catch (_) {
        if (!cancelled) setFeedback(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Feedback & Suggestions</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Personalized insights to improve your professional profile.</p>
        </div>
        <Btn variant="ghost" small onClick={() => nav("#score")}>View score breakdown</Btn>
      </div>

      {loading ? (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}><p style={{ color: C.textMuted }}>Analyzing your profile…</p></Card>
      ) : !feedback ? (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Nothing to analyze yet</h3>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>Complete your profile and run a score to get feedback.</p>
          <Btn onClick={() => nav("#profile-form")}>Complete my profile</Btn>
        </Card>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
            {feedback.items.map((it, i) => (
              <Card key={i}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{it.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.text }}>{it.value}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.textBody, marginTop: 2 }}>{it.label}</div>
                {it.note && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{it.note}</div>}
              </Card>
            ))}
          </div>

          <Card>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 16 }}>💡 Suggestions to Improve</h3>
            {Array.isArray(feedback.tips) && feedback.tips.length > 0 ? (
              feedback.tips.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: i < feedback.tips.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ color: C.indigo[400], fontWeight: 800 }}>→</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, color: C.textBody, lineHeight: 1.5 }}>{typeof t.text === "string" ? t.text : JSON.stringify(t)}</span>
                  </div>
                  {t.points && <Badge color="teal">{t.points}</Badge>}
                </div>
              ))
            ) : (
              <p style={{ fontSize: 13, color: C.textMuted }}>Complete your profile to unlock personalized suggestions.</p>
            )}
          </Card>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={() => nav("#profile-form")}>Apply improvements ✨</Btn>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 7c — Public Portfolio View
// ═══════════════════════════════════════════════════════════════════════════

function PublicPortfolioPage({ slug }) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { api } = await import("./src/api/client");
        const res = await api.get(`/portfolio/${encodeURIComponent(slug)}`);
        if (cancelled) return;
        setPortfolio(res?.portfolio || null);
      } catch (e) {
        if (!cancelled) setError(e.message || "Portfolio not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const renderSection = (s) => {
    const c = s.content || {};
    switch (s.type) {
      case "hero":
        return (
          <div style={{ textAlign: "center", padding: "60px 20px 40px" }}>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: C.text, margin: 0 }}>{c.name || portfolio?.user?.name || "Hello, I'm"}</h1>
            {c.tagline && <div style={{ fontSize: 18, fontWeight: 600, color: C.indigo[400], marginTop: 8 }}>{c.tagline}</div>}
            {c.subtitle && <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0" }}>{c.subtitle}</p>}
          </div>
        );
      case "about":
        return (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>{s.title || "About Me"}</h2>
            {c.intro && <p style={{ fontSize: 14, color: C.textBody, lineHeight: 1.7 }}>{c.intro}</p>}
            {(c.highlights || []).length > 0 && (
              <ul style={{ fontSize: 14, color: C.textBody, lineHeight: 1.7, marginTop: 12 }}>
                {c.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            )}
          </div>
        );
      case "skills":
        return (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>{s.title || "Skills"}</h2>
            <p style={{ fontSize: 13, color: C.textMuted }}>Skills configured in the builder.</p>
          </div>
        );
      case "projects":
        return (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>{s.title || "Projects"}</h2>
            <p style={{ fontSize: 13, color: C.textMuted }}>Projects configured in the builder.</p>
          </div>
        );
      case "contact":
        return (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>{c.heading || s.title || "Get In Touch"}</h2>
            {c.message && <p style={{ fontSize: 14, color: C.textBody, lineHeight: 1.7 }}>{c.message}</p>}
            {portfolio?.user?.email && (
              <div style={{ marginTop: 12 }}>
                <a href={`mailto:${portfolio.user.email}`} style={{ color: C.indigo[400], fontSize: 14, fontWeight: 600 }}>{portfolio.user.email}</a>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>{s.title || "Section"}</h2>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <style>{`* { box-sizing: border-box; } body { margin: 0; background: #0F172A; color: #F8FAFC; }`}</style>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 24px 60px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <a href="#home" style={{ fontSize: 13, color: C.textMuted, textDecoration: "none" }}>CareersCraft Home →</a>
        </div>

        {loading && <div style={{ textAlign: "center", padding: 80, color: C.textMuted }}>Loading portfolio…</div>}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Portfolio not found</h2>
            <p style={{ fontSize: 14, color: C.textMuted }}>{error}</p>
            <a href="#home" style={{ display: "inline-block", marginTop: 16, padding: "11px 24px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Back to Home</a>
          </div>
        )}

        {!loading && !error && portfolio && (
          <>
            <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "20px 28px", marginBottom: 24 }}>
              {portfolio.sections
                .filter((s) => s.visible !== false)
                .sort((a, b) => a.order - b.order)
                .map((s) => renderSection(s))}
              <div style={{ textAlign: "center", fontSize: 12, color: C.textMuted, paddingTop: 20, marginTop: 20, borderTop: `1px solid ${C.border}` }}>
                Built with CareersCraft · {portfolio.viewCount ?? 0} views
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 8 — Settings Page
// ═══════════════════════════════════════════════════════════════════════════

function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} style={{ width: 44, height: 24, borderRadius: 999, background: on ? C.teal[400] : C.border, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}/>
    </button>
  );
}

function SettingsPage({ nav }) {
  const [tab, setTab] = useState("account");
  const [account, setAccount] = useState({ name: "", email: "", phone: "" });
  const [notifications, setNotifications] = useState({ email: true, score: true, ai: true, weekly: false });
  const [privacy, setPrivacy] = useState({ visibility: "public", profileVisible: true });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    ["account", "Account"], ["notifications", "Notifications"], ["privacy", "Privacy"], ["danger", "Danger Zone"],
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { api } = await import("./src/api/client");
        const { authApi } = await import("./src/api/auth");
        const [settingsRes, meRes] = await Promise.all([api.get("/settings"), authApi.me().catch(() => null)]);
        if (cancelled) return;
        const s = settingsRes.settings;
        setNotifications({
          email: !!s.emailNotifications,
          score: !!s.scoreUpdates,
          ai: !!s.aiSuggestions,
          weekly: !!s.weeklyReport,
        });
        setPrivacy({
          visibility: s.portfolioVisibility || "public",
          profileVisible: s.profileVisibility !== "private",
        });
        if (meRes?.user) {
          setAccount(p => ({ ...p, name: meRes.user.name || "", email: meRes.user.email || "" }));
        }
      } catch (_) {
        /* settings not loaded yet */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const save = async () => {
    setError(null);
    try {
      const { api } = await import("./src/api/client");
      const { authApi } = await import("./src/api/auth");
      await api.put("/settings", {
        emailNotifications: notifications.email,
        scoreUpdates: notifications.score,
        aiSuggestions: notifications.ai,
        weeklyReport: notifications.weekly,
        portfolioVisibility: privacy.visibility,
        profileVisibility: privacy.profileVisible ? "public" : "private",
      });
      if (account.name) await authApi.saveName(account.name).catch(() => {});
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || "Failed to save settings");
    }
  };

  const acctSet = (k) => (e) => setAccount(p => ({ ...p, [k]: e.target.value }));
  const notifToggle = (k) => () => setNotifications(p => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 680 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, marginBottom: 20 }}>Settings</h1>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "9px 18px", borderRadius: 999, border: "none", cursor: "pointer",
            background: tab === key ? `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})` : C.indigo[50],
            color: tab === key ? "#fff" : C.indigo[400], fontWeight: 600, fontSize: 13,
          }}>{label}</button>
        ))}
      </div>

      {/* Account tab */}
      {tab === "account" && (
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 18 }}>Account Information</h3>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Name</label>
            <input style={fieldStyle} value={account.name} onChange={acctSet("name")}/>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <input style={fieldStyle} value={account.email} onChange={acctSet("email")}/>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Phone</label>
            <input style={fieldStyle} value={account.phone} onChange={acctSet("phone")} placeholder="+91 98765 43210"/>
          </div>
          {error && <div style={{ color: C.coral[400], fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <Btn onClick={save} disabled={loading}>{saved ? "✓ Saved" : "Save Changes"}</Btn>
        </Card>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 18 }}>Notifications</h3>
          {[
            ["Email notifications", "Receive emails about important updates", "email"],
            ["Score updates", "Get notified when your portfolio score changes", "score"],
            ["AI suggestions", "Weekly AI tips to improve your profile", "ai"],
            ["Weekly report", "A summary of your activity every week", "weekly"],
          ].map(([title, desc, key]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{title}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{desc}</div>
              </div>
              <Toggle on={notifications[key]} onChange={notifToggle(key)}/>
            </div>
          ))}
        </Card>
      )}

      {/* Privacy tab */}
      {tab === "privacy" && (
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 18 }}>Privacy</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Portfolio Visibility</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Who can see your public portfolio</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["public", "private"].map(v => (
                <button key={v} onClick={() => setPrivacy(p => ({ ...p, visibility: v }))} style={{
                  padding: "8px 16px", borderRadius: 999, border: `1.5px solid ${privacy.visibility === v ? C.indigo[400] : C.border}`,
                  background: privacy.visibility === v ? C.indigo[50] : C.surface,
                  color: privacy.visibility === v ? C.indigo[400] : C.textMuted, fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize",
                }}>{v}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Profile visibility</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Show your profile to recruiters</div>
            </div>
            <Toggle on={privacy.profileVisible} onChange={() => setPrivacy(p => ({ ...p, profileVisible: !p.profileVisible }))}/>
          </div>
        </Card>
      )}

      {/* Danger Zone tab */}
      {tab === "danger" && (
        <Card style={{ borderColor: C.coral[400] }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C.coral[400], marginBottom: 18 }}>Danger Zone</h3>
          <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 18 }}>
            Deleting your account is permanent. All your portfolios, resumes, and generated content will be removed. This action cannot be undone.
          </p>
          <button onClick={() => { if (window.confirm("Are you sure you want to delete your account?")) nav("#home"); }} style={{
            padding: "12px 24px", borderRadius: 10, background: C.surface, border: `1.5px solid ${C.coral[400]}`, color: C.coral[400],
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>🗑 Delete Account</button>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Dashboard Layout
// ═══════════════════════════════════════════════════════════════════════════

function DashboardLayout({ children, nav, route }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 240;
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <EnhancedSidebar nav={nav} route={route} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}/>
      <div style={{ marginLeft: sidebarWidth, flex: 1, transition: "margin-left 0.25s ease", minWidth: 0 }}>
        <TopHeader route={route} nav={nav}/>
        <div style={{ paddingTop: 64 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function LegalPage({ kind }) {
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const updated = "January 2026";
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 28px 60px" }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: C.text, marginBottom: 8 }}>{title}</h1>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 32 }}>Last updated: {updated}</div>
        <div style={{ fontSize: 15, color: C.textBody, lineHeight: 1.8 }}>
          <Section title="1. Information We Collect">
            <p>CareerCraft collects the information you provide when you create an account and build your professional profile — including your name, email address, skills, projects, education, and other details you enter. We may also collect basic usage data such as pages visited and actions taken to improve our service.</p>
          </Section>
          <Section title="2. How We Use Your Information">
            <p>We use your information to generate your portfolio, resume, LinkedIn content, GitHub README, and cover letters; to calculate your portfolio score; to send you transactional emails; and to improve and secure our service. We never sell your personal data.</p>
          </Section>
          <Section title="3. Data Storage & Security">
            <p>Your data is stored on secure servers protected by encryption in transit (HTTPS) and at rest. Passwords are hashed using bcrypt and are never stored in plain text. Access to your data is restricted to authenticated users with a valid session token.</p>
          </Section>
          <Section title="4. Cookies & Local Storage">
            <p>We use local storage to keep you signed in and remember your preferences. We may use cookies for analytics and essential site functionality. You can disable cookies in your browser, though some features may not work as intended.</p>
          </Section>
          {isPrivacy && (
            <Section title="5. Your Rights">
              <p>You may access, correct, or delete your personal data at any time. To delete your account and associated data, contact us and we will remove it within 30 days.</p>
            </Section>
          )}
          {!isPrivacy && (
            <Section title="5. Acceptable Use">
              <p>You agree not to misuse the service, attempt to gain unauthorized access, or generate content that violates applicable law. We may suspend accounts that breach these terms.</p>
            </Section>
          )}
          <Section title="6. Contact">
            <p>Questions about this policy? Contact us at <span style={{ color: C.indigo[400] }}>support@careercraft.dev</span>.</p>
          </Section>
        </div>
        <div style={{ marginTop: 40 }}>
          <button onClick={() => { window.location.hash = "#home"; }} style={{ padding: "12px 28px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 10 }}>{title}</h2>
      {children}
    </div>
  );
}

function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem("careercraft_cookie_consent");
    } catch (_) {
      return true;
    }
  });
  const accept = () => {
    try { localStorage.setItem("careercraft_cookie_consent", "accepted"); } catch (_) { /* ignore */ }
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 200,
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px",
      maxWidth: 560, width: "calc(100% - 40px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    }}>
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>We use cookies 🍪</div>
        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
          We use cookies and local storage to keep you signed in and improve your experience. See our{" "}
          <span style={{ color: C.indigo[400], cursor: "pointer" }} onClick={() => { window.location.hash = "#privacy"; }}>Privacy Policy</span>.
        </div>
      </div>
      <button onClick={accept} style={{ padding: "10px 22px", borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Got it</button>
    </div>
  );
}

// ─── App / Router ────────────────────────────────────────────────────────────
export default function App() {
  const [route, nav] = useRoute();

  // Global auth handling: process OAuth/magic-link callbacks, keep the user
  // signed in, redirect already-authed users away from the auth screens, and
  // route new vs returning users appropriately after a session is established.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { supabase, isSupabaseConfigured } = await import("./src/api/supabase");
      if (!isSupabaseConfigured() || !supabase) return;

      /**** OAuth / magic-link callback ****/
      const hash = window.location.hash;
      const isCallback =
        hash.includes("access_token") || hash.includes("type=") || hash.includes("error=");
      if (isCallback) {
        try {
          await supabase.auth.getSession();
          // Supabase sanitises the URL fragment after processing the session.
        } catch (_) { /* ignore */ }
      }

      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (cancelled) return;

      if (!user) {
        // Signed out: make sure auth screens show (no redirect needed).
        return;
      }

      // Authenticated user landed on an auth screen -> go to dashboard or onboarding.
      if (route === "#login" || route === "#register") {
        const isNew = await needsOnboarding(user.id);
        window.location.hash = isNew ? "#onboarding" : "#dashboard";
      } else if (isCallback && !route) {
        // OAuth returned to a bare URL -> send them into the app.
        const isNew = await needsOnboarding(user.id);
        window.location.hash = isNew ? "#onboarding" : "#dashboard";
      }
    })();
    return () => { cancelled = true; };
  }, [route]);

  const isDash = ["#dashboard","#portfolio","#resume","#linkedin","#github-readme","#cover-letter","#score","#recruiter-sim","#ai-assistant","#profile-form","#settings","#documents","#career-match","#feedback"].includes(route);

  const publicMatch = route && route.startsWith("#portfolio/");
  if (publicMatch) {
    const slug = route.replace("#portfolio/", "").split(/[?#]/)[0];
    return <PublicPortfolioPage slug={slug}/>;
  }

  if (isDash) {
    return (
      <DashboardLayout nav={nav} route={route}>
        {route === "#dashboard"     && <EnhancedDashboardHome nav={nav}/>}
        {route === "#profile-form"  && <ProfileBuilderPage/>}
        {route === "#portfolio"     && <PortfolioBuilderPage/>}
        {route === "#ai-assistant"  && <AIAssistantPage/>}
        {route === "#resume"        && <ResumeGeneratorPage/>}
        {route === "#linkedin"      && <LinkedInGeneratorPage/>}
        {route === "#github-readme" && <GitHubReadmeGeneratorPage/>}
        {route === "#cover-letter"  && <CoverLetterGeneratorPage/>}
        {route === "#score"         && <PortfolioScorePage nav={nav}/>}
        {route === "#recruiter-sim" && <RecruiterSimulationPage nav={nav}/>}
        {route === "#settings"      && <SettingsPage nav={nav}/>}
        {route === "#documents"     && <DocumentsHubPage nav={nav}/>}
        {route === "#career-match"  && <CareerMatchPage nav={nav}/>}
        {route === "#feedback"      && <FeedbackPage nav={nav}/>}
      </DashboardLayout>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 84px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        body { margin: 0; background: #0F172A; color: #F8FAFC; -webkit-overflow-scrolling: touch; }
        input, textarea { color-scheme: dark; }
        ::selection { background: rgba(124,58,237,0.5); color: #fff; }
        /* Consistent vertical rhythm using an 8px spacing system */
        h1, h2, h3, h4 { margin: 0; line-height: 1.2; }
        p { line-height: 1.7; }
        /* Subtle scrollbar for a polished feel */
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2b3648; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b4a63; }
        /* Keyboard-accessible focus rings with consistent balance */
        button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid #A855F7; outline-offset: 2px;
        }
      `}</style>

      {route === "#login"      && <LoginPage nav={nav}/>}
      {route === "#register"   && <RegisterPage nav={nav}/>}
      {route === "#onboarding" && <OnboardingPage nav={nav}/>}
      {route === "#privacy"    && <LegalPage kind="privacy"/>}
      {route === "#terms"      && <LegalPage kind="terms"/>}

      {(route === "#home" || route === "#features" || route === "#how" || route === "#templates" || !route) && (
        <>
          <Navbar nav={nav} route={route}/>
          <HeroSection nav={nav}/>
          <BeforeAfter/>
          <Features/>
          <HowItWorks/>
          <Templates/>
          <GeneratedAssets/>
          <Testimonials/>
          <CTASection nav={nav}/>
          <Footer nav={nav}/>
        </>
      )}

      <CookieConsent/>
    </div>
  );
}