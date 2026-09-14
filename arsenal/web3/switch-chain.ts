/**
 * Get a wallet onto ANY EVM chain: add the network if the wallet needs it, then switch.
 *
 * Origin: Humanline (Creditcoin CC3 testnet, September 2026). Found by a user,
 * not by QA, on submission day.
 *
 * The bug: wagmi's `switchChain` only falls back to `wallet_addEthereumChain`
 * when the wallet answers `wallet_switchEthereumChain` with error 4902. That is
 * MetaMask's code. Rabby, Phantom, Trust, OKX and Coinbase Wallet report an
 * unknown chain as -32603, 4200, or a bare message with no code at all. On
 * those wallets the switch failed silently: no prompt, no network added, and
 * the header kept saying "Switch to CC3" forever. Everyone on the team used
 * MetaMask, so nobody saw it until a judge-adjacent user did.
 *
 * The fix: talk EIP-1193 directly and treat every failure EXCEPT "the user said
 * no" (4001) or "a prompt is already open" (-32002) as "this wallet does not
 * know the chain yet". Retrying either of those two would open a second prompt
 * the user did not ask for.
 *
 * Use when: your dApp targets a chain that is not preinstalled in wallets
 *           (any testnet, any L2 newer than a year, any sponsor chain).
 * Skip if:  you only support Ethereum mainnet, or you use a hosted wallet
 *           (Privy/Dynamic embedded) that you configure server-side.
 *
 * No React, wagmi or viem imports: drive it from tests with a fake provider
 * (see switch-chain.test.ts) and from the app with `connector.getProvider()`.
 */

/** The one method an EIP-1193 provider must expose. */
export type Eip1193Request = (args: { method: string; params?: readonly unknown[] }) => Promise<unknown>;

/** EIP-3085 `wallet_addEthereumChain` parameters. */
export interface AddChainParams {
  /** Hex chain id, e.g. "0x4cef52". Normalised before sending (MetaMask rejects "0x0A"). */
  chainId: string;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: readonly string[];
  blockExplorerUrls?: readonly string[];
  iconUrls?: readonly string[];
}

/** What `switchWalletToChain` had to do. */
export type SwitchOutcome = "switched" | "added";

/** EIP-1193 `userRejectedRequest`. */
const USER_REJECTED = 4001;
/** JSON-RPC "resource unavailable": MetaMask's "a prompt for this site is already open". */
const REQUEST_PENDING = -32002;

/** Canonical hex chain id: lowercase, no leading zeros. Accepts a number or any hex spelling. */
export function toHexChainId(chainId: number | string): string {
  const n = typeof chainId === "number" ? chainId : Number.parseInt(chainId, chainId.startsWith("0x") ? 16 : 10);
  if (!Number.isSafeInteger(n) || n <= 0) throw new Error(`invalid chain id: ${String(chainId)}`);
  return `0x${n.toString(16)}`;
}

/**
 * Build AddChainParams from a viem/wagmi `Chain` object without importing viem.
 * `addChainParamsFrom(arcTestnet)` is all most apps need.
 */
export function addChainParamsFrom(chain: {
  id: number;
  name: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: { default: { http: readonly string[] } };
  blockExplorers?: { default: { url: string } };
}): AddChainParams {
  return {
    chainId: toHexChainId(chain.id),
    chainName: chain.name,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: [...chain.rpcUrls.default.http],
    ...(chain.blockExplorers ? { blockExplorerUrls: [chain.blockExplorers.default.url] } : {}),
  };
}

/** Follow `cause` / `data.originalError` wrappers (viem, MetaMask Mobile) and collect every code. */
function errorCodes(error: unknown): number[] {
  const codes: number[] = [];
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const e = current as { code?: unknown; data?: { originalError?: unknown }; cause?: unknown };
    if (typeof e.code === "number") codes.push(e.code);
    const original = e.data?.originalError as { code?: unknown } | undefined;
    if (original && typeof original.code === "number") codes.push(original.code);
    current = e.cause;
  }
  return codes;
}

/** Every `message` down the cause chain, newline-joined. Cycle-safe. */
function errorText(error: unknown, seen = new Set<unknown>()): string {
  if (typeof error === "string") return error;
  if (!error || typeof error !== "object" || seen.has(error)) return "";
  seen.add(error);
  const e = error as { message?: unknown; cause?: unknown };
  const own = typeof e.message === "string" ? e.message : "";
  const inner = e.cause ? errorText(e.cause, seen) : "";
  return inner ? `${own}\n${inner}` : own;
}

/** The user dismissed or declined the wallet prompt. */
export function isUserRejection(error: unknown): boolean {
  return (
    errorCodes(error).includes(USER_REJECTED) ||
    /user (rejected|denied|cancel)|rejected by (the )?user|request rejected/i.test(errorText(error))
  );
}

/** The wallet already has a prompt open for this site. */
export function isRequestPending(error: unknown): boolean {
  return (
    errorCodes(error).includes(REQUEST_PENDING) ||
    /already pending|request of type .* already/i.test(errorText(error))
  );
}

async function currentChainId(request: Eip1193Request): Promise<number | undefined> {
  try {
    const id = await request({ method: "eth_chainId" });
    if (typeof id === "string") return Number.parseInt(id, 16);
    return typeof id === "number" ? id : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Ask the wallet to move to `params.chainId`, adding the network first if it needs to.
 *
 * Rethrows user rejections and "already pending" untouched. Any other switch
 * failure is read as "unknown chain" and answered with an add, because wallets
 * do not agree on the code for that (4902, -32603, 4200, or none).
 */
export async function switchWalletToChain(request: Eip1193Request, params: AddChainParams): Promise<SwitchOutcome> {
  const chainId = toHexChainId(params.chainId);
  const target = Number.parseInt(chainId, 16);
  const switchParams = [{ chainId }] as const;

  try {
    await request({ method: "wallet_switchEthereumChain", params: switchParams });
    return "switched";
  } catch (error) {
    if (isUserRejection(error) || isRequestPending(error)) throw error;
    // Anything else: the wallet does not know this chain. Add it below.
  }

  await request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId,
        chainName: params.chainName,
        nativeCurrency: params.nativeCurrency,
        rpcUrls: [...params.rpcUrls],
        ...(params.blockExplorerUrls?.length ? { blockExplorerUrls: [...params.blockExplorerUrls] } : {}),
        ...(params.iconUrls?.length ? { iconUrls: [...params.iconUrls] } : {}),
      },
    ],
  });

  // MetaMask and Rabby switch as part of adding; Trust and older Coinbase
  // Wallet builds only add. Ask for the switch only if we are not there yet,
  // so the MetaMask path stays a single prompt.
  if ((await currentChainId(request)) !== target) {
    await request({ method: "wallet_switchEthereumChain", params: switchParams });
  }
  return "added";
}

/** First useful line of any thrown value (viem `shortMessage` first). */
function firstMessage(error: unknown): string {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error.split("\n")[0];
  const e = error as { shortMessage?: unknown; message?: unknown };
  const text = typeof e.shortMessage === "string" ? e.shortMessage : typeof e.message === "string" ? e.message : "";
  return text.split("\n")[0] || "Unknown error";
}

/** One sentence for a failed switch, phrased for the person holding the wallet. */
export function describeSwitchError(error: unknown, chainName: string): string {
  if (isUserRejection(error)) {
    return `The network switch was declined in your wallet. This app only works on ${chainName}.`;
  }
  if (isRequestPending(error)) {
    return "Your wallet already has a request open. Open the wallet extension to approve it.";
  }
  return `Could not switch to ${chainName}: ${firstMessage(error)}`;
}

const KNOWN_NETWORKS: Record<number, string> = {
  1: "Ethereum mainnet",
  10: "OP Mainnet",
  56: "BNB Smart Chain",
  100: "Gnosis",
  137: "Polygon",
  196: "X Layer",
  8453: "Base",
  42161: "Arbitrum One",
  43114: "Avalanche C-Chain",
  59144: "Linea",
  84532: "Base Sepolia",
  421614: "Arbitrum Sepolia",
  11155111: "Sepolia",
  11155420: "OP Sepolia",
  102030: "Creditcoin mainnet",
  102031: "Creditcoin CC3 testnet",
  5042002: "Arc testnet",
};

/**
 * A readable name for whatever network a wallet reports.
 * `extra` adds or overrides names, e.g. `{ [myChain.id]: myChain.name }`.
 */
export function networkName(chainId: number | undefined, extra?: Record<number, string>): string {
  if (chainId === undefined) return "an unknown network";
  return extra?.[chainId] ?? KNOWN_NETWORKS[chainId] ?? `chainId ${chainId}`;
}

/*
 * ---------------------------------------------------------------------------
 * Usage: a network guard (React + wagmi). Mount ONCE in your providers, not
 * inside the connect button: two button instances would each fire a prompt,
 * and the wallet rejects the second with "request already pending".
 * ---------------------------------------------------------------------------
 *
 * "use client";
 * import { useState } from "react";
 * import { useAccount } from "wagmi";
 * import { arcTestnet } from "@/lib/chains";
 * import { addChainParamsFrom, describeSwitchError, networkName, switchWalletToChain,
 *          type Eip1193Request } from "@/lib/switch-chain";
 *
 * export function NetworkBanner() {
 *   const { connector, chainId, status } = useAccount();
 *   const [busy, setBusy] = useState(false);
 *   const [error, setError] = useState<string | null>(null);
 *   if (status !== "connected" || chainId === arcTestnet.id) return null;
 *
 *   async function onSwitch() {
 *     if (!connector || busy) return;
 *     setBusy(true); setError(null);
 *     try {
 *       const provider = (await connector.getProvider()) as { request?: Eip1193Request };
 *       if (!provider?.request) throw new Error(`${connector.name} exposes no EIP-1193 provider`);
 *       await switchWalletToChain(provider.request.bind(provider), addChainParamsFrom(arcTestnet));
 *       // MetaMask sometimes switches without emitting chainChanged (metamask-extension#24247):
 *       const now = await connector.getChainId().catch(() => undefined);
 *       if (now === arcTestnet.id) connector.emitter.emit("change", { chainId: now });
 *     } catch (err) {
 *       setError(describeSwitchError(err, arcTestnet.name));
 *     } finally {
 *       setBusy(false);
 *     }
 *   }
 *
 *   return (
 *     <div role="alert" className="flex items-center gap-3 bg-amber-100 px-4 py-2 text-sm">
 *       <span>Your wallet is on {networkName(chainId, { [arcTestnet.id]: arcTestnet.name })}.</span>
 *       <button onClick={onSwitch} disabled={busy}>
 *         {busy ? "Check your wallet" : `Switch to ${arcTestnet.name}`}
 *       </button>
 *       {error && <span className="text-red-700">{error}</span>}
 *     </div>
 *   );
 * }
 *
 * Before submitting, test the button in at least MetaMask AND Rabby (or
 * Phantom). They take different code paths here; one wallet proves nothing.
 */
