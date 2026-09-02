import { useState, useEffect } from "react";
import C from "../../constants/colors";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

function OnboardingPage({ nav }) {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm your AI portfolio assistant. Tell me about yourself — your skills, education, and any projects you've built. I'll handle the rest." }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const aiReplies = [
    "Great! You're a CSE student with frontend skills. What technologies did you use in your Library Management System? And what problem does it solve for users?",
    "Nice — a full CRUD app with search. That's a solid project. Do you have a GitHub link or live demo I can include? And what's your career goal — frontend dev, full stack, or something else?",
    "Perfect. I have enough to build your complete professional identity. Your portfolio score will start at around 74 — we can push it higher by adding a GitHub link and one more project. Ready to generate?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      if (step < aiReplies.length) {
        setMessages(prev => [...prev, { from: "ai", text: aiReplies[step] }]);
        setStep(s => s + 1);
      }
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 620 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Badge color="indigo">AI Onboarding</Badge>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginTop: 10 }}>Tell the AI about yourself</h2>
          <p style={{ color: "#64748B", fontSize: 14 }}>No forms. Just talk — we'll build your portfolio from the conversation.</p>
        </div>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>AI</span>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>CareerCraft AI</div>
              <div style={{ fontSize: 12, color: "#10B981" }}>● Ready to help</div>
            </div>
          </div>
          <div style={{ minHeight: 300, maxHeight: 380, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "78%", padding: "11px 16px", borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.from === "user" ? `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})` : "#F1F5F9",
                  color: m.from === "user" ? "#fff" : "#374151", fontSize: 14, lineHeight: 1.6,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 6, padding: "10px 16px" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.indigo[400], opacity: 0.5 }}/>)}
              </div>
            )}
          </div>
          <div style={{ padding: "16px 24px", borderTop: "1px solid #F1F5F9", display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Tell me about yourself…"
              style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, outline: "none" }}
            />
            <button onClick={handleSend} style={{ background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, border: "none", borderRadius: 10, width: 44, height: 44, cursor: "pointer", color: "#fff", fontSize: 18 }}>↑</button>
          </div>
        </Card>
        {step >= 2 && (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button onClick={() => nav("#dashboard")} style={{ padding: "14px 40px", borderRadius: 12, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
              ⚡ Generate my professional identity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;
