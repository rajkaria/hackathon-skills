/**
 * Comparison Table — "Without X vs With X"
 *
 * Origin: Rule 4 from SKILL.md. TollPay added a "Why Toll vs raw x402"
 * comparison table that made the value prop instantly clear to judges who
 * couldn't otherwise differentiate yet-another-protocol.
 *
 * 15-minute task, outsized judge impact. Judges retain comparisons because
 * they map cleanly onto the mental shortcut "before vs after."
 *
 * Drop into your landing page below the hero.
 */

"use client";

import { Check, X } from "lucide-react";

interface ComparisonRow {
  capability: string;
  without: string;
  with: string;
}

interface ComparisonProps {
  withoutLabel?: string;       // e.g. "Without Bench" or "Status quo"
  withLabel?: string;          // e.g. "With Bench"
  rows: ComparisonRow[];
}

export function Comparison({
  withoutLabel = "Without us",
  withLabel = "With us",
  rows,
}: ComparisonProps) {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950 py-20">
      <div className="container mx-auto max-w-5xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-white">
          See the difference
        </h2>

        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Capability</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-red-400">
                  <X className="mr-2 inline h-4 w-4" />
                  {withoutLabel}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-green-400">
                  <Check className="mr-2 inline h-4 w-4" />
                  {withLabel}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {rows.map((row) => (
                <tr key={row.capability} className="bg-zinc-950 hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-medium text-white">{row.capability}</td>
                  <td className="px-6 py-4 text-zinc-400">{row.without}</td>
                  <td className="px-6 py-4 text-zinc-200">{row.with}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// Example usage:
//
// <Comparison
//   withoutLabel="Without Bench"
//   withLabel="With Bench"
//   rows={[
//     { capability: "Best price discovery", without: "Trust one aggregator", with: "13 sources, signed proof" },
//     { capability: "On-chain receipt",      without: "None",                with: "EIP-712 + X Layer anchor" },
//     { capability: "Audit trail",           without: "Off-chain logs only", with: "Verifiable forever" },
//     { capability: "Gas cost",              without: "Per chain",           with: "Zero on X Layer" },
//   ]}
// />
