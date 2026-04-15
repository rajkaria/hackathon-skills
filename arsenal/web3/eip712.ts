/**
 * EIP-712 Signing Helpers
 *
 * Origin: Bench's BEC v2 certificate signing. Wrote this from scratch twice
 * before extracting it. Pure viem — no extra deps.
 *
 * Use when: you need to produce off-chain signed data that's verifiable
 *           on-chain (signed messages, certificates, signed receipts).
 * Skip if:  you only need wallet message signing (use `signMessage` directly).
 */

import { type Account, type Hash, type WalletClient } from "viem";

/**
 * EIP-712 typed data domain. Bind to your contract + chain.
 * The chainId MUST match the contract that will verify the signature.
 */
export interface TypedDataDomain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: `0x${string}`;
}

/**
 * Generic EIP-712 signer. Works for any types definition.
 *
 * @example
 * const signature = await signTyped({
 *   client,
 *   account,
 *   domain: { name: "Bench", version: "2", chainId: 196, verifyingContract: REGISTRY },
 *   types: {
 *     Certificate: [
 *       { name: "agent",      type: "address" },
 *       { name: "actionHash", type: "bytes32" },
 *       { name: "score",      type: "uint8"   },
 *       { name: "deadline",   type: "uint256" },
 *       { name: "nonce",      type: "bytes32" },  // <-- replay protection!
 *     ],
 *   },
 *   primaryType: "Certificate",
 *   message: { agent, actionHash, score, deadline, nonce },
 * });
 */
export async function signTyped<T extends Record<string, unknown>>(opts: {
  client: WalletClient;
  account: Account;
  domain: TypedDataDomain;
  types: Record<string, Array<{ name: string; type: string }>>;
  primaryType: string;
  message: T;
}): Promise<Hash> {
  return await opts.client.signTypedData({
    account: opts.account,
    domain: opts.domain,
    types: opts.types,
    primaryType: opts.primaryType,
    message: opts.message,
  });
}

/**
 * Generate a 32-byte nonce. Use this in every signed message that could be
 * replayed. Storing nonces on-chain (or in a DB unique index) prevents the
 * same signature from being used twice.
 *
 * Lesson from Bench v1: a signed certificate without a nonce is replayable
 * forever. The Security Auditor judge persona will catch this.
 */
export function generateNonce(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}` as `0x${string}`;
}

/**
 * Compute a deadline timestamp N seconds from now. Always pair signed messages
 * with a deadline — open-ended signatures are a footgun.
 */
export function deadlineFromNow(secondsFromNow: number): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + secondsFromNow);
}
