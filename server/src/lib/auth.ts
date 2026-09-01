import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

/**
 * Allowed browser origins. Comma-separate to permit more than one, e.g.
 * CLIENT_URL="http://localhost:5173,https://smart-site-ai-seven.vercel.app"
 * — deployment needs the production origin without losing local development.
 */
export const CLIENT_URLS = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  appName: "SmartSite AI",
  database: prismaAdapter(prisma, {
    // "sqlite" for local development, "postgresql" in production.
    provider:
      process.env.DATABASE_PROVIDER === "sqlite" ? "sqlite" : "postgresql",
  }),
  baseURL: process.env.SERVER_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  // The client is on a different origin and sends cookies, so it has to be
  // trusted explicitly or better-auth rejects the sign-up/sign-in request.
  trustedOrigins: CLIENT_URLS,
  advanced: {
    defaultCookieAttributes: {
      // Cross-site cookies (Vercel frontend -> separate API host) require
      // SameSite=None, which browsers only accept together with Secure.
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
