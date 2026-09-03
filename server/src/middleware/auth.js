import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET;

/**
 * Verifies an access token and maps it to a local public.users row.
 *
 * Two token formats are supported so both the Supabase Auth flow and the
 * legacy local email/password flow keep working:
 *
 * 1) Supabase Auth access tokens — JWTs signed (HS256) with the project's JWT
 *    secret. Claims include `sub` (the Supabase auth user UUID), `aud`
 *    ("authenticated") and user metadata. On first sign-in the local user row
 *    is created idempotently (upsert keyed on `sub`).
 *
 * 2) Legacy local tokens issued by this server's POST /auth/login & /auth/register
 *    routes — signed with the same secret but carrying a `userId` claim instead.
 *    The matching local user row is looked up directly (no upsert).
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

    // Legacy local tokens carry userId; Supabase tokens carry sub.
    const isLocalToken =
      (decoded.userId && !decoded.sub) ||
      (decoded.aud && decoded.aud === "careercraft");

    if (isLocalToken) {
      const userId = decoded.userId;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(401).json({ error: "User no longer exists" });
      }
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      };
      return next();
    }

    // Otherwise treat as a Supabase-style access token.
    if (decoded.aud && decoded.aud !== "authenticated") {
      return res.status(401).json({ error: "Invalid token audience" });
    }

    const supabaseId = decoded.sub;
    if (!supabaseId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Find the local user row keyed by the Supabase user id, or create it on
    // first sign-in (an idempotent upsert so repeated visits stay consistent).
    let user = await prisma.user.upsert({
      where: { id: supabaseId },
      update: {
        email: decoded.email ?? undefined,
        name: decoded.user_metadata?.name ?? undefined,
        avatarUrl: decoded.user_metadata?.avatar_url ?? undefined,
      },
      create: {
        id: supabaseId,
        email: decoded.email || `${supabaseId}@supabase.local`,
        name:
          decoded.user_metadata?.name ||
          decoded.user_metadata?.full_name ||
          "New User",
        password: "supabase-auth",
        avatarUrl: decoded.user_metadata?.avatar_url ?? null,
        profile: { create: {} },
        settings: { create: {} },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
      },
    });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
