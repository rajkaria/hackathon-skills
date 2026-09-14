/**
 * switch-chain.ts against scripted wallets.
 *
 * The regression this guards (Humanline, September 2026): wagmi only adds a
 * missing chain on MetaMask's 4902. Every other wallet's "unknown chain" error
 * left the user stuck on "Switch to <chain>" with no prompt.
 *
 *   bun test arsenal/web3/switch-chain.test.ts
 */

import { describe, expect, test } from "bun:test";

import {
  type AddChainParams,
  addChainParamsFrom,
  describeSwitchError,
  type Eip1193Request,
  isRequestPending,
  isUserRejection,
  networkName,
  switchWalletToChain,
  toHexChainId,
} from "./switch-chain";

const ARC: AddChainParams = {
  chainId: "0x4cef52", // 5042002
  chainName: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: ["https://rpc.testnet.arc.network"],
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

type Call = { method: string; params?: readonly unknown[] };
/** "switches": this wallet moves to the chain as part of adding it (MetaMask, Rabby). */
type Step = unknown | Error;

/** A scripted EIP-1193 provider: each method answers from a queue; eth_chainId tracks state. */
function fakeWallet(script: Record<string, Step[]>, startChain = "0x1") {
  const calls: Call[] = [];
  let chain = startChain;
  const request: Eip1193Request = async ({ method, params }) => {
    calls.push({ method, params });
    if (method === "eth_chainId") return chain;
    const next = script[method]?.shift();
    if (next instanceof Error) throw next;
    if (method === "wallet_switchEthereumChain") chain = (params?.[0] as { chainId: string }).chainId;
    if (method === "wallet_addEthereumChain" && next === "switches") {
      chain = (params?.[0] as { chainId: string }).chainId;
    }
    return null;
  };
  return { request, calls, methods: () => calls.map((c) => c.method), chain: () => chain };
}

function rpcError(code: number, message = "error"): Error {
  return Object.assign(new Error(message), { code });
}

describe("switchWalletToChain", () => {
  test("a wallet that already knows the chain just switches (one prompt)", async () => {
    const w = fakeWallet({ wallet_switchEthereumChain: [null] });
    expect(await switchWalletToChain(w.request, ARC)).toBe("switched");
    expect(w.methods()).toEqual(["wallet_switchEthereumChain"]);
    expect(w.calls[0].params).toEqual([{ chainId: "0x4cef52" }]);
  });

  test("MetaMask 4902: adds the chain, and does not re-prompt once the add switched", async () => {
    const w = fakeWallet({
      wallet_switchEthereumChain: [rpcError(4902, "Unrecognized chain ID")],
      wallet_addEthereumChain: ["switches"],
    });
    expect(await switchWalletToChain(w.request, ARC)).toBe("added");
    expect(w.methods()).toEqual(["wallet_switchEthereumChain", "wallet_addEthereumChain", "eth_chainId"]);
    expect(w.calls[1].params).toEqual([
      {
        chainId: "0x4cef52",
        chainName: "Arc Testnet",
        nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
        rpcUrls: ["https://rpc.testnet.arc.network"],
        blockExplorerUrls: ["https://testnet.arcscan.app"],
      },
    ]);
    expect(w.chain()).toBe("0x4cef52");
  });

  // The actual regression: what non-MetaMask wallets send for an unknown chain.
  for (const [name, err] of [
    ["Rabby / Phantom (-32603)", rpcError(-32603, "Unrecognized chain ID 0x4cef52")],
    ["Coinbase Wallet / OKX (4200)", rpcError(4200, "Unsupported chain")],
    ["a wallet with a bare message and no code", new Error("Chain not supported")],
  ] as const) {
    test(`${name} still gets the add-network prompt`, async () => {
      const w = fakeWallet({ wallet_switchEthereumChain: [err], wallet_addEthereumChain: ["switches"] });
      expect(await switchWalletToChain(w.request, ARC)).toBe("added");
      expect(w.methods()).toEqual(["wallet_switchEthereumChain", "wallet_addEthereumChain", "eth_chainId"]);
      expect(w.chain()).toBe("0x4cef52");
    });
  }

  test("Trust-style wallet that adds without switching gets a follow-up switch", async () => {
    const w = fakeWallet({
      wallet_switchEthereumChain: [rpcError(-32603, "Unrecognized chain"), null],
      wallet_addEthereumChain: [null],
    });
    expect(await switchWalletToChain(w.request, ARC)).toBe("added");
    expect(w.methods()).toEqual([
      "wallet_switchEthereumChain",
      "wallet_addEthereumChain",
      "eth_chainId",
      "wallet_switchEthereumChain",
    ]);
    expect(w.chain()).toBe("0x4cef52");
  });

  test("a declined switch is rethrown and never retried as an add (no second prompt)", async () => {
    const w = fakeWallet({ wallet_switchEthereumChain: [rpcError(4001, "User rejected the request.")] });
    await expect(switchWalletToChain(w.request, ARC)).rejects.toMatchObject({ code: 4001 });
    expect(w.calls).toHaveLength(1);
  });

  test("a rejection wrapped by viem (-32603 with cause 4001) is still a rejection", async () => {
    const wrapped = Object.assign(new Error("An internal error was received."), {
      code: -32603,
      cause: rpcError(4001, "User rejected the request."),
    });
    const w = fakeWallet({ wallet_switchEthereumChain: [wrapped] });
    await expect(switchWalletToChain(w.request, ARC)).rejects.toBe(wrapped);
    expect(w.calls).toHaveLength(1);
  });

  test("an already-open prompt is rethrown, never stacked", async () => {
    const w = fakeWallet({ wallet_switchEthereumChain: [rpcError(-32002, "Request already pending")] });
    await expect(switchWalletToChain(w.request, ARC)).rejects.toMatchObject({ code: -32002 });
    expect(w.calls).toHaveLength(1);
  });

  test("a declined add surfaces as a rejection", async () => {
    const w = fakeWallet({
      wallet_switchEthereumChain: [rpcError(4902)],
      wallet_addEthereumChain: [rpcError(4001)],
    });
    await expect(switchWalletToChain(w.request, ARC)).rejects.toMatchObject({ code: 4001 });
    expect(w.methods()).toEqual(["wallet_switchEthereumChain", "wallet_addEthereumChain"]);
  });

  test("normalises the chain id MetaMask would reject (uppercase, leading zeros)", async () => {
    const w = fakeWallet({ wallet_switchEthereumChain: [null] });
    await switchWalletToChain(w.request, { ...ARC, chainId: "0x004CEF52" });
    expect(w.calls[0].params).toEqual([{ chainId: "0x4cef52" }]);
  });

  test("omits empty optional arrays from the add payload", async () => {
    const w = fakeWallet({ wallet_switchEthereumChain: [rpcError(4902)], wallet_addEthereumChain: ["switches"] });
    await switchWalletToChain(w.request, { ...ARC, blockExplorerUrls: [] });
    expect(w.calls[1].params?.[0]).not.toHaveProperty("blockExplorerUrls");
  });

  test("an eth_chainId that throws after add still asks for the switch", async () => {
    const calls: string[] = [];
    const request: Eip1193Request = async ({ method }) => {
      calls.push(method);
      if (method === "eth_chainId") throw new Error("not supported");
      if (method === "wallet_switchEthereumChain" && calls.length === 1) throw rpcError(4902);
      return null;
    };
    expect(await switchWalletToChain(request, ARC)).toBe("added");
    expect(calls).toEqual(["wallet_switchEthereumChain", "wallet_addEthereumChain", "eth_chainId", "wallet_switchEthereumChain"]);
  });
});

describe("error classification", () => {
  test("finds a rejection through nested cause chains and data.originalError", () => {
    expect(isUserRejection({ cause: { code: 4001 } })).toBe(true);
    expect(isUserRejection({ code: -32603, cause: { code: -1, cause: { code: 4001 } } })).toBe(true);
    expect(isUserRejection({ code: -32603, data: { originalError: { code: 4001 } } })).toBe(true);
    expect(isUserRejection({ message: "outer", cause: new Error("User denied network switch") })).toBe(true);
    expect(isUserRejection(rpcError(4902))).toBe(false);
    expect(isUserRejection(null)).toBe(false);
    expect(isUserRejection("user rejected")).toBe(true);
  });

  test("finds a pending request, including nested", () => {
    expect(isRequestPending(rpcError(-32002))).toBe(true);
    expect(isRequestPending({ code: -32603, cause: { code: -32002 } })).toBe(true);
    expect(isRequestPending(new Error("Request of type 'wallet_switchEthereumChain' already pending"))).toBe(true);
    expect(isRequestPending(rpcError(4001))).toBe(false);
  });

  test("survives a self-referential cause", () => {
    const loop: { code: number; message: string; cause?: unknown } = { code: 1, message: "loop" };
    loop.cause = loop;
    expect(isUserRejection(loop)).toBe(false);
    expect(isRequestPending(loop)).toBe(false);
  });

  test("describes failures in the wallet holder's terms", () => {
    expect(describeSwitchError(rpcError(4001), "Arc Testnet")).toBe(
      "The network switch was declined in your wallet. This app only works on Arc Testnet.",
    );
    expect(describeSwitchError(rpcError(-32002), "Arc Testnet")).toContain("already has a request open");
    expect(describeSwitchError(new Error("RPC unreachable\nstack"), "Arc Testnet")).toBe(
      "Could not switch to Arc Testnet: RPC unreachable",
    );
    expect(describeSwitchError({ shortMessage: "HTTP request failed." }, "Base")).toBe(
      "Could not switch to Base: HTTP request failed.",
    );
    expect(describeSwitchError(undefined, "Base")).toBe("Could not switch to Base: Unknown error");
  });
});

describe("helpers", () => {
  test("toHexChainId canonicalises numbers and hex strings", () => {
    expect(toHexChainId(5042002)).toBe("0x4cef52");
    expect(toHexChainId("0x0A")).toBe("0xa");
    expect(toHexChainId("8453")).toBe("0x2105");
    expect(() => toHexChainId(0)).toThrow();
    expect(() => toHexChainId("0xzz")).toThrow();
  });

  test("addChainParamsFrom maps a viem-shaped chain", () => {
    expect(
      addChainParamsFrom({
        id: 5042002,
        name: "Arc Testnet",
        nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
        rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
        blockExplorers: { default: { url: "https://testnet.arcscan.app" } },
      }),
    ).toEqual(ARC);
  });

  test("networkName knows common chains and accepts extras", () => {
    expect(networkName(1)).toBe("Ethereum mainnet");
    expect(networkName(8453)).toBe("Base");
    expect(networkName(999999)).toBe("chainId 999999");
    expect(networkName(999999, { 999999: "My Devnet" })).toBe("My Devnet");
    expect(networkName(1, { 1: "L1" })).toBe("L1");
    expect(networkName(undefined)).toBe("an unknown network");
  });
});
