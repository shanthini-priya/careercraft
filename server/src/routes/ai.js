import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

const SYSTEM_PROMPT = `You are "CareerCraft", a senior career coach and portfolio-enhancement expert embedded inside the CareerCraft app.
You help users improve their portfolio, resume, LinkedIn profile, GitHub README, and cover letters.

You have access to the user's profile context (injected below). Use it to give specific, personalized advice rather than generic tips.

Rules:
- Keep replies concise and helpful — 3 to 6 sentences unless the user asks for a full rewrite.
- Be encouraging but honest. Point out real strengths and real gaps.
- When asked to rewrite/enhance content, provide the improved draft using **bold** for emphasis where useful.
- Use clear, structured text (numbered lists, short paragraphs) — the UI renders bold (**text**) only.
- Do NOT claim to have made changes to the app; you only provide text, guidance, and drafts.
- Stay focused on careers: portfolio, resume, LinkedIn, GitHub, cover letters, interviewing, and ATS.`;

const chatValidation = [
  body("messages")
    .isArray()
    .withMessage("messages must be an array")
    .custom((msgs) => msgs.every((m) => m && typeof m.content === "string")),
];

const buildContext = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      skills: { orderBy: { name: "asc" } },
      projects: { orderBy: { order: "asc" } },
      education: true,
      experience: { orderBy: { startDate: "desc" } },
      certifications: true,
    },
  });

  const portfolio = await prisma.portfolio.findFirst({
    where: { userId },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  return { user, profile, portfolio };
};

const renderContext = ({ user, profile, portfolio }) => {
  const skills = profile?.skills?.map((s) => s.name).join(", ") || "none yet";
  const projects = profile?.projects?.length
    ? profile.projects.map((p) => `- ${p.name}: ${p.description || "no description"}`).join("\n")
    : "none yet";
  const edu = profile?.education?.length
    ? profile.education
        .map((e) => `${e.degree} at ${e.institution} (${e.startYear}-${e.endYear || "present"})`)
        .join("; ")
    : "none yet";
  const exp = profile?.experience?.length
    ? profile.experience
        .map((e) => `${e.position} at ${e.company}${e.current ? " (current)" : ""}`)
        .join("; ")
    : "none yet";
  const template = portfolio?.templateId || "modern-developer";
  const published = portfolio?.published ? "yes" : "no";

  return [
    `USER PROFILE CONTEXT:`,
    `- Name: ${user?.name || "N/A"}`,
    `- Email: ${user?.email || "N/A"}`,
    `- Title: ${profile?.title || "N/A"}`,
    `- Location: ${profile?.location || "N/A"}`,
    `- Bio: ${profile?.bio || "N/A"}`,
    `- Skills: ${skills}`,
    `- Projects:\n${projects}`,
    `- Education: ${edu}`,
    `- Experience: ${exp}`,
    `- Portfolio template: ${template}`,
    `- Portfolio published: ${published}`,
  ].join("\n");
};

router.post("/chat", validate(chatValidation), async (req, res, next) => {
  try {
    const messages = req.body.messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply:
          "⚠️ I can't think right now — the Gemini API key isn't set on the server yet. Ask your developer to add `GEMINI_API_KEY` to `server/.env`, then refresh and we'll chat!",
      });
    }

    const context = await buildContext(req.user.id);
    const system = `${SYSTEM_PROMPT}\n\n${renderContext(context)}`;

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let raw;
    try {
      const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const body = JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { temperature: 0.7 },
      });

      const MAX_ATTEMPTS = 3;
      let resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
      for (let attempt = 1; attempt < MAX_ATTEMPTS && [429, 500, 502, 503, 504].includes(resp.status); attempt++) {
        await new Promise((r) => setTimeout(r, 1200 * attempt));
        resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
      }

      if (!resp.ok) {
        const errText = await resp.text();
        let friendly = `Gemini returned ${resp.status}`;
        try {
          const parsed = JSON.parse(errText);
          const msg = parsed?.error?.message;
          if (msg) friendly = `Gemini: ${msg}`;
        } catch (_) { /* ignore malformed error body */ }
        return res.status(502).json({ error: "AI request failed", message: friendly });
      }

      const json = await resp.json();
      raw = json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    } catch (err) {
      return res.status(502).json({ error: "AI request failed", message: err.message });
    }

    res.json({ reply: raw });
  } catch (error) {
    next(error);
  }
});

export default router;
