import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const ensurePortfolio = async (userId) => {
  let portfolio = await prisma.portfolio.findFirst({
    where: { userId },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  if (!portfolio) {
    portfolio = await prisma.portfolio.create({
      data: {
        userId,
        sections: {
          create: [
            { type: "hero", title: "Hero", content: {}, order: 0 },
            { type: "about", title: "About Me", content: {}, order: 1 },
            { type: "skills", title: "Skills", content: {}, order: 2 },
            { type: "projects", title: "Projects", content: {}, order: 3 },
            { type: "contact", title: "Contact", content: {}, order: 4 },
          ],
        },
      },
      include: { sections: { orderBy: { order: "asc" } } },
    });
  }

  return portfolio;
};

router.get("/", authenticate, async (req, res, next) => {
  try {
    const portfolio = await ensurePortfolio(req.user.id);
    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
});

router.put("/template", authenticate, async (req, res, next) => {
  try {
    const { templateId, customSettings } = req.body;

    const portfolio = await ensurePortfolio(req.user.id);

    const updated = await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        ...(templateId !== undefined && { templateId }),
        ...(customSettings !== undefined && { customSettings }),
      },
      include: { sections: { orderBy: { order: "asc" } } },
    });

    res.json({ portfolio: updated });
  } catch (error) {
    next(error);
  }
});

router.put("/sections/:type", authenticate, async (req, res, next) => {
  try {
    const { type } = req.params;
    const { title, content, visible, order } = req.body;

    const portfolio = await ensurePortfolio(req.user.id);

    const section = await prisma.portfolioSection.findFirst({
      where: { portfolioId: portfolio.id, type },
    });

    if (!section) {
      return res.status(404).json({ error: `Section "${type}" not found` });
    }

    const updated = await prisma.portfolioSection.update({
      where: { id: section.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(visible !== undefined && { visible }),
        ...(order !== undefined && { order }),
      },
    });

    res.json({ section: updated });
  } catch (error) {
    next(error);
  }
});

router.post("/publish", authenticate, async (req, res, next) => {
  try {
    const portfolio = await ensurePortfolio(req.user.id);

    if (portfolio.published && portfolio.publicUrl) {
      return res.json({
        portfolio,
        message: "Portfolio already published",
      });
    }

    const slug =
      req.user.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);

    const updated = await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        published: true,
        publicUrl: slug,
      },
      include: { sections: { orderBy: { order: "asc" } } },
    });

    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: "portfolio_published",
        description: "Published portfolio",
        metadata: { publicUrl: slug },
      },
    });

    res.json({ portfolio: updated });
  } catch (error) {
    next(error);
  }
});

router.get("/:publicUrl", async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { publicUrl: req.params.publicUrl },
      include: {
        sections: { where: { visible: true }, orderBy: { order: "asc" } },
        user: {
          select: { name: true, email: true, avatarUrl: true },
        },
      },
    });

    if (!portfolio || !portfolio.published) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
});

export default router;
