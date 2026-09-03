import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

const SYSTEM_PROMPT = `You are "CareerCraft", a warm, friendly AI career-coach and portfolio builder.
Your ONLY job: have a natural, chatty conversation with the user and, as quickly as possible, extract enough real details to build their professional profile. You are NOT a general chatbot — stay focused on gathering career info.

Gather these fields over a friendly back-and-forth (one short question per reply):
- name, job title / what they do
- location (only if they volunteer it)
- technical skills (languages, frameworks, tools)
- education (institution, degree, field, years)
- notable projects (name, what it does, tech, links)
- a short professional bio (you may draft it from what they said)

Tone rules:
- Keep each reply SHORT and human — 1 to 3 sentences. Never dump multiple questions at once.
- Ask exactly ONE question per reply. Use light emoji occasionally. Match the user's tone.
- Once you ask about a topic and they answer, move to the NEXT topic. Do not re-ask what they already told you.

CRITICAL capturing rule — you MUST emit the profile block EARLY:
- As soon as you have AT LEAST a name (or title) AND their skills, STOP asking for more and emit the block.
- You may gather education/projects first if it flows naturally, but do not let the conversation drag on.
- Instead of endlessly asking "any projects?", proactively include the block at the end of your reply and ask a final confirm question like "Want me to build your portfolio now?".
- If the user clearly says "yes / go ahead / build it / done", emit the block (even if some fields are empty).

Emit the block ONLY in your final reply and end your reply with a single JSON block on its own lines wrapped in markers, exactly like:

~~~PROFILE
{ "name": "...", "title": "...", "location": "...", "bio": "...",
  "skills": [{ "name": "JavaScript", "category": "Language", "proficiency": 4 }],
  "projects": [{ "name": "...", "description": "...", "technologies": ["..."], "githubUrl": "...", "liveUrl": "..." }],
  "education": [{ "institution": "...", "degree": "...", "fieldOfStudy": "...", "startYear": 2022, "endYear": 2026 }] }
~~~

Rules for the block:
- Include ONLY real info the user shared — never fabricate. Omit keys you don't have.
- For "bio", write a 1–2 sentence professional summary from what they told you.
- Absolutely no markdown, no commentary, no text after the block. Keep your friendly text BEFORE the block.`;

const converseValidation = [
  body("messages")
    .isArray()
    .withMessage("messages must be an array")
    .custom((msgs) => msgs.every((m) => m && typeof m.content === "string")),
];

const extractProfileBlock = (text) => {
  const match = text.match(/~~~PROFILE\s*\n?({[\s\S]*?})\s*\n?~~~/m);
  if (!match) return { clean: text, profile: null };
  try {
    return { clean: text.replace(/~~~PROFILE\s*\n?({[\s\S]*?})\s*\n?~~~/m, "").trim(), profile: JSON.parse(match[1]) };
  } catch {
    return { clean: text, profile: null };
  }
};

const ensureProfile = async (userId) => {
  let profile = await prisma.profile.findUnique({ where: { userId }, include: { skills: true, projects: true, education: true } });
  if (!profile) {
    profile = await prisma.profile.create({ data: { userId }, include: { skills: true, projects: true, education: true } });
  }
  return profile;
};

const persistProfile = async (userId, data) => {
  const profile = await ensureProfile(userId);

  await prisma.profile.update({
    where: { userId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.bio !== undefined && { bio: data.bio }),
    },
  });

  // Replace skills wholesale.
  if (Array.isArray(data.skills) && data.skills.length) {
    await prisma.skill.deleteMany({ where: { profileId: profile.id } });
    await prisma.skill.createMany({
      data: data.skills.map((s) => ({
        profileId: profile.id,
        name: s.name,
        category: s.category || "General",
        proficiency: s.proficiency || 3,
      })),
    });
  }

  // Replace projects wholesale (only recreate those the user already has, or add new ones by name).
  if (Array.isArray(data.projects) && data.projects.length) {
    const existingNames = profile.projects.map((p) => p.name.toLowerCase());
    for (const p of data.projects) {
      if (existingNames.includes((p.name || "").toLowerCase())) continue;
      const maxOrder = await prisma.project.findFirst({
        where: { profileId: profile.id },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      await prisma.project.create({
        data: {
          profileId: profile.id,
          name: p.name,
          description: p.description || null,
          technologies: p.technologies || [],
          githubUrl: p.githubUrl || null,
          liveUrl: p.liveUrl || null,
          order: (maxOrder?.order ?? -1) + 1,
        },
      });
    }
  }

  // Replace education wholesale.
  if (Array.isArray(data.education) && data.education.length) {
    const existing = profile.education.map((e) => `${e.institution.toLowerCase()}|${e.degree.toLowerCase()}`);
    for (const e of data.education) {
      const key = `${(e.institution || "").toLowerCase()}|${(e.degree || "").toLowerCase()}`;
      if (existing.includes(key)) continue;
      await prisma.education.create({
        data: {
          profileId: profile.id,
          institution: e.institution,
          degree: e.degree,
          fieldOfStudy: e.fieldOfStudy || null,
          startYear: e.startYear || null,
          endYear: e.endYear || null,
          gpa: e.gpa || null,
        },
      });
    }
  }

  // Update user name if provided.
  if (data.name) {
    await prisma.user.update({ where: { id: userId }, data: { name: data.name } });
  }

  await prisma.activity.create({
    data: {
      userId,
      type: "onboarding_completed",
      description: "Built professional profile via AI onboarding chat",
      metadata: { skills: data.skills?.length || 0, projects: data.projects?.length || 0 },
    },
  });

  return profile;
};

router.post("/converse", validate(converseValidation), async (req, res, next) => {
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
        profile: null,
        done: false,
      });
    }

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let raw;
    let reply;
    try {
      const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const body = JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7 },
      });

      // Retry transient failures (rate limits / "high demand" spikes).
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
      return res
        .status(502)
        .json({ error: "AI request failed", message: err.message });
    }

    const { clean, profile } = extractProfileBlock(raw);
    reply = clean || raw;

    if (profile) {
      await persistProfile(req.user.id, profile);
    }

    res.json({
      reply,
      profile,
      done: Boolean(profile),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
