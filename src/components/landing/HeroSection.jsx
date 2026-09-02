import { useState, useEffect, useRef } from "react";
import C from "../../constants/colors";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";
import Card from "../ui/Card";
import ScoreRing from "../ui/ScoreRing";

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
    <section style={{ paddingTop: 120, paddingBottom: 80, background: "linear-gradient(160deg, #F8F8FF 0%, #F3F4FB 60%, #FDFCFF 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <Badge color="violet">AI-Powered · Free to start</Badge>
            <h1 style={{ fontSize: 46, fontWeight: 800, color: "#0F172A", lineHeight: 1.15, marginTop: 16, marginBottom: 0 }}>
              One input.<br/>
              <span style={{ background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Complete career identity.
              </span>
            </h1>
            <p style={{ fontSize: 18, color: "#475569", marginTop: 20, lineHeight: 1.7, maxWidth: 480 }}>
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
                <span key={label} style={{ fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 5 }}>
                  <span>{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <Card style={{ boxShadow: "0 20px 60px rgba(99,114,232,0.12)", borderRadius: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>AI</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>CareerCraft AI</div>
                  <div style={{ fontSize: 12, color: "#10B981" }}>● Online</div>
                </div>
              </div>

              <div style={{ background: "#F8F9FF", borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>Tell me about yourself — I'll build your complete professional identity.</p>
              </div>

              <div style={{ background: `linear-gradient(135deg, ${C.indigo[50]}, ${C.violet[50]})`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, marginLeft: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: "#1E293B", lineHeight: 1.6 }}>
                  {typed}<span style={{ borderRight: "2px solid #6472E8", animation: "blink 0.8s step-end infinite" }}></span>
                </p>
              </div>

              {typed.length > 50 && (
                <div style={{ background: "#F8F9FF", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>
                    Great! I can see you're a CSE student with frontend + backend skills.
                    What's the biggest problem your library system solves? 🎯
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13, color: "#94A3B8" }}>
                  Reply to AI…
                </div>
                <button style={{ background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, border: "none", borderRadius: 10, width: 40, height: 40, cursor: "pointer", color: "#fff", fontSize: 18 }}>↑</button>
              </div>
            </Card>

            <div style={{
              position: "absolute", top: -16, right: -20,
              background: "#fff", borderRadius: 14, padding: "10px 16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <ScoreRing score={82} size={48} />
              <div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>Portfolio Score</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>82 / 100</div>
              </div>
            </div>

            <div style={{
              position: "absolute", bottom: -16, left: -20,
              background: "#fff", borderRadius: 14, padding: "10px 16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ fontSize: 22 }}>⚡</div>
              <div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>Generated in</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>~30 seconds</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, marginTop: 64, justifyContent: "center", flexWrap: "wrap" }}>
          {[["2,400+", "Portfolios created"], ["94%", "Recruiter approval"], ["6 assets", "Per generation"], ["30 sec", "Avg. time to portfolio"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.indigo[600] }}>{num}</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
