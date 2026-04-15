# Real Telemetry on the Demo

45-minute instrumentation that turns "trust me it works" into "here's the dashboard, judges." Plausible / PostHog / wallet-connect stats on-screen during the pitch.

**Use when:** The demo is a deployed web app or dapp. Set up by T+12h (Day 1 AM) to have meaningful data by submission.
**Skip if:** The project has no user-facing surface — pure CLI / library. (Even then, GitHub clones + stars count.)

---

## Why this matters

Hackathon pitches are saturated with polished demos. What distinguishes top-3 from top-10 is **externally-observable usage** — a number the judge can verify without your narration.

Specifically:
- VC judge prompt requires traction signal.
- Product Designer rewards "first impression" — a dashboard showing real signups lands before the slide does.
- Sponsor judges reward ecosystem-specific metrics (wallets connected on their chain, etc).

"We deployed it and 47 devs signed up in 12 hours" > "It's deployed."

---

## Stack options (pick one per project)

| Tool | Setup time | Cost | Best for | Notes |
|------|-----------|------|----------|-------|
| **Plausible** | 10 min | Free trial 30d | Lightweight page analytics | Privacy-first; embeddable public dashboard |
| **PostHog** | 20 min | Free tier 1M events | Product analytics + replays | Richer; self-host option; session replay lets judges see real use |
| **Vercel Analytics** | 2 min | Free if Vercel-hosted | Fastest-to-live | Basic; drops in with one env var |
| **Wallet-connect stats** | 15 min | Free | Web3 demos | Count unique addresses that connected |
| **Custom Supabase counter** | 30 min | Free | Full control | One `events` table + Drizzle query |

**Recommended defaults for a hackathon:** Vercel Analytics (free with the starter scaffold) + PostHog (for custom events + session replay) + a wallet counter for web3 projects.

---

## 1. Vercel Analytics (2 minutes)

If the project is deployed on Vercel (as it should be — see `../arsenal/starter/init.sh`):

```bash
pnpm add @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

Push. Dashboard at vercel.com/{team}/{project}/analytics. Done.

---

## 2. PostHog — custom events (20 minutes)

```bash
pnpm add posthog-js
```

```tsx
// app/providers.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
      });
    }
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

### Key events to capture

```ts
// lib/track.ts
import posthog from "posthog-js";

export const track = {
  landingView: () => posthog.capture("landing_viewed"),
  waitlistSubmit: (email: string) =>
    posthog.capture("waitlist_joined", { email_domain: email.split("@")[1] }),
  walletConnected: (address: string, chain: string) =>
    posthog.capture("wallet_connected", {
      address_hash: hashAddress(address),
      chain,
    }),
  demoStarted: () => posthog.capture("demo_started"),
  demoCompleted: (durationMs: number) =>
    posthog.capture("demo_completed", { duration_ms: durationMs }),
  signatureCreated: () => posthog.capture("signature_created"),
  txConfirmed: (txHash: string, chain: string) =>
    posthog.capture("tx_confirmed", { tx_hash: txHash, chain }),
};

function hashAddress(a: string) {
  return a.slice(0, 6) + "…" + a.slice(-4);
}
```

### Public dashboard

PostHog lets you expose a read-only dashboard URL. Put it in:
- `README.md` under "Live metrics"
- Pitch slide 7 (traction slide)
- Submission description

---

## 3. Wallet-connect counter (15 minutes)

For web3 demos. Three ways:

### A. RainbowKit / wagmi onConnect event

```tsx
import { useAccount, useAccountEffect } from "wagmi";

useAccountEffect({
  onConnect({ address, chainId }) {
    track.walletConnected(address, String(chainId));
    // also ping your own counter
    fetch("/api/metric/wallet-connect", {
      method: "POST",
      body: JSON.stringify({ address, chainId }),
    });
  },
});
```

### B. Server-side counter (for the public dashboard)

```ts
// app/api/metric/wallet-connect/route.ts
import { db } from "@/lib/db";
import { walletConnects } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  const { address, chainId } = await req.json();
  await db.insert(walletConnects).values({
    address_hash: sha256(address).slice(0, 16),
    chain: String(chainId),
    ts: new Date(),
  }).onConflictDoNothing();
  return Response.json({ ok: true });
}

export async function GET() {
  const [{ c }] = await db
    .select({ c: sql<number>`count(distinct address_hash)` })
    .from(walletConnects);
  return Response.json({ unique_wallets: Number(c) });
}
```

### C. Public metric endpoint in the UI

Displayed on the landing page itself:

```tsx
// app/page.tsx (landing)
async function Hero() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/metric/wallet-connect`, {
    next: { revalidate: 30 },
  });
  const { unique_wallets } = await res.json();
  return (
    <section>
      {/* ... */}
      <p>{unique_wallets.toLocaleString()} wallets connected this weekend</p>
    </section>
  );
}
```

Live number on the landing page = traction the judge sees in 2 seconds.

---

## What to put on screen during the pitch

Slide 7 (traction slide) of the 5-min deck should show, not claim:

```
[Plausible / PostHog dashboard screenshot, or better: live-embedded iframe]

247 sessions • 183 unique visitors • 47 wallets connected
94 waitlist signups • 12 demo completions • 3 integrations live

Data from {{start_time}} to {{now}} — refreshing every 30 seconds.
```

The word "refreshing every 30 seconds" buys you credibility disproportionate to the effort.

---

## Post-submission: keep the dashboard public

- Add a "Live metrics" section to README.md with the public dashboard link.
- Include the dashboard in grant applications' "traction" section.
- Screenshot weekly for the post-hackathon content cadence (see `build-in-public.md` weekly updates).

---

## Anti-patterns

1. **Fake metrics.** Judges check. A made-up "500 users" read the same as a made-up valuation.
2. **Unlabeled dashboards.** A screenshot of "243" without context could mean anything. Always label.
3. **Vanity metrics.** "10k page views" without conversion is noise. "143 completed the core flow" is signal.
4. **Hidden dashboards.** If the metric isn't publicly verifiable, the judge discounts it by 50%.
5. **Over-instrumenting.** 30 different events logged, none of them useful. Pick 5-8 core events; skip the rest.

---

## The 5 events every web3 demo should track

If nothing else, log these:

1. `landing_viewed` — denominator for everything else.
2. `waitlist_joined` — intent signal.
3. `wallet_connected` — qualified lead.
4. `demo_started` — engagement signal.
5. `demo_completed` — conversion signal.

With these five, you can compute: bounce rate, qualification rate, completion rate, and the rate at which each stage drops. That's a proper funnel.

---

**Cross-refs:**
- `../arsenal/landing/Waitlist.tsx` — fires `waitlist_joined`
- `../arsenal/starter/init.sh` — scaffolds with Vercel Analytics preinstalled
- `build-in-public.md` — metrics become post content
- `../arsenal/pitch/variants.md` Slide 7 — traction slide template
