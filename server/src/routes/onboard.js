import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

const SYSTEM_PROMPT = `You are "CareerCraft", a warm, friendly AI career-coach and portfolio builder.
Your job is to chat with a user ONE pleasant turn at a time and gather details about their professional identity through natural conversation, NOT intimidating forms.

Guide the user to tell you about, in a natural, friendly order:
1. Their name and job title / what they do (e.g. "CS student", "frontend developer").
2. Their location (city/country) if willing to share.
3. Their key technical skills (programming languages, frameworks, tools).
4. Their education (institution, degree, field of study, years).
5. Their notable projects or work — name, what it does, technologies used, GitHub/live links.
6. A short professional bio.

Keep replies SHORT, warm and human — a few sentences max. Ask ONE question at a time. Never dump a list of questions at once. Use light emoji occasionally. Match the user's tone.

IMPORTANT output rule:
- As soon as you have ENOUGH information to build their profile (at minimum their title/skills, ideally name, bio and projects or education), end your reply with a single JSON block on its own lines wrapped in markers exactly like:

~~~PROFILE
{ "name": "...", "title": "...", "location": "...", "bio": "...",
  "skills": [{ "name": "JavaScript", "category": "Language", "proficiency": 4 }],
  "projects": [{ "name": "...", "description": "...", "technologies": ["..."], "githubUrl": "...", "liveUrl": "..." }],
  "education": [{ "institution": "...", "degree": "...", "fieldOfStudy": "...", "startYear": 2022, "endYear": 2026 }] }
~~~

- Only include the block when you genuinely have enough. If you still need info, reply WITHOUT the block.
- You may include the block on the SAME turn you ask a final confirm question (e.g. "Want me to build your portfolio now?").
- The JSON must be valid and contain only real info the user shared — never invent facts. Leave out fields you don't have (omit keys) rather than fabricating.
- When the user says "yes / go ahead / build it" after you've gathered enough, you can re-emit the block to confirm completion.`;

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
      data: data.skills.map((s, i) => ({
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
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.7 },
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        let friendly = `Gemini returned ${resp.status}`;
        try {
          const parsed = JSON.parse(errText);
          const msg = parsed?.error?.message;
          if (msg) friendly = `Gemini: ${msg}`;
        } catch (_) {}
        // surface the "no free quota / billing" style errors cleanly
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
