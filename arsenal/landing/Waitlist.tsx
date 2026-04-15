/**
 * Waitlist — Email Capture Component
 *
 * Origin: Sprint 5 / Item #11. Hackathon traffic is your cheapest user
 * acquisition window. Capture it from day 1, even if the product isn't ready.
 *
 * Wire `onSubmit` to whatever backend you trust:
 *   - Resend + a `waitlist` table in your DB
 *   - ConvertKit / Loops / Beehiiv API
 *   - Even a simple Vercel KV append
 *
 * What to show judges in the pitch:
 *   "We deployed 3 days ago. 84 people on the waitlist already."
 *   That's traction evidence — much stronger than a vision-only pitch.
 */

"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WaitlistProps {
  headline?: string;
  subheadline?: string;
  onSubmit: (email: string) => Promise<{ ok: boolean; error?: string }>;
}

export function Waitlist({
  headline = "Get early access",
  subheadline = "We ship updates weekly. No spam.",
  onSubmit,
}: WaitlistProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setState("loading");
    setError(null);
    const result = await onSubmit(email);
    if (result.ok) {
      setState("success");
    } else {
      setState("error");
      setError(result.error ?? "Something went wrong. Try again?");
    }
  }

  if (state === "success") {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-4 text-green-400">
        <CheckCircle2 className="h-5 w-5" />
        <span>You&apos;re on the list. We&apos;ll be in touch.</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <h3 className="mb-2 text-2xl font-semibold text-white">{headline}</h3>
      <p className="mb-6 text-sm text-zinc-400">{subheadline}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={state === "loading"} className="bg-green-500 text-black hover:bg-green-400">
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join waitlist"}
        </Button>
      </form>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
