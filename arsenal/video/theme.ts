/**
 * Video Theme — Color Palette & Animation Constants
 *
 * Origin: Bench's hype video. The 7-color palette is intentionally constrained
 * — too many colors look amateur. Pick ONE accent that matches your product
 * and inherit the rest.
 */

export const FPS = 30;
export const TOTAL_FRAMES = 47 * FPS; // 1410

// Color palette — replace `accent` with your brand color, keep the rest.
export const colors = {
  bg: "#09090B",          // near-black background — easier to make professional than white
  bgElevated: "#18181B",  // for cards / surfaces
  text: "#FAFAFA",
  textMuted: "#A1A1AA",
  accent: "#22C55E",      // EDIT: your primary brand color
  accentBright: "#00FF88",// EDIT: accent's brighter variant for highlights
  contrast: "#00DDFF",    // EDIT: secondary highlight color
  warning: "#F97316",
  danger: "#EF4444",
  success: "#22C55E",
};

// Scene durations in frames (sum = TOTAL_FRAMES)
export const sceneDurations = {
  coldOpen: 90,      // 3s
  problem: 120,      // 4s
  logoReveal: 90,    // 3s
  fanOut: 150,       // 5s
  consensus: 120,    // 4s
  certificate: 120,  // 4s
  onChain: 120,      // 4s
  productShot: 150,  // 5s
  stats: 150,        // 5s
  roadmap: 150,      // 5s
  cta: 150,          // 5s
} as const;

// Easing presets — use these consistently for visual cohesion
export const easing = {
  // Snappy entrance (most UI elements)
  snappy: { damping: 18, mass: 0.5, stiffness: 200 },
  // Gentle (text, ambient elements)
  gentle: { damping: 12, mass: 0.8, stiffness: 100 },
  // Punch (logo reveals, key moments)
  punch: { damping: 8, mass: 0.4, stiffness: 300 },
};

// Typography scale — only three sizes, modeled on Vercel/Linear
export const type = {
  hero: { fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 },
  h1: { fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 },
  h2: { fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2 },
  body: { fontSize: 28, fontWeight: 400, lineHeight: 1.4 },
  mono: { fontFamily: "JetBrains Mono, monospace", fontSize: 24 },
} as const;
