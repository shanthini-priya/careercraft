import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET;

/**
 * Verifies a Supabase Auth access token and maps it to a local public.users row.
 *
 * Supabase access tokens are JWTs signed (HS256) with the project's JWT secret
 * (the same secret configured in JWT_SECRET). Their claims include:
 *   sub  -> the Supabase auth user UUID
 *   aud  -> "authenticated"
 *   role -> "authenticated"
 *   email, user_metadata.name, ...
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

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
