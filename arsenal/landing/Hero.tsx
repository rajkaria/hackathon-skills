/**
 * Hero — Landing Page Top Section
 *
 * Pattern: one-liner → tagline → primary CTA + secondary CTA → social proof bar.
 * Origin: Linear/Vercel-style hero, adapted for hackathon submissions.
 *
 * 30-second test compliance: a new visitor reads the one-liner, sees the CTA,
 * and reaches the core feature within one click.
 */

"use client";

import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  // EDIT all of these for your project
  badge?: string;             // e.g. "Live on X Layer Mainnet"
  oneLiner: string;           // 6-10 word value prop
  tagline: string;            // one sentence explaining who it's for
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  socialProof?: string[];     // ["13 sources", "1,247 certificates issued", "0 gas fees"]
}

export function Hero({
  badge,
  oneLiner,
  tagline,
  primaryCta,
  secondaryCta,
  socialProof,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 py-24">
      {/* Subtle radial accent — signals "modern" without being loud */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(34, 197, 94, 0.25) 0%, transparent 100%)",
        }}
      />

      <div className="container mx-auto max-w-4xl px-6 text-center">
        {badge && (
          <Badge variant="outline" className="mb-6 border-green-500/30 bg-green-500/10 text-green-400">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            {badge}
          </Badge>
        )}

        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
          {oneLiner}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 md:text-xl">
          {tagline}
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-green-500 text-black hover:bg-green-400">
            <Link href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {secondaryCta && (
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryCta.href}>
                <Github className="mr-2 h-4 w-4" />
                {secondaryCta.label}
              </Link>
            </Button>
          )}
        </div>

        {socialProof && socialProof.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-zinc-500">
            {socialProof.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
