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
function ScoreRing({ score, size = 80, color = C.indigo[600], label }) {
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

// ─── Utility: Count-up hook ──────────────────────────────────────────────────
function useCountUp(target, seconds = 1.2) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / (seconds * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, seconds]);
  return val;
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ nav, route }) {
  const [mobileOpen, setMobileOpen] = useState(false);
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
                <p style={{ margin: 0, fontSize: 14, color: C.textBody, lineHeight: 1.6 }}>Tell me about yourself — I'll build your complete professional identity.</p>
              </div>

              <div style={{ background: `linear-gradient(135deg, ${C.indigo[50]}, ${C.violet[50]})`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, marginLeft: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                  {typed}<span style={{ borderRight: `2px solid ${C.indigo[400]}`, animation: "blink 0.8s step-end infinite" }}></span>
                </p>
              </div>

              {typed.length > 50 && (
                <div style={{ background: "#1B2440", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ margin: 0, fontSize: 14, color: C.textBody }}>
                    Great! I can see you're a CSE student with frontend + backend skills.
                    What's the biggest problem your library system solves? 🎯
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
              <div style={{ fontSize: 36, color: C.indigo[100], fontFamily: "Georgia", position: "absolute", top: 16, right: 20, lineHeight: 1 }}>"</div>
              <p style={{ fontSize: 14, color: C.textBody, lineHeight: 1.7, marginBottom: 20 }}>"{t.quote}"</p>
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
  } catch (_) {}
  // No signal yet -> treat as new (send to onboarding).
  return true;
}

async function markOnboarded(userId) {
  try {
    if (userId) localStorage.setItem(`${ONBOARD_FLAG}_${userId}`, "done");
  } catch (_) {}
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
        {resetSent && <Alert kind="success">If an account exists, we've emailed a password reset link. Check your inbox.</Alert>}

        {forgot ? (
          <>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: C.text, margin: 0, marginBottom: 6 }}>Reset your password</h2>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 18 }}>Enter your email and we'll send you a reset link.</p>
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
              Don't have an account?{" "}
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
    } catch (_) {}
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
                ✅ I've captured your profile from our chat — skills, projects and education are saved. Ready when you are!
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

// ─── Sparkline (header small chart) ──────────────────────────────────────────
function Sparkline({ data, color, width = 100, height = 30 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={2.2} fill={color}/>
      ))}
    </svg>
  );
}

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

// ─── SVG Line Chart ──────────────────────────────────────────────────────────
function ScoreTrendChart() {
  const data = [72, 74, 75, 78, 79, 81, 82];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const W = 720, H = 200, P = 34;
  const max = 100, min = 60;
  const innerW = W - P * 2, innerH = H - P * 2;
  const x = i => P + (i / (data.length - 1)) * innerW;
  const y = v => P + innerH - ((v - min) / (max - min)) * innerH;
  const pts = data.map((v, i) => [x(i), y(v)]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const [first, ...rest] = pts;
  const smooth = `M${first[0].toFixed(1)},${first[1].toFixed(1)} ` + rest.map((p, i) => {
    const prev = pts[i];
    const cx = (prev[0] + p[0]) / 2;
    return `C${cx},${prev[1].toFixed(1)} ${cx},${p[1].toFixed(1)} ${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  }).join(" ");
  const area = `${smooth} L${x(data.length - 1).toFixed(1)},${P + innerH} L${P},${P + innerH} Z`;
  const gridY = [60, 70, 80, 90, 100];
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 14 }}>Portfolio Score Trend</h3>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.indigo[400]} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={C.indigo[400]} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {gridY.map(g => (
          <g key={g}>
            <line x1={P} y1={y(g)} x2={W - P} y2={y(g)} stroke={C.border} strokeWidth={1}/>
            <text x={P - 6} y={y(g) + 3} textAnchor="end" fontSize={10} fill={C.textMuted}>{g}</text>
          </g>
        ))}
        {data.map((v, i) => (
          <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize={11} fill={C.textMuted}>{labels[i]}</text>
        ))}
        <path d={area} fill="url(#lineFill)"/>
        <path d={smooth} fill="none" stroke={C.indigo[600]} strokeWidth={2.5} strokeLinecap="round"/>
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r={4.5} fill={C.surface} stroke={C.indigo[600]} strokeWidth={2}/>
          </g>
        ))}
      </svg>
    </Card>
  );
}

// ─── SVG Bar Chart ───────────────────────────────────────────────────────────
function AssetBarChart() {
  const bars = [
    { label: "Portfolio", value: 1, color: C.indigo[400] },
    { label: "Resume", value: 3, color: C.violet[400] },
    { label: "LinkedIn", value: 2, color: C.cyan[400] },
    { label: "GitHub", value: 1, color: C.amber[400] },
    { label: "Cover Ltr", value: 2, color: C.coral[400] },
    { label: "Score", value: 5, color: C.indigo[600] },
  ];
  const [heights, setHeights] = useState(bars.map(() => 0));
  useEffect(() => {
    const t = setTimeout(() => setHeights(bars.map(b => b.value)), 60);
    return () => clearTimeout(t);
  }, []);
  const max = Math.max(...bars.map(b => b.value));
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 14 }}>Assets Generated</h3>
      <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 24 }}>
        {bars.map((b, i) => {
          const h = (heights[i] / max) * 150;
          return (
            <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ height: 170, display: "flex", alignItems: "flex-end", width: "100%" }}>
                <div style={{
                  width: "100%", height: h, background: b.color, borderRadius: "8px 8px 0 0",
                  display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8,
                  transition: "height 0.6s ease",
                }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{b.value}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8, textAlign: "center" }}>{b.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── SVG Donut Chart ─────────────────────────────────────────────────────────
function ProfileDonut() {
  const sections = [
    { label: "Personal", value: 100, color: C.indigo[400] },
    { label: "Skills", value: 90, color: C.violet[400] },
    { label: "Projects", value: 80, color: C.cyan[400] },
    { label: "Experience", value: 60, color: C.amber[400] },
    { label: "Certs", value: 40, color: C.coral[400] },
  ];
  const size = 180, cx = size / 2, cy = size / 2;
  const radius = size / 2 - 20;
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 14 }}>Profile Completion Breakdown</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke={C.border} strokeWidth={16}/>
          {sections.map(s => (
            <circle key={s.label} cx={cx} cy={cy} r={radius} fill="none" stroke={s.color} strokeWidth={16}
              strokeDasharray={`${s.value} ${100 - s.value}`}
              strokeLinecap="round"
              transform={`rotate(${sections.indexOf(s) * (360 / sections.length) - 90} ${cx} ${cy})`}
            />
          ))}
          <text x="50%" y="47%" textAnchor="middle" fontSize={22} fontWeight={800} fill={C.text}>87%</text>
          <text x="50%" y="60%" textAnchor="middle" fontSize={11} fill={C.textMuted}>complete</text>
        </svg>
        <div style={{ flex: 1 }}>
          {sections.map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }}/>
              <span style={{ fontSize: 13, color: C.textBody, flex: 1 }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Activity Feed ───────────────────────────────────────────────────────────
function ActivityFeed({ nav }) {
  const items = [
    { icon: "📈", color: C.teal[50], text: "Portfolio score increased to 82", time: "2 min ago" },
    { icon: "📄", color: C.indigo[50], text: "Resume generated", time: "1 hr ago" },
    { icon: "👤", color: C.violet[50], text: "Profile updated", time: "3 hrs ago" },
    { icon: "💼", color: C.amber[50], text: "LinkedIn content created", time: "Yesterday" },
    { icon: "🐙", color: C.coral[50], text: "GitHub README optimized", time: "2 days ago" },
  ];
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 16 }}>Recent Activity</h3>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: it.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{it.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: C.textBody }}>{it.text}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{it.time}</div>
          </div>
        </div>
      ))}
      <button onClick={() => nav("#portfolio")} style={{ marginTop: 12, width: "100%", padding: "9px", borderRadius: 8, background: C.indigo[50], color: C.indigo[400], fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
        View all activity
      </button>
    </Card>
  );
}

// ─── AI Suggestions Panel ────────────────────────────────────────────────────
function AISuggestions({ nav }) {
  const suggestions = [
    { icon: "🐙", title: "Add a GitHub link", desc: "Connect your repository to boost credibility.", points: "+5 points", color: C.indigo[400], to: "#portfolio" },
    { icon: "🎓", title: "Add certification", desc: "Add a relevant cert to strengthen your profile.", points: "+3 points", color: C.violet[400], to: "#profile-form" },
    { icon: "✏️", title: "Update project descriptions", desc: "Add impact metrics to project write-ups.", points: "+2 points", color: C.cyan[400], to: "#portfolio" },
  ];
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 16 }}>AI Suggestions to Boost Your Score</h3>
      {suggestions.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < suggestions.length - 1 ? `1px solid ${C.border}` : "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.title}</span>
              <Badge color="teal">{s.points}</Badge>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.desc}</div>
            <button onClick={() => nav(s.to)} style={{ marginTop: 6, background: "none", border: "none", color: C.indigo[400], fontWeight: 600, fontSize: 12, cursor: "pointer", padding: 0 }}>Do this →</button>
          </div>
        </div>
      ))}
    </Card>
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
  const [userLoading, setUserLoading] = useState(true);

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

  const scoreVal = score?.score ?? null;
  const completion = score?.breakdown?.profileCompleteness ?? 85;
  const improveText =
    scoreVal != null && scoreVal >= 90
      ? "Your profile looks great! Keep adding achievements."
      : scoreVal != null && scoreVal >= 70
      ? "Add 1 more project and detailed descriptions to improve your profile."
      : "Complete your profile, skills, and projects to boost your score.";

  const documents = [
    { name: "My Portfolio", type: "Portfolio", updated: "Today", status: "Ready" },
    { name: "LinkedIn Profile", type: "LinkedIn", updated: "Yesterday", status: "Ready" },
    { name: "GitHub README", type: "GitHub", updated: "Yesterday", status: "Ready" },
    { name: "Software Engineer Cover Letter", type: "Cover Letter", updated: "2 days ago", status: "Draft" },
  ];
  const statusColor = { Ready: "#22C55E", Draft: "#F59E0B", "Needs Review": "#EF4444" };
  const statusBg = { Ready: "rgba(34,197,94,0.15)", Draft: "rgba(245,158,11,0.15)", "Needs Review": "rgba(239,68,68,0.15)" };
  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0 }}>{greeting}, {userName} 👋</h1>
          <p style={{ color: C.textMuted, marginTop: 6, fontSize: 15, marginBottom: 0 }}>Let's build a stronger professional profile.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, color: C.textMuted }}>🔍</span>
          <span style={{ fontSize: 14, color: C.textMuted }}>👤</span>
        </div>
      </div>

      {/* Four metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <MetricCard label="Portfolio Score" value={scoreLoading ? "—" : (scoreVal ?? 85)} sub="Good — improve" color={C.violet[400]}/>
        <MetricCard label="Career Matches" value={4} sub="Roles for you" color={C.indigo[400]}/>
        <MetricCard label="Documents Created" value={8} sub="Assets generated" color={C.cyan[400]}/>
        <MetricCard label="Recruiter Score" value={score?.breakdown?.recruiterReadiness ? (score.breakdown.recruiterReadiness / 20).toFixed(1) : "4.7"} sub="Strong profile" color={C.teal[400]}/>
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
              {documents.map((d, i) => (
                <tr key={i} style={{ borderBottom: i < documents.length - 1 ? `1px solid ${C.border}` : "none" }}>
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

function AccordionSection({ title, open, onToggle, children, render }) {
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
  const [enhance, setEnhance] = useState({});

  const getChat = () => chats.find(c => c.id === activeChat);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");
    setChats(prev => prev.map(c => {
      if (c.id !== activeChat) return c;
      return { ...c, messages: [...c.messages, { from: "user", text: msg }] };
    }));
    setTyping(true);
    setTimeout(() => {
      const reply = generateReply(msg);
      setChats(prev => prev.map(c => {
        if (c.id !== activeChat) return c;
        return { ...c, messages: [...c.messages, { from: "ai", text: reply.text }] };
      }));
      setTyping(false);
    }, 1100);
  };

  const generateReply = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes("headline") || lower.includes("portfolio")) {
      return { text: "Here's an improved portfolio headline for you: **\"Full Stack Developer Building Scalable Web Applications with React & Node.js\"** — it focuses on your role, tech, and impact. Would you like me to enhance the About section too?" };
    }
    if (lower.includes("project")) {
      return { text: "Great idea! I'd suggest adding projects that show: 1) A full-stack app (frontend + backend + database), 2) Something with a real user base, 3) A project that aligns with your target role. E.g., an e-commerce dashboard or a real-time chat app with authentication." };
    }
    if (lower.includes("resume")) {
      return { text: "Your resume looks solid. I recommend: 1) Leading each bullet with a strong action verb, 2) Adding quantifiable impact (\"improved load time by 40%\"), 3) Tailoring keywords to each job description. Want me to rewrite your Experience section?" };
    }
    if (lower.includes("ats")) {
      return { text: "To optimize for ATS: include relevant keywords from the job description, use standard section headings, avoid graphics/tables, and save as a .docx or plain text. I can scan your resume for missing keywords if you paste it." };
    }
    return { text: "I can help you improve your professional brand! Here are the areas I can assist with: Portfolio headline, project descriptions, resume content, LinkedIn About, and ATS optimization. What would you like to work on?" };
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
    try { navigator.clipboard.writeText(text.replace(/\*\*/g, "")); } catch (e) {}
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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Resume Generator</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Create an ATS-optimized resume with live preview.</p>
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
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, marginBottom: 4 }}>LinkedIn Content Generator</h1>
      <p style={{ color: C.textMuted, fontSize: 14, marginTop: 0, marginBottom: 24 }}>Generate a professional LinkedIn presence from a few inputs.</p>

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 16 }}>Your Input</h3>
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
        <button onClick={() => setGenerated(true)} style={{ marginTop: 16, padding: "12px 28px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>✨ Generate All</button>
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
                <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, margin: 0 }}>{icon} {title}</h3>
                <button onClick={() => copy(text)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.indigo[400]}`, background: C.indigo[50], color: C.indigo[400], fontSize: 12, cursor: "pointer", fontWeight: 600 }}>📋 Copy</button>
              </div>
              <textarea style={{ ...fieldStyle, minHeight: 90, whiteSpace: "pre-wrap" }} defaultValue={text}/>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

// ─── GitHub README Generator ─────────────────────────────────────────────────
function GitHubReadmeGeneratorPage() {
  const [username, setUsername] = useState("your-username");
  const [repos, setRepos] = useState(["my-portfolio", "ecommerce-app", "task-manager"]);
  const [repoInput, setRepoInput] = useState("");

  const addRepo = () => { if (repoInput.trim() && !repos.includes(repoInput.trim())) setRepos(prev => [...prev, repoInput.trim()]); setRepoInput(""); };
  const removeRepo = (r) => setRepos(prev => prev.filter(x => x !== r));

  const markdown = `# Hi there, I'm @${username} 👋

## 👨‍💻 About Me
I'm a passionate software developer focused on building elegant, scalable web applications. I love exploring new technologies and solving real-world problems.

## 🚀 Tech Stack
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📌 Featured Projects
${repos.map(r => `- **[${r}](https://github.com/${username}/${r})** — A project that demonstrates my skills in building real-world applications.`).join("\n")}

## 🌱 Currently Learning
- Advanced React patterns and performance optimization
- Cloud deployment with AWS
- System design fundamentals

## 📫 Contact
- GitHub: [@${username}](https://github.com/${username})
- Email: ${username}@example.com
`;

  const copyMd = () => { try { navigator.clipboard.writeText(markdown); } catch (e) {} };

  const renderMarkdown = () => (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: 1.6, fontSize: 14, color: "#CBD5E1" }}>
      <h1 style={{ fontSize: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 8, color: C.text }}>Hi there, I'm @{username} 👋</h1>
      <h2 style={{ fontSize: 18, marginTop: 16, color: C.text }}>👨‍💻 About Me</h2>
      <p>I'm a passionate software developer focused on building elegant, scalable web applications. I love exploring new technologies and solving real-world problems.</p>
      <h2 style={{ fontSize: 18, marginTop: 16, color: C.text }}>🚀 Tech Stack</h2>
      <p style={{ fontFamily: "monospace", background: "#1E2745", padding: 12, borderRadius: 6 }}>React · Node.js · Python · JavaScript</p>
      <h2 style={{ fontSize: 18, marginTop: 16, color: C.text }}>📌 Featured Projects</h2>
      {repos.map(r => (
        <div key={r} style={{ marginLeft: 16, marginBottom: 4 }}>• <b>{r}</b> — A project that demonstrates my skills</div>
      ))}
      <h2 style={{ fontSize: 18, marginTop: 16, color: C.text }}>🌱 Currently Learning</h2>
      <div style={{ marginLeft: 16 }}>• Advanced React patterns and performance optimization</div>
      <div style={{ marginLeft: 16 }}>• Cloud deployment with AWS & System design</div>
      <h2 style={{ fontSize: 18, marginTop: 16, color: C.text }}>📫 Contact</h2>
      <p>GitHub: <a style={{ color: "#3B82F6" }}>@{username}</a> · Email: {username}@example.com</p>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>GitHub README Generator</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Generate a professional profile README for GitHub.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small onClick={copyMd}>📋 Copy Markdown</Btn>
          <Btn onClick={copyMd}>Generate</Btn>
        </div>
      </div>

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
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
              Generated sections: About Me, Tech Stack, Featured Projects, Currently Learning, Contact.
            </div>
          </Card>
        </div>

        <div>
          <Badge color="teal">Live Markdown Preview</Badge>
          <div style={{ background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`, padding: 28, marginTop: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.35)", fontFamily: "monospace", whiteSpace: "pre-wrap", fontSize: 12, maxHeight: 480, overflowY: "auto", color: "#CBD5E1" }}>
            {markdown}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cover Letter Generator ──────────────────────────────────────────────────
function CoverLetterGeneratorPage() {
  const [input, setInput] = useState({ company: "", jobTitle: "", description: "", name: "Alex Johnson" });
  const [generated, setGenerated] = useState(false);
  const set = (k) => (e) => setInput(p => ({ ...p, [k]: e.target.value }));

  const letter = input.description
    ? `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${input.jobTitle || "Software Developer"} position at ${input.company || "your company"}. As a passionate developer with a track record of building impactful web applications, I am excited about the opportunity to contribute to your team.\n\nWhy This Company:\nI admire ${input.company || "your company"} for its innovative approach and am eager to bring my technical skills and drive to your mission.\n\nWhat I Bring:\nBased on the job description (${input.description.slice(0, 80)}...), I bring relevant experience in modern web development, strong problem-solving skills, and a collaborative mindset that fits your culture.\n\nI would welcome the opportunity to discuss how my background aligns with your needs. Thank you for your time and consideration.\n\nSincerely,\n${input.name || "Alex Johnson"}` : "";

  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) {} };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 800 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, marginBottom: 4 }}>Cover Letter Generator</h1>
      <p style={{ color: C.textMuted, fontSize: 14, marginTop: 0, marginBottom: 24 }}>Create a personalized cover letter from a job description.</p>

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
            {[["Mar",70],["Apr",74],["May",76],["Jun",78],["Jul",82]].map(([l, v], i, arr) => {
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

  const startSim = () => {
    setStarted(true);
    setTimeout(() => {
      setFeedback({
        firstImpression: 4,
        technical: 4,
        communication: 3,
        overall: "Your portfolio presents a solid technical foundation with a clean, professional layout. The projects are relevant and demonstrate practical skills, though adding more quantifiable impact would strengthen your profile further.",
        strengths: ["Clean and professional visual design", "Strong, relevant project selection", "Clear skills section with modern tech stack", "Easy navigation and fast load time"],
        improvements: ["Add quantified impact metrics to projects", "Include a professional profile photo", "Expand the About section with a personal touch", "Add links to live demos for all projects"],
      });
    }, 1600);
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
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>See your portfolio through a recruiter's eyes.</p>
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

      {started && !feedback && (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 40, marginBottom: 16, animation: "blink 1s infinite" }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Recruiter is reviewing your portfolio…</h3>
          <p style={{ fontSize: 13, color: C.textMuted }}>Scanning hero section, about, skills, projects, and contact info.</p>
        </Card>
      )}

      {feedback && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 16 }}>AI Recruiter Feedback</h3>
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
        </>
      )}
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

// ─── Placeholder page ────────────────────────────────────────────────────────
function PlaceholderPage({ title, desc, icon, phase }) {
  return (
    <div style={{ padding: "40px 36px", textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 10 }}>{title}</h2>
      <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 24 }}>{desc}</p>
      <Badge color="amber">{phase}</Badge>
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
      const { authApi } = await import("./src/api/auth");
      if (!isSupabaseConfigured() || !supabase) return;

      /**** OAuth / magic-link callback ****/
      const hash = window.location.hash;
      const isCallback =
        hash.includes("access_token") || hash.includes("type=") || hash.includes("error=");
      if (isCallback) {
        try {
          await supabase.auth.getSession();
          // Supabase sanitises the URL fragment after processing the session.
        } catch (_) {}
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
        {route === "#documents"     && <PlaceholderPage title="Documents" icon="📄" desc="All your generated professional documents in one place." phase="Coming soon"/>}
        {route === "#career-match"  && <PlaceholderPage title="Career Match" icon="🎯" desc="Find roles that match your skills and profile." phase="Coming soon"/>}
        {route === "#feedback"      && <PlaceholderPage title="Feedback" icon="⭐" desc="AI feedback and personalized suggestions to improve your profile." phase="Coming soon"/>}
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