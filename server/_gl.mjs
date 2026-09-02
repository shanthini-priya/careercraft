import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "rsLX2amqseafxdBfxyqh27D7+jWbwtXp79yXPeNrVnHiWO5e0KkdpZcbTSRapZepczyiiC2QdJyKI9UAECYoEQ==";
const uid = "55555555-2222-3333-4444-555555555555";
const token = jwt.sign(
  { sub: uid, aud: "authenticated", role: "authenticated", email: "gemini_live_test@example.com", user_metadata: { name: "Live Gemini Test" } },
  secret,
  { algorithm: "HS256", expiresIn: "1h" }
);
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const B = "http://localhost:5000/api/onboard/converse";

const turns = [
  "Hi! I'm Priya. I'm a frontend developer from Bengaluru.",
  "I know React, TypeScript, Tailwind, and Node.js.",
  "I studied at Anna University, B.Tech CSE, 2020-2024.",
  "I built a real-time chat app with React and WebSockets. Yes, build my portfolio now.",
];

let history = [];
let captured = false;
for (const t of turns) {
  const r = await fetch(B, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ messages: [...history, { role: "user", content: t }] }),
  });
  const j = await r.json();
  history.push({ role: "user", content: t });
  if (r.status !== 200) { console.log(`status ${r.status}:`, JSON.stringify(j)); break; }
  if (j.reply) history.push({ role: "assistant", content: j.reply });
  console.log(`\n>> USER: ${t}`);
  console.log(`<< AI: ${(j.reply || "").slice(0, 260)}`);
  if (j.profile) {
    captured = true;
    console.log("\n*** PROFILE CAPTURED on this turn ***");
    console.log(JSON.stringify(j.profile, null, 2));
    console.log("done:", j.done);
    break;
  }
}
if (!captured) console.log("\n(no profile block captured after all turns)");
