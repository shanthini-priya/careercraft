import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

const buildProfileContext = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      skills: true,
      projects: true,
      education: true,
      experience: true,
      certifications: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  return { user, profile };
};

const coverLetterValidation = [
  body("companyName").trim().notEmpty().withMessage("Company name is required"),
  body("jobTitle").trim().notEmpty().withMessage("Job title is required"),
  body("jobDescription").optional().trim(),
];

router.post("/resume", async (req, res, next) => {
  try {
    const { user, profile } = await buildProfileContext(req.user.id);

    if (!profile) {
      return res.status(400).json({
        error: "Profile required",
        message: "Please complete your profile before generating a resume",
      });
    }

    const resume = {
      personalInfo: {
        name: user.name,
        email: user.email,
        phone: profile.phone || "",
        location: profile.location || "",
        title: profile.title || "Software Developer",
      },
      summary:
        profile.bio ||
        `Passionate software developer with expertise in ${
          profile.skills.map((s) => s.name).slice(0, 3).join(", ") || "modern technologies"
        }. Proven track record of delivering high-quality projects and collaborating effectively with cross-functional teams.`,
      skills: profile.skills.map((s) => ({
        name: s.name,
        category: s.category || "General",
        proficiency: s.proficiency || 3,
      })),
      experience: profile.experience.map((e) => ({
        company: e.company,
        position: e.position,
        description:
          e.description ||
          `Contributed to key projects and initiatives. Collaborated with team members to deliver high-quality software solutions. Participated in code reviews and maintained coding best practices.`,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current,
      })),
      education: profile.education.map((ed) => ({
        institution: ed.institution,
        degree: ed.degree,
        fieldOfStudy: ed.fieldOfStudy || "",
        startYear: ed.startYear,
        endYear: ed.endYear,
        gpa: ed.gpa,
      })),
      projects: profile.projects.map((p) => ({
        name: p.name,
        description:
          p.description ||
          `A full-stack application built with ${p.technologies.join(", ") || "modern technologies"}. Features include responsive design, RESTful API integration, and comprehensive testing.`,
        technologies: p.technologies,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
      })),
      certifications: profile.certifications.map((c) => ({
        name: c.name,
        issuer: c.issuer,
        dateObtained: c.dateObtained,
        url: c.url,
      })),
      atsScore: Math.min(
        98,
        50 +
          (profile.skills.length * 4) +
          (profile.experience.length * 8) +
          (profile.projects.length * 5) +
          (profile.education.length * 7)
      ),
      suggestions: [
        "Add quantifiable achievements to work experience descriptions",
        "Include relevant keywords from target job descriptions",
        "Ensure consistent date formatting throughout",
        profile.skills.length < 5
          ? "Add more technical skills for better ATS matching"
          : null,
        !profile.phone
          ? "Add a phone number for better recruiter contact"
          : null,
      ].filter(Boolean),
    };

    const saved = await prisma.resume.create({
      data: {
        userId: req.user.id,
        content: resume,
        atsScore: resume.atsScore,
      },
    });

    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: "content_generated",
        description: "Generated AI-enhanced resume",
        metadata: { type: "resume", atsScore: resume.atsScore },
      },
    });

    res.json({ resume: { ...resume, id: saved.id } });
  } catch (error) {
    next(error);
  }
});

router.post("/linkedin", async (req, res, next) => {
  try {
    const { user, profile } = await buildProfileContext(req.user.id);

    if (!profile) {
      return res.status(400).json({
        error: "Profile required",
        message: "Please complete your profile before generating LinkedIn content",
      });
    }

    const topSkills = profile.skills.slice(0, 5).map((s) => s.name);
    const latestRole =
      profile.experience.length > 0
        ? profile.experience.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
          )[0]
        : null;

    const linkedin = {
      headline:
        profile.title ||
        `${latestRole?.position || "Software Developer"} | ${
          topSkills.slice(0, 3).join(" | ") || "JavaScript, React, Node.js"
        } | Building Digital Experiences`,
      aboutSection: `🚀 ${profile.bio || `I'm a passionate ${profile.title || "software developer"} with a strong focus on building impactful digital products.`}

${profile.skills.length > 0 ? `\n💡 Core Technologies:\n${topSkills.map((s) => `• ${s}`).join("\n")}` : ""}

${profile.experience.length > 0 ? `\n💼 Currently ${latestRole?.current ? "working as" : "experienced in"} ${latestRole?.position || "software development"}${latestRole?.company ? ` at ${latestRole.company}` : ""}` : ""}

${profile.projects.length > 0 ? `\n🔨 Featured Projects:\n${profile.projects.filter((p) => p.featured || p.liveUrl).slice(0, 3).map((p) => `• ${p.name}${p.liveUrl ? " - Live" : ""}`).join("\n")}` : ""}

🎓 ${profile.education.length > 0 ? `${profile.education[0].degree}${profile.education[0].fieldOfStudy ? ` in ${profile.education[0].fieldOfStudy}` : ""} from ${profile.education[0].institution}` : "Continuously learning and growing"}

📧 Open to collaboration and new opportunities!`,
      experience: profile.experience.map((e) => ({
        company: e.company,
        position: e.position,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current,
        description:
          e.description ||
          `• Led development of key features and components\n• Collaborated with cross-functional teams to deliver projects\n• Implemented best practices for code quality and performance\n• Participated in architecture discussions and technical planning`,
      })),
      featured: profile.projects.slice(0, 3).map((p) => ({
        type: "project",
        title: p.name,
        description:
          p.description ||
          `Built with ${p.technologies.join(", ") || "modern technologies"}`,
        url: p.liveUrl || p.githubUrl,
      })),
      postSuggestions: [
        `Just shipped a new feature using ${
          topSkills[0] || "my latest tech stack"
        }! Here's what I learned...`,
        `5 things I wish I knew before starting my career in ${
          profile.title || "software development"
        }`,
        `Reflections on my journey from student to ${profile.title || "developer"}`,
      ],
    };

    const saved = await prisma.linkedinContent.create({
      data: {
        userId: req.user.id,
        headline: linkedin.headline,
        aboutSection: linkedin.aboutSection,
        experience: linkedin.experience,
        featured: linkedin.featured,
      },
    });

    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: "content_generated",
        description: "Generated LinkedIn profile content",
        metadata: { type: "linkedin" },
      },
    });

    res.json({ linkedin: { ...linkedin, id: saved.id } });
  } catch (error) {
    next(error);
  }
});

router.post("/github-readme", async (req, res, next) => {
  try {
    const { user, profile } = await buildProfileContext(req.user.id);

    if (!profile) {
      return res.status(400).json({
        error: "Profile required",
        message: "Please complete your profile before generating a GitHub README",
      });
    }

    const topSkills = profile.skills.slice(0, 8);
    const featuredProjects = profile.projects
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      .slice(0, 4);

    const readme = {
      content: `# Hi, I'm ${user.name} 👋

${profile.bio || `I'm a ${profile.title || "software developer"} passionate about building great software.`}

## 🛠️ Technologies & Tools

${
  topSkills.length > 0
    ? topSkills
        .reduce((acc, skill) => {
          const category = skill.category || "Other";
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill.name);
          return acc;
        }, {})
        ? Object.entries(
            topSkills.reduce((acc, skill) => {
              const category = skill.category || "Other";
              if (!acc[category]) acc[category] = [];
              acc[category].push(skill.name);
              return acc;
            }, {})
          )
            .map(
              ([category, skills]) =>
                `### ${category}\n${skills.map((s) => `\`${s}\``).join(" ")}`
            )
            .join("\n\n")
        : topSkills.map((s) => `\`${s.name}\``).join(" ")
    : "`JavaScript` `TypeScript` `React` `Node.js`"
}

## 📊 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${user.name.toLowerCase().replace(/\s+/g, "")}&show_icons=true&theme=radical)

## 🔥 Featured Projects

${
  featuredProjects.length > 0
    ? featuredProjects
        .map(
          (p) =>
            `### [${p.name}](${p.liveUrl || p.githubUrl || "#"})\n\n${
              p.description ||
              `Built with ${p.technologies.join(", ") || "modern technologies"}`
            }\n\n${p.technologies.length > 0 ? `**Tech Stack:** ${p.technologies.join(" | ")}` : ""}`
        )
        .join("\n\n---\n\n")
    : "_Coming soon..._"
}

## 📫 Get In Touch

- Email: ${user.email}
${profile.location ? `- Location: ${profile.location}` : ""}
${profile.experience.length > 0 ? `- Currently: ${profile.experience.find((e) => e.current)?.position || profile.experience[0].position} at ${profile.experience.find((e) => e.current)?.company || profile.experience[0].company}` : ""}

---

⭐ Feel free to explore my repositories and don't forget to star any project you find interesting!
`,
      repositories: featuredProjects.map((p) => ({
        name: p.name,
        description: p.description,
        url: p.githubUrl,
        technologies: p.technologies,
      })),
      stats: {
        totalProjects: profile.projects.length,
        totalSkills: profile.skills.length,
        technologies: topSkills.map((s) => s.name),
      },
    };

    const saved = await prisma.githubReadme.create({
      data: {
        userId: req.user.id,
        content: readme.content,
        repositories: readme.repositories,
      },
    });

    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: "content_generated",
        description: "Generated GitHub README",
        metadata: { type: "github-readme" },
      },
    });

    res.json({ readme: { ...readme, id: saved.id } });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/cover-letter",
  validate(coverLetterValidation),
  async (req, res, next) => {
    try {
      const { companyName, jobTitle, jobDescription } = req.body;
      const { user, profile } = await buildProfileContext(req.user.id);

      if (!profile) {
        return res.status(400).json({
          error: "Profile required",
          message:
            "Please complete your profile before generating a cover letter",
        });
      }

      const topSkills = profile.skills.slice(0, 5).map((s) => s.name);
      const latestRole =
        profile.experience.length > 0
          ? profile.experience.sort(
              (a, b) => new Date(b.startDate) - new Date(a.startDate)
            )[0]
          : null;

      const content = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${
        topSkills.slice(0, 3).join(", ") || "software development"
      }${latestRole ? ` and my experience as ${latestRole.position} at ${latestRole.company}` : ""}, I am confident I would be a valuable addition to your team.

${
  jobDescription
    ? `After reviewing the role requirements, I'm particularly excited about the opportunity to leverage my skills in ${topSkills.slice(0, 2).join(" and ") || "web development"} to contribute to ${companyName}'s goals. ${jobDescription.includes("team") ? "I thrive in collaborative team environments and enjoy working closely with cross-functional teams to deliver impactful solutions." : "I'm passionate about delivering high-quality solutions and continuously improving my craft."}`
    : `I'm excited about this opportunity because it aligns perfectly with my passion for ${profile.title || "building great software"} and my expertise in ${topSkills.slice(0, 3).join(", ") || "modern technologies"}.`
}

${
  profile.projects.length > 0
    ? `Some highlights from my work include:\n${profile.projects.slice(0, 3).map((p) => `• ${p.name}: ${p.description || `Built with ${p.technologies.join(", ") || "modern technologies"}, demonstrating my ability to deliver complete solutions`}`).join("\n")}`
    : `Throughout my career, I have consistently demonstrated the ability to learn new technologies quickly and apply them effectively to solve complex problems.`
}

${latestRole ? `In my role as ${latestRole.position} at ${latestRole.company}, I${latestRole.description ? ` ${latestRole.description.charAt(0).toLowerCase() + latestRole.description.slice(1).slice(0, 150)}` : " contributed to key projects, collaborated with team members, and consistently delivered high-quality work"}.` : ""}
I am enthusiastic about the possibility of bringing my skills and experience to ${companyName}. I would welcome the opportunity to discuss how my background, skills, and enthusiasm would make me a strong fit for the ${jobTitle} role.

Thank you for considering my application. I look forward to the opportunity to speak with you further.

Best regards,
${user.name}
${user.email}
${profile.phone ? ` | ${profile.phone}` : ""}${profile.location ? ` | ${profile.location}` : ""}`;

      const saved = await prisma.coverLetter.create({
        data: {
          userId: req.user.id,
          companyName,
          jobTitle,
          jobDescription: jobDescription || null,
          content,
        },
      });

      await prisma.activity.create({
        data: {
          userId: req.user.id,
          type: "content_generated",
          description: `Generated cover letter for ${jobTitle} at ${companyName}`,
          metadata: { type: "cover-letter", companyName, jobTitle },
        },
      });

      res.json({ coverLetter: { ...saved } });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
