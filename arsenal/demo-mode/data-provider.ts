/**
 * Demo-Mode Facade — Auth-Optional Data Layer
 *
 * Origin: Bench, Aegis, TollPay all hit the same crisis on submission week —
 * dashboards showed "Loading..." when judges visited without auth. SQLite doesn't
 * work on Vercel serverless. Auth middleware blocks demo access. Judges see a
 * spinner and move on.
 *
 * Pattern: design the data layer with two paths from day 1.
 *   - Authenticated user → real database
 *   - Anonymous visitor → bundled seed data with realistic values
 *
 * The demo-mode path must be the SAME shape as the real path (same types, same
 * fields, same null-handling). If they diverge, the demo lies and judges catch it.
 *
 * Use when: any project with a dashboard, feed, leaderboard, or analytics view.
 * Skip if:  the project is a one-shot tool (no persistent state to display).
 */

import { seedData } from "./seed-data";

export type DataMode = "real" | "demo";

export interface DataContext {
  mode: DataMode;
  userId: string | null;
}

/**
 * Resolve the data mode for the current request.
 *
 * Order of precedence:
 *   1. ?demo=true URL param            → forced demo (useful for screenshots/video)
 *   2. Authenticated session present    → real
 *   3. Default                          → demo
 *
 * The default is intentionally demo, not error. A judge with no account
 * gets a working demo, not a 401.
 */
export function resolveDataContext(opts: {
  searchParams?: URLSearchParams;
  userId?: string | null;
}): DataContext {
  if (opts.searchParams?.get("demo") === "true") {
    return { mode: "demo", userId: null };
  }
  if (opts.userId) {
    return { mode: "real", userId: opts.userId };
  }
  return { mode: "demo", userId: null };
}

/**
 * Single entry point all UI code uses to fetch data. Routes to real or seed
 * based on context. Replace the `realFetch` implementations with your actual
 * Drizzle/Supabase/Prisma queries.
 */
export const data = {
  async certificates(ctx: DataContext) {
    if (ctx.mode === "demo") return seedData.certificates;
    return realFetch.certificates(ctx.userId!);
  },

  async stats(ctx: DataContext) {
    if (ctx.mode === "demo") return seedData.stats;
    return realFetch.stats(ctx.userId!);
  },

  async leaderboard(ctx: DataContext) {
    if (ctx.mode === "demo") return seedData.leaderboard;
    return realFetch.leaderboard();
  },
};

// ---- Replace these with your real database calls ---------------------------

const realFetch = {
  async certificates(_userId: string) {
    // e.g. await db.select().from(certs).where(eq(certs.userId, _userId))
    throw new Error("Wire up real DB query here.");
  },
  async stats(_userId: string) {
    throw new Error("Wire up real DB query here.");
  },
  async leaderboard() {
    throw new Error("Wire up real DB query here.");
  },
};
