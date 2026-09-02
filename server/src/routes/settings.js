import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

const ensureSettings = async (userId) => {
  let settings = await prisma.userSettings.findUnique({ where: { userId } });

  if (!settings) {
    settings = await prisma.userSettings.create({ data: { userId } });
  }

  return settings;
};

router.get("/", async (req, res, next) => {
  try {
    const settings = await ensureSettings(req.user.id);
    res.json({ settings });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const {
      emailNotifications,
      scoreUpdates,
      aiSuggestions,
      weeklyReport,
      portfolioVisibility,
      profileVisibility,
    } = req.body;

    const ensure = await ensureSettings(req.user.id);

    const updated = await prisma.userSettings.update({
      where: { id: ensure.id },
      data: {
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(scoreUpdates !== undefined && { scoreUpdates }),
        ...(aiSuggestions !== undefined && { aiSuggestions }),
        ...(weeklyReport !== undefined && { weeklyReport }),
        ...(portfolioVisibility !== undefined && { portfolioVisibility }),
        ...(profileVisibility !== undefined && { profileVisibility }),
      },
    });

    res.json({ settings: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
