#!/usr/bin/env bash
# preflight-deploy.sh: everything worth checking BEFORE a Foundry deploy spends gas.
#
# Origin: hunch-vpm (Arc, September 2026). A failed deploy costs real gas and
# can leave half a protocol on chain with no record of what landed. Every check
# here is one that actually bit someone, and every check is READ-ONLY: this
# script never signs, never sends, never writes a file.
#
# Chain-agnostic. Configure with env vars, then run from the project root:
#
#   RPC_URL=https://rpc.testnet.arc.network EXPECTED_CHAIN_ID=5042002 \
#   DEPLOYER_ACCOUNT=arc-deployer GAS_SYMBOL=USDC MIN_GAS_BALANCE=0.35 \
#   bash scripts/preflight-deploy.sh
#
# Required
#   RPC_URL             JSON-RPC endpoint (never printed; it may carry a key)
#   EXPECTED_CHAIN_ID   decimal chain id; the script refuses any other chain
#   DEPLOYER_ACCOUNT    cast keystore account name (cast wallet import <name> --interactive)
# Optional
#   ETH_PASSWORD        path to a keystore PASSWORD FILE (Foundry's own variable).
#                       Without it the balance check is skipped, never prompted.
#   GAS_DECIMALS        decimals of the native gas token's raw balance      (default 18)
#   GAS_SYMBOL          label for output                                     (default native)
#   MIN_GAS_BALANCE     minimum deployer balance, human units                (default 0.05)
#   CONTRACTS_ROOT      Foundry project root, relative to PROJECT_ROOT       (default contracts)
#   DEPLOY_SCRIPT       script path relative to CONTRACTS_ROOT               (default script/Deploy.s.sol)
#   DEPLOYMENTS_FILE    where the deployment JSON goes      (default deployments/<chain-id>.json)
#   VERIFIER            blockscout | etherscan | sourcify                    (default blockscout)
#   VERIFIER_URL        verifier API root; unset means "verify afterwards"
#   PROJECT_ROOT        default: git toplevel, else the current directory
#   RPC_TIMEOUT         seconds per RPC call before giving up                (default 15)
#   REQUIRE_CLEAN_TREE  1 turns a dirty git tree from a warning into a failure
#
# Exit 0 = READY (prints the deploy command). Exit 1 = NOT READY. Exit 2 = bad usage.
set -uo pipefail

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  sed -n '2,/^set -uo pipefail/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
  exit 0
fi
if [ $# -gt 0 ]; then
  echo "preflight-deploy.sh takes no arguments; configure it with env vars (see --help)" >&2
  exit 2
fi

RPC_URL="${RPC_URL:-}"
EXPECTED_CHAIN_ID="${EXPECTED_CHAIN_ID:-}"
DEPLOYER_ACCOUNT="${DEPLOYER_ACCOUNT:-}"
PASSWORD_FILE="${ETH_PASSWORD:-}"
GAS_DECIMALS="${GAS_DECIMALS:-18}"
GAS_SYMBOL="${GAS_SYMBOL:-native}"
MIN_GAS_BALANCE="${MIN_GAS_BALANCE:-0.05}"
CONTRACTS_ROOT="${CONTRACTS_ROOT:-contracts}"
DEPLOY_SCRIPT="${DEPLOY_SCRIPT:-script/Deploy.s.sol}"
DEPLOYMENTS_FILE="${DEPLOYMENTS_FILE:-deployments/${EXPECTED_CHAIN_ID:-unknown}.json}"
VERIFIER="${VERIFIER:-blockscout}"
VERIFIER_URL="${VERIFIER_URL:-}"
RPC_TIMEOUT="${RPC_TIMEOUT:-15}"
REQUIRE_CLEAN_TREE="${REQUIRE_CLEAN_TREE:-0}"
PROJECT_ROOT="${PROJECT_ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

export ETH_RPC_TIMEOUT="$RPC_TIMEOUT"

FAIL=0
if [ -t 1 ]; then G=$'\033[32m'; R=$'\033[31m'; Y=$'\033[33m'; B=$'\033[1m'; N=$'\033[0m'; else G=; R=; Y=; B=; N=; fi
ok()   { printf '  %s✓%s %s\n' "$G" "$N" "$1"; }
bad()  { printf '  %s✗%s %s\n' "$R" "$N" "$1"; FAIL=1; }
warn() { printf '  %s!%s %s\n' "$Y" "$N" "$1"; }
step() { printf '\n%s==> %s%s\n' "$B" "$1" "$N"; }

# Run a command with a wall-clock limit. macOS has no `timeout`, and a preflight
# that hangs on a dead RPC is one nobody finishes reading. stdin is /dev/null so
# nothing can sit on a hidden password prompt.
# Output goes through a temp file, not a pipe: a killed command's orphaned
# children would otherwise hold a $(...) pipe open until they exit on their own.
with_timeout() {
  local secs="$1"; shift
  local out
  out="$(mktemp -t preflight-out.XXXXXX)" || return 1
  "$@" </dev/null >"$out" &
  local pid=$!
  ( sleep "$secs"; pkill -TERM -P "$pid" 2>/dev/null; kill -TERM "$pid" 2>/dev/null ) >/dev/null 2>&1 &
  local watchdog=$!
  wait "$pid" 2>/dev/null
  local rc=$?
  pkill -TERM -P "$watchdog" 2>/dev/null
  kill "$watchdog" 2>/dev/null
  wait "$watchdog" 2>/dev/null
  cat "$out"
  rm -f "$out"
  return $rc
}

# Exact decimal arithmetic in awk strings: no bash integer overflow on 18-decimal
# values (2^63 is only 9.2 ETH in wei), no floating-point rounding.
human_to_raw() { # "0.35" 18 -> 350000000000000000
  awk -v h="$1" -v d="$2" 'BEGIN {
    n = split(h, p, "."); i = p[1]; f = (n > 1) ? p[2] : ""
    if (length(f) > d) f = substr(f, 1, d)
    while (length(f) < d) f = f "0"
    s = i f; sub(/^0+/, "", s); if (s == "") s = "0"; print s }'
}
raw_to_human() { # 350000000000000000 18 -> 0.35
  awk -v r="$1" -v d="$2" 'BEGIN {
    sub(/^0+/, "", r); if (r == "") r = "0"
    while (length(r) <= d) r = "0" r
    i = substr(r, 1, length(r) - d); f = substr(r, length(r) - d + 1)
    sub(/0+$/, "", f); print (f == "" ? i : i "." f) }'
}
raw_ge() { # exit 0 when integer string $1 >= $2
  awk -v a="$1" -v b="$2" 'BEGIN {
    sub(/^0+/, "", a); sub(/^0+/, "", b)
    if (length(a) != length(b)) exit !(length(a) > length(b))
    exit !((a "") >= (b ""))
  }'
}
is_uint()    { case "$1" in ''|*[!0-9]*) return 1 ;; *) return 0 ;; esac; }
is_decimal() { printf '%s' "$1" | grep -Eq '^[0-9]+(\.[0-9]+)?$'; }

printf '%sPreflight: Foundry deploy to chain %s%s\n' "$B" "${EXPECTED_CHAIN_ID:-<unset>}" "$N"
if ! cd "$PROJECT_ROOT" 2>/dev/null; then
  bad "PROJECT_ROOT '$PROJECT_ROOT' is not a directory"
  printf '\n%sNOT READY.%s Nothing was sent.\n' "$R" "$N"; exit 1
fi
printf '  project root: %s\n' "$PROJECT_ROOT"

step "Configuration"
[ -n "$RPC_URL" ]          && ok "RPC_URL is set (not printed)"      || bad "RPC_URL is not set"
if [ -z "$EXPECTED_CHAIN_ID" ]; then
  bad "EXPECTED_CHAIN_ID is not set. Without it nothing stops a deploy to the wrong chain"
elif ! is_uint "$EXPECTED_CHAIN_ID"; then
  bad "EXPECTED_CHAIN_ID='$EXPECTED_CHAIN_ID' must be a decimal integer (5042002, not 0x4cef52)"
else
  ok "EXPECTED_CHAIN_ID=$EXPECTED_CHAIN_ID"
fi
[ -n "$DEPLOYER_ACCOUNT" ] && ok "DEPLOYER_ACCOUNT=$DEPLOYER_ACCOUNT" || bad "DEPLOYER_ACCOUNT is not set (a cast keystore account name)"
is_uint "$GAS_DECIMALS"    || bad "GAS_DECIMALS='$GAS_DECIMALS' must be an integer"
is_decimal "$MIN_GAS_BALANCE" || bad "MIN_GAS_BALANCE='$MIN_GAS_BALANCE' must be a plain decimal like 0.05"
is_uint "$RPC_TIMEOUT"     || { bad "RPC_TIMEOUT='$RPC_TIMEOUT' must be an integer"; RPC_TIMEOUT=15; }

step "Tooling"
HAVE_FORGE=0; HAVE_CAST=0
if command -v forge >/dev/null 2>&1; then HAVE_FORGE=1; ok "$(forge --version 2>/dev/null | head -1)"; else bad "forge is not on PATH (curl -L https://foundry.paradigm.xyz | bash && foundryup)"; fi
if command -v cast  >/dev/null 2>&1; then HAVE_CAST=1;  ok "cast present"; else bad "cast is not on PATH"; fi
command -v jq >/dev/null 2>&1 && ok "jq present (used to record the deployment JSON)" || warn "jq is not on PATH; you will need it to record the deployment JSON"

step "The build"
IN_GIT=0; git rev-parse --is-inside-work-tree >/dev/null 2>&1 && IN_GIT=1
if [ ! -f "$CONTRACTS_ROOT/foundry.toml" ]; then
  bad "no foundry.toml in '$CONTRACTS_ROOT'. Set CONTRACTS_ROOT (use . for a single-root project)"
else
  # A fresh `git worktree add` or a clone without --recurse-submodules leaves
  # every submodule EMPTY. Deploy.s.sol imports forge-std/Script.sol, so the
  # deploy failed at compile time in a new worktree. Harmless only because it
  # failed before signing.
  EMPTY_SUBS=""
  if [ "$IN_GIT" = 1 ] && [ -f .gitmodules ]; then
    EMPTY_SUBS="$(git submodule status 2>/dev/null | awk '/^-/ { print $2 }' | tr '\n' ' ')"
  fi
  if [ -n "$EMPTY_SUBS" ]; then
    bad "uninitialised submodules: ${EMPTY_SUBS% }. Run: git submodule update --init --recursive"
  elif [ -d "$CONTRACTS_ROOT/lib/forge-std" ] && [ ! -f "$CONTRACTS_ROOT/lib/forge-std/src/Script.sol" ]; then
    bad "$CONTRACTS_ROOT/lib/forge-std is EMPTY (fresh worktree or clone). Run: git submodule update --init --recursive"
  elif [ ! -d "$CONTRACTS_ROOT/lib/forge-std" ] && ! grep -rqs 'forge-std' "$CONTRACTS_ROOT/remappings.txt" "$CONTRACTS_ROOT/foundry.toml" "$CONTRACTS_ROOT/dependencies" 2>/dev/null; then
    warn "no $CONTRACTS_ROOT/lib/forge-std. Fine if you do not import it; otherwise: forge install foundry-rs/forge-std"
  else
    ok "dependencies present"
  fi

  if [ ! -f "$CONTRACTS_ROOT/$DEPLOY_SCRIPT" ]; then
    bad "deploy script $CONTRACTS_ROOT/$DEPLOY_SCRIPT not found (set DEPLOY_SCRIPT)"
  fi

  if [ "$HAVE_FORGE" = 1 ]; then
    BUILD_LOG="$(mktemp -t preflight-build.XXXXXX)"
    if with_timeout 600 forge build --root "$CONTRACTS_ROOT" >"$BUILD_LOG" 2>&1; then
      ok "contracts compile (forge build --root $CONTRACTS_ROOT)"
    else
      bad "forge build --root $CONTRACTS_ROOT fails. Nothing deploys until it passes. Last lines:"
      tail -5 "$BUILD_LOG" | sed 's/^/       /'
    fi
    rm -f "$BUILD_LOG"
  fi
fi

step "The signer"
PASSWORD_FLAGS=()
if [ -n "$DEPLOYER_ACCOUNT" ] && [ "$HAVE_CAST" = 1 ]; then
  # Foundry 1.5 prints each account with a kind suffix, "arc-deployer (Local)",
  # so an exact-line match on the bare name refused a keystore that existed.
  LIST="$(with_timeout 20 cast wallet list 2>/dev/null || true)"
  if printf '%s\n' "$LIST" | sed 's/ ([^)]*)$//' | grep -qxF "$DEPLOYER_ACCOUNT" \
     || [ -f "${FOUNDRY_KEYSTORES_DIR:-$HOME/.foundry/keystores}/$DEPLOYER_ACCOUNT" ]; then
    ok "keystore account '$DEPLOYER_ACCOUNT' exists"
  else
    bad "no keystore account '$DEPLOYER_ACCOUNT'. Create it: cast wallet import $DEPLOYER_ACCOUNT --interactive"
    printf '       (cast wallet list shows: %s)\n' "$(printf '%s' "$LIST" | tr '\n' ' ' | sed 's/ $//')"
  fi
else
  warn "skipped: needs DEPLOYER_ACCOUNT and cast"
fi
if [ -n "$PASSWORD_FILE" ]; then
  if [ -r "$PASSWORD_FILE" ]; then
    ok "ETH_PASSWORD points at a readable password file, so nothing will prompt"
    PASSWORD_FLAGS=(--password-file "$PASSWORD_FILE")
  else
    bad "ETH_PASSWORD is set but '$PASSWORD_FILE' is not a readable file (it is a PATH, not the password)"
  fi
fi

step "The endpoint"
CHAIN=""; HEAD=""
if [ -n "$RPC_URL" ] && [ "$HAVE_CAST" = 1 ]; then
  CHAIN="$(with_timeout "$RPC_TIMEOUT" cast chain-id --rpc-url "$RPC_URL" 2>/dev/null | tr -d '[:space:]' || true)"
  if [ -z "$CHAIN" ]; then
    bad "the endpoint did not answer eth_chainId within ${RPC_TIMEOUT}s (wrong URL, rate limit, or it needs a key)"
  elif [ -n "$EXPECTED_CHAIN_ID" ] && [ "$CHAIN" != "$EXPECTED_CHAIN_ID" ]; then
    bad "that endpoint is chain $CHAIN, not $EXPECTED_CHAIN_ID. DO NOT DEPLOY"
  else
    ok "chain id $CHAIN matches"
    case "$CHAIN" in
      1|10|56|100|137|8453|42161|43114|59144|5042)
        warn "chain $CHAIN is a MAINNET. Real money. Confirm this is intended" ;;
    esac
    HEAD="$(with_timeout "$RPC_TIMEOUT" cast block-number --rpc-url "$RPC_URL" 2>/dev/null | tr -d '[:space:]' || true)"
    if is_uint "$HEAD"; then
      ok "head is block $HEAD: record it as the indexer/subgraph startBlock floor"
    else
      warn "could not read the head block"; HEAD=""
    fi
  fi
else
  warn "skipped: needs RPC_URL and cast"
fi

step "Gas"
if [ -n "$CHAIN" ] && [ -n "$DEPLOYER_ACCOUNT" ] && [ "$HAVE_CAST" = 1 ] && is_uint "$GAS_DECIMALS" && is_decimal "$MIN_GAS_BALANCE"; then
  ADDR="$(with_timeout 20 cast wallet address --account "$DEPLOYER_ACCOUNT" ${PASSWORD_FLAGS[@]+"${PASSWORD_FLAGS[@]}"} 2>/dev/null | tr -d '[:space:]' || true)"
  if [ -z "$ADDR" ]; then
    warn "could not read the deployer address without the keystore password, so the balance check is SKIPPED"
    warn "set ETH_PASSWORD to a password file, or run: cast balance \$(cast wallet address --account $DEPLOYER_ACCOUNT) --rpc-url \"\$RPC_URL\""
  else
    ok "deployer is $ADDR"
    BAL="$(with_timeout "$RPC_TIMEOUT" cast balance "$ADDR" --rpc-url "$RPC_URL" 2>/dev/null | tr -d '[:space:]' || true)"
    MIN_RAW="$(human_to_raw "$MIN_GAS_BALANCE" "$GAS_DECIMALS")"
    if ! is_uint "$BAL"; then
      bad "could not read the deployer balance (got '${BAL:-nothing}')"
    else
      # GAS_DECIMALS is the NATIVE balance's decimals. On Arc, USDC is 18
      # decimals natively and 6 as an ERC-20: one balance, raw values 10^12
      # apart. Reading the native figure at 6 reports a trillion times too much,
      # which is exactly how a check waves through an empty deployer.
      HUMAN="$(raw_to_human "$BAL" "$GAS_DECIMALS")"
      if [ "$BAL" = "0" ]; then
        bad "deployer holds 0 $GAS_SYMBOL. Nothing can be sent. Fund it (faucets with captchas are human-only)"
      elif raw_ge "$BAL" "$MIN_RAW"; then
        ok "deployer holds $HUMAN $GAS_SYMBOL (min $MIN_GAS_BALANCE, $GAS_DECIMALS decimals)"
      else
        bad "deployer holds $HUMAN $GAS_SYMBOL, below MIN_GAS_BALANCE=$MIN_GAS_BALANCE. Running dry mid-deploy leaves a half-deployed system"
      fi
    fi
  fi
else
  warn "skipped: needs a matching endpoint and a keystore account"
fi

step "Verification"
VERIFY_FLAGS=""
if [ -n "$VERIFIER_URL" ]; then
  case "$VERIFIER" in
    blockscout|etherscan|sourcify)
      ok "will verify inline with $VERIFIER at $VERIFIER_URL"
      VERIFY_FLAGS=" --verify --verifier $VERIFIER --verifier-url $VERIFIER_URL"
      [ "$VERIFIER" = "etherscan" ] && [ -z "${ETHERSCAN_API_KEY:-}" ] && warn "VERIFIER=etherscan but ETHERSCAN_API_KEY is not set" ;;
    *) bad "VERIFIER='$VERIFIER' must be blockscout, etherscan or sourcify" ;;
  esac
else
  warn "VERIFIER_URL not set: contracts will deploy unverified. Judges click the explorer link; verify before submitting"
fi

step "The tree"
if [ "$IN_GIT" = 1 ]; then
  if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    if [ "$REQUIRE_CLEAN_TREE" = 1 ]; then bad "working tree is dirty. Deploy from a commit you can point at later"
    else warn "working tree is dirty. Deploy from a commit you can point at later"; fi
  else
    ok "clean tree at $(git rev-parse --short HEAD)"
  fi
  # A gitlink (mode 160000) with no .gitmodules entry clones as an empty folder:
  # the build works on your machine and nowhere else.
  ORPHANS=""
  for path in $(git ls-files --stage 2>/dev/null | awk '$1 == "160000" { print $4 }'); do
    git config -f .gitmodules --get-regexp '\.path$' 2>/dev/null | awk '{ print $2 }' | grep -qxF "$path" || ORPHANS="$ORPHANS $path"
  done
  [ -n "$ORPHANS" ] && bad "gitlinks with no .gitmodules entry:$ORPHANS. Fresh clones get empty folders"
  for lock in bun.lock bun.lockb pnpm-lock.yaml package-lock.json yarn.lock; do
    if [ -f "$lock" ] && ! git ls-files --error-unmatch "$lock" >/dev/null 2>&1; then
      warn "$lock exists but is not tracked. Fresh clones (and Vercel) resolve different versions"
    fi
  done
else
  warn "not a git repository: nothing ties this deploy to a commit"
fi
if [ -f "$DEPLOYMENTS_FILE" ]; then
  warn "$DEPLOYMENTS_FILE already exists: this would be a REDEPLOY. Every reader of the old addresses must be rewired"
else
  ok "no $DEPLOYMENTS_FILE yet, as expected for a first deploy"
fi

if [ "$FAIL" -ne 0 ]; then
  printf '\n%sNOT READY.%s Fix the ✗ lines above. Nothing was sent.\n' "$R" "$N"
  exit 1
fi

PASSWORD_ARG=""
[ -n "$PASSWORD_FILE" ] && PASSWORD_ARG=" --password-file $PASSWORD_FILE"
SCRIPT_NAME="$(basename "$DEPLOY_SCRIPT")"
printf '\n%sREADY.%s The deploy command:\n\n' "$G" "$N"
cat <<CMD
  # pipefail: without it \`| tee\` exits 0 even when forge fails, and a failed
  # deploy reads as a finished one.
  set -o pipefail
  mkdir -p logs "$(dirname "$DEPLOYMENTS_FILE")"
  forge script $CONTRACTS_ROOT/$DEPLOY_SCRIPT \\
    --root $CONTRACTS_ROOT --rpc-url "\$RPC_URL" --account $DEPLOYER_ACCOUNT$PASSWORD_ARG --broadcast$VERIFY_FLAGS \\
    2>&1 | tee "logs/deploy-$CHAIN-\$(date +%Y%m%dT%H%M%S).log"

  # Record the deployment JSON: the SINGLE SOURCE OF TRUTH. Frontend config,
  # subgraph manifest, README, and submission form all copy from this file.
  jq --arg commit "\$(git rev-parse HEAD)" --argjson startBlock ${HEAD:-0} '{
      chainId: .chain, commit: \$commit, startBlock: \$startBlock, timestamp: .timestamp,
      contracts: [.transactions[] | select(.transactionType == "CREATE" or .transactionType == "CREATE2")
                  | {name: .contractName, address: .contractAddress, tx: .hash}]
    }' $CONTRACTS_ROOT/broadcast/$SCRIPT_NAME/$CHAIN/run-latest.json > $DEPLOYMENTS_FILE
  git add $DEPLOYMENTS_FILE && git commit -m "deploy: chain $CHAIN"
CMD
exit 0
