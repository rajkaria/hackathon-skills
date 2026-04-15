#!/usr/bin/env bash
# Hackathon Starter Bootstrap
# Origin: rebuilt 4× across Bench, TollPay, Aegis, HashPay. Never again.
#
# Usage: bash init.sh <project-name>
#
# Produces: a Next.js 15 + Tailwind 4 + shadcn/ui + wagmi/viem + Drizzle project,
# initialized git, deployed to Vercel, with demo-mode facade and OG image route
# pre-wired. Hour 0 → deployed staging URL in ~10 minutes.

set -euo pipefail

PROJECT_NAME="${1:-hackathon-project}"
ARSENAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -d "$PROJECT_NAME" ]; then
  echo "❌ Directory $PROJECT_NAME already exists. Pick a different name."
  exit 1
fi

echo "🚀 Bootstrapping $PROJECT_NAME from arsenal at $ARSENAL_DIR"

# 1. Next.js scaffold (App Router, TS, Tailwind, src dir, no eslint nag)
pnpm create next-app@latest "$PROJECT_NAME" \
  --typescript --tailwind --app --src-dir --import-alias "@/*" \
  --use-pnpm --eslint --turbopack --no-git

cd "$PROJECT_NAME"

# 2. shadcn/ui (dark theme, slate base)
pnpm dlx shadcn@latest init -d --base-color slate --css-variables

# 3. Core deps for hackathon-grade projects
pnpm add wagmi viem @tanstack/react-query \
         drizzle-orm @neondatabase/serverless \
         framer-motion lucide-react \
         posthog-js sonner

pnpm add -D drizzle-kit @types/node

# 4. Drop in arsenal pieces
mkdir -p src/lib src/app/api/og src/components/marketing
cp "$ARSENAL_DIR/demo-mode/data-provider.ts"   src/lib/data-provider.ts
cp "$ARSENAL_DIR/demo-mode/seed-data.ts"       src/lib/seed-data.ts
cp "$ARSENAL_DIR/og-image/route.tsx"           src/app/api/og/route.tsx
cp "$ARSENAL_DIR/landing/Hero.tsx"             src/components/marketing/Hero.tsx
cp "$ARSENAL_DIR/landing/Waitlist.tsx"         src/components/marketing/Waitlist.tsx
cp "$ARSENAL_DIR/landing/Comparison.tsx"       src/components/marketing/Comparison.tsx

# 5. Common shadcn components used in nearly every hackathon UI
pnpm dlx shadcn@latest add button card badge input dialog toast skeleton -y

# 6. Git init + first commit (clean history matters — see Rule on provenance)
git init
git add -A
git commit -m "chore: bootstrap from hackathon-skill arsenal"

# 7. Deploy to Vercel (requires `vercel` CLI logged in)
if command -v vercel >/dev/null 2>&1; then
  vercel --yes --prod=false || echo "⚠️  Vercel deploy skipped — run 'vercel' manually."
else
  echo "ℹ️  Install vercel CLI ('npm i -g vercel') and run 'vercel' to deploy."
fi

echo ""
echo "✅ $PROJECT_NAME bootstrapped."
echo ""
echo "Next steps (in order):"
echo "  1. cd $PROJECT_NAME && pnpm dev"
echo "  2. Edit src/components/marketing/Hero.tsx with your one-liner"
echo "  3. Wire your demo data into src/lib/seed-data.ts"
echo "  4. Run: vercel --prod  (when ready for the live URL judges click)"
echo ""
echo "Then read: ../SKILL.md → Phase 3 (SPEC) and start there."
