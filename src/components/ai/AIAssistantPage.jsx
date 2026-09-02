import { useState, useEffect, useRef } from "react";
import C from "../../constants/colors";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";

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
    <div style={{ display: "flex", height: "calc(100vh - 64px)", background: "#fff" }}>
      {/* Left sidebar: conversation history */}
      <div style={{ width: 220, borderRight: "1px solid #E5E7EB", padding: "16px 12px", display: "flex", flexDirection: "column" }}>
        <button onClick={newChat} style={{ padding: "10px", borderRadius: 10, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", marginBottom: 14 }}>+ New Chat</button>
        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, letterSpacing: 1, marginBottom: 8, padding: "0 8px" }}>CONVERSATIONS</div>
        {chats.map(ch => (
          <div key={ch.id} onClick={() => setActiveChat(ch.id)} style={{
            padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 13,
            background: ch.id === activeChat ? C.indigo[50] : "transparent",
            color: ch.id === activeChat ? C.indigo[600] : "#374151", fontWeight: ch.id === activeChat ? 600 : 400,
            marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{ch.title}</div>
        ))}
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16, background: "#F8FAFC" }}>
          {c.messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "70%", padding: "12px 18px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.from === "user" ? `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})` : "#fff",
                color: m.from === "user" ? "#fff" : "#1E293B", fontSize: 14, lineHeight: 1.6,
                border: m.from === "user" ? "none" : "1px solid #E5E7EB",
                boxShadow: m.from === "user" ? "none" : "0 2px 10px rgba(0,0,0,0.04)",
                maxWidth: "70%",
              }}
              dangerouslySetInnerHTML={{ __html: renderRich(m.text) }}
              />
              {m.from === "ai" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button onClick={() => applyAction("enhance", i)} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid " + C.indigo[400], background: C.indigo[50], color: C.indigo[600], fontSize: 11, cursor: "pointer" }}>✨ Enhance this content</button>
                  <button onClick={() => applyAction("shorten", i)} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid " + C.violet[400], background: C.violet[50], color: C.violet[600], fontSize: 11, cursor: "pointer" }}>✂️ Make it shorter</button>
                  <button onClick={() => applyAction("professional", i)} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid " + C.teal[400], background: C.teal[50], color: C.teal[600], fontSize: 11, cursor: "pointer" }}>💼 More professional</button>
                  <button onClick={() => copy(m.text)} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid #E5E7EB", background: "#fff", color: "#64748B", fontSize: 11, cursor: "pointer" }}>📋 Copy</button>
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: 6, padding: "12px 18px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, alignSelf: "flex-start" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.indigo[400], animation: "blink 1s infinite", animationDelay: `${i * 0.15}s` }}/>)}
            </div>
          )}
        </div>

        {/* Suggestion chips */}
        <div style={{ padding: "12px 32px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {AI_SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid " + C.indigo[100], background: "#fff", color: C.indigo[600], fontSize: 12, cursor: "pointer" }}>{s}</button>
          ))}
        </div>

        <div style={{ padding: "16px 32px", display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Ask to improve your portfolio, resume, LinkedIn…"
            style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 14, outline: "none" }}
          />
          <button onClick={() => send()} style={{ background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, border: "none", borderRadius: 12, width: 48, height: 48, cursor: "pointer", color: "#fff", fontSize: 18 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantPage;