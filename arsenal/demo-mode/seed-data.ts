/**
 * Seed Data — What Judges See in Demo Mode
 *
 * Rules for hackathon-grade seed data:
 *   1. Numbers must be realistic. "1,247 certificates" beats "10 certificates."
 *      Judges instantly distrust round numbers and small samples.
 *   2. Timestamps must be recent. Use relative dates (Date.now() - hours)
 *      so the demo never looks abandoned.
 *   3. Names must be plausible. Don't use "Test User 1." Use real-sounding
 *      personas tied to your product narrative ("Sarah's DAO", "DeFi Vault Bot").
 *   4. Diversity matters. Show success cases, edge cases, and one failure.
 *      A perfect-looking feed feels fake.
 *   5. Update the hero metric live. If your homepage shows "1,247 transactions
 *      processed", make sure the feed below contains 1,247 entries' worth of
 *      pagination signal. Don't show 5 items under a stat that says 1,247.
 *
 * Origin: Bench's CertFeed, TollPay's payment log, Aegis's metrics endpoint.
 * Replace the structure below with your project's primary entities.
 */

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

export const seedData = {
  stats: {
    totalCount: 1247,
    last24h: 89,
    successRate: 0.987,
    avgLatencyMs: 412,
  },

  certificates: [
    {
      id: "cert_8f2a91",
      agent: "Sarah's DAO Treasury Bot",
      action: "ETH → USDC swap",
      amount: "$12,400",
      status: "CERTIFIED",
      score: 96,
      createdAt: hoursAgo(0.2),
    },
    {
      id: "cert_8f2a90",
      agent: "DeFi Vault — Strategy Alpha",
      action: "WBTC rebalance",
      amount: "$48,200",
      status: "CERTIFIED",
      score: 94,
      createdAt: hoursAgo(1.1),
    },
    {
      id: "cert_8f2a8f",
      agent: "DCA Bot — yield.eth",
      action: "USDC → ETH",
      amount: "$2,000",
      status: "WARNING",
      score: 71,
      createdAt: hoursAgo(2.4),
    },
    {
      id: "cert_8f2a8e",
      agent: "Cross-chain Settler",
      action: "Polygon → Arbitrum bridge",
      amount: "$8,750",
      status: "CERTIFIED",
      score: 91,
      createdAt: hoursAgo(3.8),
    },
    {
      id: "cert_8f2a8d",
      agent: "Sarah's DAO Treasury Bot",
      action: "Payroll batch (15 recipients)",
      amount: "$22,500",
      status: "CERTIFIED",
      score: 99,
      createdAt: hoursAgo(6.2),
    },
  ],

  leaderboard: [
    { agent: "Sarah's DAO Treasury Bot", count: 142, score: 95.2 },
    { agent: "DeFi Vault — Strategy Alpha", count: 98, score: 93.8 },
    { agent: "Cross-chain Settler", count: 76, score: 91.4 },
    { agent: "DCA Bot — yield.eth", count: 64, score: 88.1 },
    { agent: "Market Maker — Optimism", count: 51, score: 86.7 },
  ],
};
