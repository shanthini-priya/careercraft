import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const latest = await prisma.scoreHistory.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ score: latest || null });
  } catch (error) {
    next(error);
  }
});

router.get("/history", async (req, res, next) => {
  try {
    const history = await prisma.scoreHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    res.json({ history });
  } catch (error) {
    next(error);
  }
});

router.post("/calculate", async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        skills: true,
        projects: true,
        education: true,
        experience: true,
        certifications: true,
      },
    });

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: req.user.id },
      include: { sections: true },
    });

    const profileCompleteness = Math.min(
      100,
      (profile?.bio ? 20 : 0) +
        (profile?.title ? 15 : 0) +
        (profile?.location ? 10 : 0) +
        (profile?.skills?.length ? 15 : 0) +
        (profile?.projects?.length ? 15 : 0) +
        (profile?.education?.length ? 15 : 0) +
        (profile?.experience?.length ? 10 : 0)
    );

    const contentQuality = Math.min(
      100,
      (profile?.bio && profile.bio.length > 50 ? 30 : profile?.bio ? 15 : 0) +
        (profile?.projects?.filter((p) => p.description)?.length
          ? 30
          : 0) +
        (profile?.skills?.length >= 5 ? 20 : profile?.skills?.length ? 10 : 0) +
        (profile?.experience?.filter((e) => e.description)?.length ? 20 : 0)
    );

    const keywordOptimization = Math.min(
      100,
      (profile?.skills?.length >= 3 ? 30 : 0) +
        (profile?.title ? 20 : 0) +
        (profile?.projects?.length >= 2 ? 25 : 0) +
        (profile?.bio ? 25 : 0)
    );

    const visualAppeal = portfolio
      ? Math.min(
          100,
          (portfolio.published ? 30 : 0) +
            (portfolio.sections?.length >= 4 ? 30 : 0) +
            (portfolio.templateId !== "modern-developer" ? 20 : 10) +
            (portfolio.viewCount > 0 ? 20 : 0)
        )
      : 20;

    const recruiterReadiness = Math.min(
      100,
      Math.round(
        (profileCompleteness * 0.3 +
          contentQuality * 0.25 +
          keywordOptimization * 0.25 +
          visualAppeal * 0.2)
      )
    );

    const breakdown = {
      profileCompleteness,
      contentQuality,
      keywordOptimization,
      visualAppeal,
      recruiterReadiness,
    };

    const score = Math.round(
      (profileCompleteness +
        contentQuality +
        keywordOptimization +
        visualAppeal +
        recruiterReadiness) /
        5
    );

    const tips = [];
    if (profileCompleteness < 80) {
      tips.push("Complete your profile sections to boost your score");
    }
    if (contentQuality < 70) {
      tips.push("Add detailed descriptions to your projects and experience");
    }
    if (keywordOptimization < 70) {
      tips.push("Add more skills and a professional title for better discoverability");
    }
    if (!portfolio?.published) {
      tips.push("Publish your portfolio to increase visual appeal score");
    }
    if (profile?.experience?.length === 0) {
      tips.push("Add work experience to increase recruiter readiness");
    }
    if (profile?.certifications?.length === 0) {
      tips.push("Add certifications to stand out");
    }

    const scoreRecord = await prisma.scoreHistory.create({
      data: {
        userId: req.user.id,
        score,
        breakdown,
        tips,
      },
    });

    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: "score_update",
        description: `Portfolio score updated to ${score}`,
        metadata: { score, breakdown },
      },
    });

    res.json({ score: scoreRecord });
  } catch (error) {
    next(error);
  }
});

router.get("/recruiter-simulation", async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        skills: true,
        projects: true,
        education: true,
        experience: true,
      },
    });

    const simulations = [
      {
        id: "1",
        recruiterName: "Sarah Mitchell",
        company: "TechCorp Inc.",
        role: "Senior Frontend Developer",
        likelihood: Math.min(
          95,
          40 + (profile?.skills?.length || 0) * 5 + (profile?.experience?.length || 0) * 10
        ),
        feedback: [
          profile?.skills?.length >= 5
            ? "Strong technical skill set"
            : "Consider adding more technical skills",
          profile?.experience?.length >= 2
            ? "Good work experience background"
            : "More experience would strengthen candidacy",
          "Portfolio presentation looks professional",
        ],
        matchReasons: [
          "Skills align with job requirements",
          "Project portfolio demonstrates practical experience",
          profile?.education?.length ? "Educational background matches" : null,
        ].filter(Boolean),
      },
      {
        id: "2",
        recruiterName: "James Park",
        company: "StartupHub",
        role: "Full Stack Developer",
        likelihood: Math.min(
          90,
          35 + (profile?.projects?.length || 0) * 8 + (profile?.skills?.length || 0) * 4
        ),
        feedback: [
          profile?.projects?.length >= 3
            ? "Impressive project portfolio"
            : "Add more projects to showcase versatility",
          "Technical breadth is good for full-stack roles",
          "Consider highlighting API/database experience",
        ],
        matchReasons: [
          "Full-stack skills demonstrated through projects",
          "Diverse technology experience",
          "Active GitHub presence",
        ],
      },
      {
        id: "3",
        recruiterName: "Emily Chen",
        company: "Enterprise Solutions",
        role: "Junior Developer",
        likelihood: Math.min(
          98,
          60 + (profile?.education?.length || 0) * 15 + (profile?.projects?.length || 0) * 5
        ),
        feedback: [
          "Strong educational foundation",
          "Projects demonstrate initiative and learning ability",
          "Good cultural fit indicators",
        ],
        matchReasons: [
          "Entry-level skills match position requirements",
          "Portfolio shows growth potential",
          "Strong learning indicators",
        ],
      },
    ];

    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: "recruiter_simulation",
        description: "Ran recruiter simulation analysis",
      },
    });

    res.json({ simulations });
  } catch (error) {
    next(error);
  }
});

export default router;
