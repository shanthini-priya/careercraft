import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

const profileUpdateValidation = [
  body("title").optional().trim(),
  body("bio").optional().trim(),
  body("phone").optional().trim(),
  body("location").optional().trim(),
];

router.get("/", async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        skills: true,
        projects: { orderBy: { order: "asc" } },
        education: true,
        experience: { orderBy: { startDate: "desc" } },
        certifications: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

router.put("/", validate(profileUpdateValidation), async (req, res, next) => {
  try {
    const { title, bio, phone, location } = req.body;

    const profile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        ...(title !== undefined && { title }),
        ...(bio !== undefined && { bio }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
      },
    });

    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: "profile_updated",
        description: "Updated profile information",
      },
    });

    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

const skillValidation = [
  body("name").trim().notEmpty().withMessage("Skill name is required"),
  body("category").optional().trim(),
  body("proficiency").optional().isInt({ min: 1, max: 5 }),
];

router.post("/skills", validate(skillValidation), async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const skill = await prisma.skill.create({
      data: {
        profileId: profile.id,
        name: req.body.name,
        category: req.body.category || null,
        proficiency: req.body.proficiency || null,
      },
    });

    res.status(201).json({ skill });
  } catch (error) {
    next(error);
  }
});

router.delete("/skills/:id", async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await prisma.skill.deleteMany({
      where: { id: req.params.id, profileId: profile.id },
    });

    res.json({ message: "Skill removed" });
  } catch (error) {
    next(error);
  }
});

const projectValidation = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
  body("description").optional().trim(),
  body("technologies").optional().isArray(),
  body("githubUrl").optional().isURL(),
  body("liveUrl").optional().isURL(),
];

router.post("/projects", validate(projectValidation), async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const maxOrder = await prisma.project.findFirst({
      where: { profileId: profile.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const project = await prisma.project.create({
      data: {
        profileId: profile.id,
        name: req.body.name,
        description: req.body.description || null,
        technologies: req.body.technologies || [],
        githubUrl: req.body.githubUrl || null,
        liveUrl: req.body.liveUrl || null,
        imageUrl: req.body.imageUrl || null,
        featured: req.body.featured || false,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: "project_added",
        description: `Added project "${project.name}"`,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
});

router.put("/projects/:id", async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, profileId: profile.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { name, description, technologies, githubUrl, liveUrl, imageUrl, featured, order } =
      req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(technologies !== undefined && { technologies }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(featured !== undefined && { featured }),
        ...(order !== undefined && { order }),
      },
    });

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

router.delete("/projects/:id", async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await prisma.project.deleteMany({
      where: { id: req.params.id, profileId: profile.id },
    });

    res.json({ message: "Project removed" });
  } catch (error) {
    next(error);
  }
});

const educationValidation = [
  body("institution").trim().notEmpty().withMessage("Institution is required"),
  body("degree").trim().notEmpty().withMessage("Degree is required"),
  body("startYear").isInt({ min: 1900, max: 2100 }),
];

router.post("/education", validate(educationValidation), async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        institution: req.body.institution,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy || null,
        startYear: req.body.startYear,
        endYear: req.body.endYear || null,
        gpa: req.body.gpa || null,
      },
    });

    res.status(201).json({ education });
  } catch (error) {
    next(error);
  }
});

router.delete("/education/:id", async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await prisma.education.deleteMany({
      where: { id: req.params.id, profileId: profile.id },
    });

    res.json({ message: "Education removed" });
  } catch (error) {
    next(error);
  }
});

const experienceValidation = [
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("position").trim().notEmpty().withMessage("Position is required"),
  body("startDate").isISO8601(),
];

router.post("/experience", validate(experienceValidation), async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const experience = await prisma.experience.create({
      data: {
        profileId: profile.id,
        company: req.body.company,
        position: req.body.position,
        description: req.body.description || null,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        current: req.body.current || false,
      },
    });

    res.status(201).json({ experience });
  } catch (error) {
    next(error);
  }
});

router.delete("/experience/:id", async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await prisma.experience.deleteMany({
      where: { id: req.params.id, profileId: profile.id },
    });

    res.json({ message: "Experience removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
