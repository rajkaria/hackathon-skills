/**
 * Branded OG Image Route — Vercel @vercel/og
 *
 * Origin: Rule 10 in SKILL.md. When judges share your link in Slack/Discord
 * for other judges to review, a branded preview card gets ~3× more clicks
 * than a bare URL. Takes 20 minutes once, applies to every share forever.
 *
 * Use when: any project with a public landing page.
 * Skip if:  truly internal tool with no shareable URL.
 *
 * Setup:
 *   1. Place this file at: src/app/api/og/route.tsx
 *   2. Add to your root layout's metadata:
 *        openGraph: { images: ['/api/og?title=Your+Project'] },
 *        twitter:   { card: 'summary_large_image', images: ['/api/og?title=Your+Project'] }
 *   3. Customize colors/fonts to match your brand (search "// EDIT:" below)
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // EDIT: defaults — make these match your project
  const title = searchParams.get("title") ?? "Your Project";
  const tagline = searchParams.get("tagline") ?? "One-line description that hooks the reader.";
  const accent = searchParams.get("accent") ?? "#22C55E";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #09090B 0%, #18181B 100%)",
          color: "white",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Top: small mark / wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "28px", opacity: 0.9 }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 800,
              color: "#09090B",
            }}
          >
            ▲
          </div>
          <span style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</span>
        </div>

        {/* Middle: tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              maxWidth: "1000px",
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Bottom: accent bar + URL */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "60px", height: "4px", background: accent }} />
            <span style={{ fontSize: "24px", opacity: 0.7 }}>
              {/* EDIT: your live URL */}
              yourproject.xyz
            </span>
          </div>
          <span style={{ fontSize: "20px", opacity: 0.5 }}>
            {/* EDIT: hackathon name */}
            Hackathon Edition
          </span>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
