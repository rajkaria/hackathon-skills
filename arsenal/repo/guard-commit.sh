#!/usr/bin/env bash
# hackathon-guard: pre-commit hook for PUBLIC hackathon repos.
#
# Blocks a commit when the staged changes would publish:
#   (a) internal docs (strategy, prize picks, submission checklists, handoffs, agent state)
#   (b) secrets: .env files, key files, or token-shaped strings in ADDED lines
# and warns (never blocks) on operator-doc-looking files, Stripe test keys, known
# anvil/hardhat dev keys, and configured personal emails appearing in docs.
#
# Install:  bash init-internal.sh <project-dir>   (chains to any existing pre-commit hook)
# Run now:  bash guard-commit.sh                  (checks the index of the repo in $PWD)
# Library:  HG_LIB_ONLY=1 . guard-commit.sh       (defines hg_* functions only)
#
# Env:
#   HACKATHON_GUARD=off    bypass consciously:  HACKATHON_GUARD=off git commit -m ...
#   HACKATHON_GUARD=warn   report everything, never block
#   GUARD_EMAILS="me@gmail.com,cofounder@proton.me"   (or: git config --add hackathon.guardEmail me@gmail.com)
#     Keep personal emails in env/local git config — NOT in .hackathon-guard, which is committed.
#
# Config: .hackathon-guard in the repo root, one glob per line (gitignore-like):
#   STRATEGY-v2.md        basename glob, any directory
#   /drafts/              leading "/" anchors to repo root; trailing "/" means directory
#   docs/pitch/*.md       a "/" inside anchors to repo root
#   !docs/notes/          "!" = allow (overrides defaults and your own block lines)
#   # comments and blank lines ignored
#
# Inline escape hatch for a single known-safe line: add the text  hackathon-guard: allow
#
# Portable: bash 3.2 (macOS), BSD grep/sed/awk. No node, no jq.

export LC_ALL=C
HG_VERSION=1

# ---- Default path patterns -------------------------------------------------------
# Top-level folders are root-anchored: unanchored `internal/` would hit Go packages,
# unanchored `notes/` would hit a Next.js `app/notes/` route.
HG_INTERNAL_PATTERNS='/internal/
/notes/
/private/
/scratch/
.internal-docs/
*.internal.md
*.private.md
STRATEGY*.md
SUBMISSION-CHECKLIST*.md
PRIZES*.md
HANDOFF*.md
AGENT-TASKS*.md
FOUNDERS-EMAIL*.md
docs/hackathon/
.ocean/
.burn-rate/
.superpowers/
.claude/worktrees/
.claude/settings.local.json
CLAUDE.local.md'

HG_SECRET_FILE_PATTERNS='.env
.env.*
.envrc
*.pem
*.p12
*.pfx
*.jks
*.keystore
id_rsa
id_ecdsa
id_ed25519
service-account*.json
*-service-account.json
*service_account*.json
gcp-key*.json
client_secret*.json
.pypirc'

HG_SECRET_FILE_ALLOW='*.example
*.sample
*.template'

# Operator docs that are sometimes legitimately public — warn, don't block.
# (hunch-vpm shipped SUBMISSION.md / DEMO.md operator notes into its public repo.)
HG_WARN_PATTERNS='SUBMISSION*.md
DEMO-SCRIPT*.md
VIDEO-SCRIPT*.md
PITCH-SCRIPT*.md
/PLAN.md
/SPEC.md
docs/PLAN.md
docs/SPEC.md'

HG_USER_BLOCK=''
HG_USER_ALLOW=''

# ---- Secret content rules (ERE, matched per added line) --------------------------
HG_RULES=''
hg_rule() { HG_RULES="$HG_RULES$1"$'\t'"$2"$'\t'"$3"$'\n'; }
hg_rule block aws-access-key            'AKIA[0-9A-Z]{16}'
hg_rule block github-token              'gh[pousr]_[A-Za-z0-9]{36,}'
hg_rule block github-fine-grained-pat   'github_pat_[A-Za-z0-9_]{50,}'
hg_rule block npm-token                 'npm_[A-Za-z0-9]{36}'
hg_rule block pypi-token                'pypi-AgEI[A-Za-z0-9_-]{50,}'
hg_rule block slack-token               'xox[baprs]-[A-Za-z0-9-]{10,}'
hg_rule block stripe-live-key           '[sr]k_live_[A-Za-z0-9]{10,}'
hg_rule warn  stripe-test-key           'sk_test_[A-Za-z0-9]{10,}'
hg_rule block google-oauth-client-secret 'GOCSPX-[A-Za-z0-9_-]{10,}'
hg_rule block private-key-block         '-----BEGIN (RSA |EC |DSA |OPENSSH |ENCRYPTED |PGP )?PRIVATE KEY( BLOCK)?-----'
hg_rule block hex-private-key           "[Pp][Rr][Ii][Vv][Aa][Tt][Ee][_-]?[Kk][Ee][Yy][A-Za-z0-9_]*[\"']?[[:space:]]*[:=][[:space:]]*[\"']?(0x)?[0-9a-fA-F]{64}"

# Public, well-known anvil/hardhat accounts 0-2 (mnemonic "test test ... junk").
# Committing these is normal in Foundry scripts, so they downgrade to a warning.
HG_KNOWN_DEV_KEYS='ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'

# ---- Path matching -----------------------------------------------------------------
# hg_glob_match <path> <pattern>  -> 0 on match (gitignore-like semantics, see header)
hg_glob_match() {
  local path="$1" pat="$2" anchored=""
  case "$pat" in /*) anchored=1; pat="${pat#/}" ;; esac
  case "$pat" in
    */)
      pat="${pat%/}"
      case "$pat" in */*) anchored=1 ;; esac
      if [ -n "$anchored" ]; then
        case "$path" in $pat/*) return 0 ;; esac
      else
        case "/$path" in */$pat/*) return 0 ;; esac
      fi
      return 1 ;;
    */*)
      case "$path" in $pat) return 0 ;; esac
      return 1 ;;
    *)
      if [ -n "$anchored" ]; then
        case "$path" in $pat) return 0 ;; esac
      else
        case "${path##*/}" in $pat) return 0 ;; esac
      fi
      return 1 ;;
  esac
}

# hg_match_list <path> <newline-separated patterns>  -> prints first matching pattern
hg_match_list() {
  local path="$1" list="$2" pat ret=1 hadnc="" hadf="" IFS=$'\n'
  [ -z "$list" ] && return 1
  shopt -q nocasematch && hadnc=1
  case $- in *f*) hadf=1 ;; esac
  shopt -s nocasematch; set -f
  for pat in $list; do
    [ -z "$pat" ] && continue
    if hg_glob_match "$path" "$pat"; then printf '%s\n' "$pat"; ret=0; break; fi
  done
  [ -z "$hadnc" ] && shopt -u nocasematch
  [ -z "$hadf" ] && set +f
  return $ret
}

# hg_load_config  (stdin: .hackathon-guard text) -> sets HG_USER_BLOCK / HG_USER_ALLOW
hg_load_config() {
  local line
  HG_USER_BLOCK=''; HG_USER_ALLOW=''
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in \#*) continue ;; esac
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    [ -z "$line" ] && continue
    case "$line" in
      !*) HG_USER_ALLOW="$HG_USER_ALLOW${line#!}"$'\n' ;;
      *)  HG_USER_BLOCK="$HG_USER_BLOCK$line"$'\n' ;;
    esac
  done
}

# hg_classify_path <path> -> prints "<kind><TAB><pattern>", kind in
#   block-secret-file | block-internal | warn-operator ; prints nothing if clean
hg_classify_path() {
  local p="$1" m
  if m=$(hg_match_list "$p" "$HG_USER_ALLOW"); then return 0; fi
  if m=$(hg_match_list "$p" "$HG_SECRET_FILE_PATTERNS"); then
    if ! hg_match_list "$p" "$HG_SECRET_FILE_ALLOW" >/dev/null; then
      printf 'block-secret-file\t%s\n' "$m"; return 0
    fi
  fi
  if m=$(hg_match_list "$p" "$HG_INTERNAL_PATTERNS$HG_USER_BLOCK"); then
    printf 'block-internal\t%s\n' "$m"; return 0
  fi
  if m=$(hg_match_list "$p" "$HG_WARN_PATTERNS"); then
    printf 'warn-operator\t%s\n' "$m"; return 0
  fi
  return 0
}

# ---- Content scanning -------------------------------------------------------------
hg_is_dev_key() {
  local k
  k=$(printf '%s' "$1" | grep -aoE '[0-9a-fA-F]{64}$' | tr 'A-F' 'a-f')
  [ -n "$k" ] && printf '%s\n' "$HG_KNOWN_DEV_KEYS" | grep -qxF "$k"
}

# hg_mask <rule> <match> -> never prints a usable secret
hg_mask() {
  local rule="$1" m="$2" n
  case "$rule" in private-key-block) printf '%s' "$m"; return ;; esac
  case "$rule" in hex-private-key*) m=$(printf '%s' "$m" | grep -aoE '(0x)?[0-9a-fA-F]{64}$') ;; esac
  n=${#m}
  if [ "$n" -le 12 ]; then printf '****(%d chars)' "$n"
  else printf '%s****(%d chars)' "$(printf '%s' "$m" | cut -c1-6)" "$n"; fi
}

# hg_scan_stream <file of "location<TAB>added line"> -> "sev<TAB>rule<TAB>location<TAB>masked"
hg_scan_stream() {
  local stream="$1" rules="$1.rules" hits="$1.hits" sev rule re loc content m s r
  printf '%s' "$HG_RULES" > "$rules"
  while IFS=$'\t' read -r sev rule re; do
    [ -z "$re" ] && continue
    grep -aE -e "$re" "$stream" 2>/dev/null | grep -avF 'hackathon-guard: allow' > "$hits"
    [ -s "$hits" ] || continue
    while IFS=$'\t' read -r loc content; do
      m=$(printf '%s\n' "$content" | grep -aoE -e "$re" | head -n 1)
      [ -z "$m" ] && continue
      s="$sev"; r="$rule"
      if [ "$rule" = hex-private-key ] && hg_is_dev_key "$m"; then
        s=warn; r="hex-private-key (known anvil/hardhat dev key)"
      fi
      printf '%s\t%s\t%s\t%s\n' "$s" "$r" "$loc" "$(hg_mask "$rule" "$m")"
    done < "$hits"
  done < "$rules"
  rm -f "$rules" "$hits"
}

# hg_diff_to_stream [loc-prefix-mode]  (stdin: unified diff; `git log -p --format='commit %H'` ok)
#   -> "path<TAB>line" (or "<sha7> path<TAB>line" when commit headers are present)
hg_diff_to_stream() {
  awk '
    /^commit [0-9a-f]+$/ { sha = substr($2, 1, 7); hdr = 0; path = ""; next }
    /^diff --git / { hdr = 1; path = ""; next }
    hdr && /^\+\+\+ / {
      path = substr($0, 5); gsub(/^"|"$/, "", path); sub(/^b\//, "", path); next
    }
    /^@@/ { hdr = 0; next }
    !hdr && path != "" && /^\+/ {
      loc = (sha != "") ? sha " " path : path
      print loc "\t" substr($0, 2)
    }
  '
}

# hg_email_list -> configured personal emails, one per line
hg_email_list() {
  { printf '%s\n' "${GUARD_EMAILS:-}" | tr ', ;' '\n\n\n'
    git config --get-all hackathon.guardEmail 2>/dev/null
  } | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' | grep -a '@' | sort -u
}

# hg_scan_emails <stream> <emails-file> -> "warn<TAB>personal-email<TAB>loc<TAB>email" for docs
hg_scan_emails() {
  local stream="$1" emails="$2" loc content e
  [ -s "$emails" ] || return 0
  awk -F '\t' '{ p = tolower($1) } p ~ /\.(md|mdx|markdown|txt|rst|html?|adoc)$/' "$stream" \
    | grep -aiF -f "$emails" > "$stream.emails" 2>/dev/null
  while IFS=$'\t' read -r loc content; do
    while IFS= read -r e; do
      [ -z "$e" ] && continue
      if printf '%s\n' "$content" | grep -aqiF -e "$e"; then
        printf 'warn\tpersonal-email\t%s\t%s\n' "$loc" "$e"
      fi
    done < "$emails"
  done < "$stream.emails"
  rm -f "$stream.emails"
}

# ---- Hook entrypoint ---------------------------------------------------------------
hg_main() {
  local mode top tmp p kind pat sev rule loc masked nblock=0 nwarn=0
  case "${HACKATHON_GUARD:-on}" in
    off|OFF|0|false|skip)
      echo "hackathon-guard: bypassed (HACKATHON_GUARD=off). You own what this commit publishes." >&2
      return 0 ;;
    warn|WARN) mode=warn ;;
    *) mode=block ;;
  esac

  top=$(git rev-parse --show-toplevel 2>/dev/null) || return 0
  tmp=$(mktemp -d "${TMPDIR:-/tmp}/hackathon-guard.XXXXXX") || return 0
  trap 'rm -rf "$tmp"' EXIT

  [ -f "$top/.hackathon-guard" ] && hg_load_config < "$top/.hackathon-guard"

  : > "$tmp/findings"
  git diff --cached --name-only -z --diff-filter=ACMR > "$tmp/paths"
  while IFS= read -r -d '' p; do
    IFS=$'\t' read -r kind pat <<EOF
$(hg_classify_path "$p")
EOF
    case "$kind" in
      block-secret-file) printf 'block\tsecret file staged: %s   (pattern %s)\n' "$p" "$pat" >> "$tmp/findings" ;;
      block-internal)    printf 'block\tinternal doc staged: %s   (pattern %s)\n' "$p" "$pat" >> "$tmp/findings" ;;
      warn-operator)     printf 'warn\toperator-doc-looking file: %s   (pattern %s) — public on purpose?\n' "$p" "$pat" >> "$tmp/findings" ;;
    esac
  done < "$tmp/paths"

  git diff --cached -U0 --no-color --no-ext-diff --no-textconv --diff-filter=ACMR \
    | hg_diff_to_stream > "$tmp/stream"
  hg_email_list > "$tmp/emails"
  { hg_scan_stream "$tmp/stream"; hg_scan_emails "$tmp/stream" "$tmp/emails"; } \
    | sort -u | while IFS=$'\t' read -r sev rule loc masked; do
        if [ "$rule" = personal-email ]; then
          printf 'warn\tpersonal email %s added in %s\n' "$masked" "$loc"
        else
          printf '%s\t%s added in %s: %s\n' "$sev" "$rule" "$loc" "$masked"
        fi
      done >> "$tmp/findings"

  [ -s "$tmp/findings" ] || return 0
  nblock=$(grep -c '^block' "$tmp/findings")
  nwarn=$(grep -c '^warn' "$tmp/findings")

  {
    echo
    if [ "$nblock" -gt 0 ] && [ "$mode" = block ]; then
      echo "hackathon-guard: COMMIT BLOCKED — $nblock problem(s), $nwarn warning(s). This repo is public."
    else
      echo "hackathon-guard: $nblock problem(s), $nwarn warning(s) (not blocking)."
    fi
    echo
    grep '^block' "$tmp/findings" | cut -f2- | sed 's/^/  ✗ /'
    grep '^warn'  "$tmp/findings" | cut -f2- | sed 's/^/  ! /'
    echo
    if [ "$nblock" -gt 0 ]; then
      echo "Fix:"
      echo "  internal doc  -> git restore --staged <path>; move it to ../<project>-internal/"
      echo "  secret        -> remove the value, reference the ENV VAR NAME instead, and ROTATE the key now"
      echo "                   (assume it is burned if it was ever pasted into chat or pushed)"
      echo "  false positive -> add '!<glob>' to .hackathon-guard, or 'hackathon-guard: allow' on that line"
      echo "Bypass consciously, after checking every line above:"
      echo "  HACKATHON_GUARD=off git commit ..."
    fi
    echo
  } >&2

  if [ "$nblock" -gt 0 ] && [ "$mode" = block ]; then return 1; fi
  return 0
}

if [ -z "${HG_LIB_ONLY:-}" ]; then
  hg_main "$@"
  exit $?
fi
